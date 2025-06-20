# DOCKER RUN

## Redis

.PHONY: run-redis
run-redis:
	@echo "Run redis container"
	docker volume rm redis-data
	docker run -d \
		--name my-redis \
		--network tm-network \
		-v redis-data:/data \
		-p 6379:6379 \
		--restart unless-stopped \
		redis:alpine3.16

## Database

.PHONY: run-db
run-db:
	@echo "Run postgres container"
	docker volume rm pgdata
	docker run -d \
		--name db \
		--network tm-network \
		-e POSTGRES_USER=merchant \
		-e POSTGRES_PASSWORD=foobarbaz \
		-e POSTGRES_DB=db \
		-v pgdata:/var/lib/postgresql/data \
		--restart unless-stopped \
		postgres:15.1-alpine

## Backend

DATABASE_URL=postgres://merchant:foobarbaz@db:5432/db

.PHONY: build-backend
build-backend:
	docker build -t tm-backend -f backend/dockerfiles/Dockerfile.7 backend/

.PHONY: run-backend
run-backend:
	docker run -d \
		--name tm-backend \
		--network tm-network \
		--env-file backend/.env \
		-e DATABASE_URL=${DATABASE_URL} \
		-e REDIS_HOST=my-redis \
		-e NODE_ENV=production \
		-p 3000:3000 \
		--restart unless-stopped \
		tm-backend

.PHONY: start-backend
start-backend:
	@echo "Deleting backend"
	$(MAKE) del-tm-backend
	@echo "Building and running backend container"
	$(MAKE) build-backend
	$(MAKE) run-backend

## Nginx frontend

.PHONY: build-nginx
build-nginx:
	docker build -t tm-frontend-ngnix -f frontend/dockerfiles/Dockerfile.5 frontend/

.PHONY: run-nginx
run-nginx:
	docker run -d \
		--name tm-frontend-nginx \
		--network tm-network \
		-p 8081:8080 \
		--restart unless-stopped \
		tm-frontend-ngnix

.PHONY: start-nginx
start-nginx:
	@echo "Deliting nginx container"
	$(MAKE) del-tm-frontend-nginx
	@echo "Building and running nginx container"
	$(MAKE) build-nginx
	$(MAKE) run-nginx

## Vite frontend

.PHONY: build-vite
build-vite:
	docker build -t tm-frontend-vite -f frontend/dockerfiles/Dockerfile.3 frontend/

.PHONY: run-vite
run-vite:
	docker run -d \
		--name tm-frontend-vite \
		--network tm-network \
		-v ${PWD}/frontend/dockerfiles/vite.config.js:/usr/src/app/vite.config.js \
		-p 5174:5173 \
		--restart unless-stopped \
		tm-frontend-vite

.PHONY: start-vite
start-vite:
	@echo "Deliting vite container"
	$(MAKE) del-tm-frontend-vite
	@echo "Building and running vite container"
	$(MAKE) build-vite
	$(MAKE) run-vite

### Stop and remove docker container

.PHONY: del-%
del-%:
	@echo "Stopping and removing container: $*"
	-docker stop $* || true
	-docker rm $* || true

# DOCKER COMPOSE

DEV_COMPOSE_FILE=docker-compose-dev.yml
DEBUG_COMPOSE_FILE=docker-compose-debug.yml
TEST_COMPOSE_FILE=docker-compose-test.yml

### DOCKER COMPOSE COMMANDS

.PHONY: compose-build
compose-build:
	docker compose -f $(DEV_COMPOSE_FILE) build

.PHONY: compose-up
compose-up:
	docker compose -f $(DEV_COMPOSE_FILE) up

.PHONY: compose-up-build
compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

.PHONY: compose-up-debug-build
compose-up-debug-build:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) up --build

.PHONY: compose-down
compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

### Tests

.PHONY: run-tests
run-tests:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build backend


# CI with Github actions
### This is testing backend workflow only locally.

CI_ENVFILE=ci.env
CI_DOCKERFILE=backend/dockerfiles/Dockerfile.10
CI_COMPOSEFILE=docker-compose.integration-test.yml

include $(CI_ENVFILE)
export

CI_IMAGE=davidalej/tm-backend-ci:$(GITHUB_RUN_ID)

## nektos/act jobs
### Testing workflows using nektos/act. Works with simple actions (not k3d action or Trivy scans upload). Trivy scans upload need github token i.e. github personal access toekn
### WARNING: Running test-k3d will fail so use k3d make script "k3d-test".

.PHONY: act-integration
act-integration:
	act -j test-integration --secret-file $(CI_ENVFILE)

.PHONY: act-unit
act-unit:
	act -j test-unit --secret-file $(CI_ENVFILE)

# Comment out "Upload Trivy scan ..." step to have this job run. The commented out step does not work with act.
.PHONY: act-scan
act-scan:
	act -j scan-image --secret-file $(CI_ENVFILE)

# Comment out needs property on job to just run build final image
.PHONY: act-final
act-final:
	act -j build-final-image --secret-file $(CI_ENVFILE)


## Docker Push and Build Testing Image

.PHONY: ci-build
ci-build: 
	docker build -t $(CI_IMAGE) \
		-f ./backend/dockerfiles/Dockerfile.10 \
		--target test \
		./backend

.PHONY: ci-push
ci-push:
	docker push $(CI_IMAGE)

.PHONY: ci-build-push
ci-build-push:
	$(MAKE) ci-build
	$(MAKE) ci-push

## Docker Compose CI Integration Tests
### Testing ci integration test using docker compose

.PHONY: run-ci-integration
run-ci-integration:
	$(MAKE) ci-build
	env $(cat CI_ENVFILE | xargs) TESTING_IMAGE=$(CI_IMAGE) \
		docker compose -f $(CI_COMPOSEFILE) \
		up \
		--build --exit-code-from sut

.PHONY: stop-ci-integration
stop-ci-integration:
	env $(cat CI_ENVFILE | xargs) TESTING_IMAGE=$(CI_IMAGE) \
	  docker compose -f $(CI_COMPOSEFILE) down --remove-orphans

## k3d testing
### Testing ci k3d cluster using k3d

K3D_NAME = test-cluster
K3D_MANIFESTS = manifests
K3D_CONFIG = $(K3D_MANIFESTS)/k3d-config.yml

.PHONY: k3d-create
k3d-create:
	k3d cluster create $(K3D_NAME) --config $(K3D_CONFIG)

.PHONY: k3d-sercets
k3d-secrets:
	kubectl create secret docker-registry regcred \
		--docker-username=$(DOCKERHUB_USERNAME) \
		--docker-password=$(DOCKERHUB_TOKEN) && \
	kubectl create secret generic backend-secrets \
		--from-literal=COOKIES_SECRET=$(COOKIES_SECRET) \
		--from-literal=CSRF_SECRET=$(CSRF_SECRET) \
		--from-literal=CSRF_COOKIE_NAME=$(CSRF_COOKIE_NAME)

.PHONY: k3d-add
k3d-add:
	kubectl apply -f manifests/01-db.yml
	kubectl apply -f manifests/02-my-redis.yml
	export TESTING_IMAGE=$(CI_IMAGE) && \
		envsubst < manifests/03-backend.yml  | kubectl apply -f -

.PHONY: k3d-log
k3d-log:
	@echo "==== Jobs ====" && \
		kubectl get jobs -A && \
		echo "==== Pods ====" && \
		kubectl get pods -A -o wide && \
		echo "==== All pod logs ====" && \
		for pod in $$(kubectl get pods -o name); do \
			echo "---- Logs from $$pod ----"; \
			kubectl logs "$$pod" || true; \
		done

.PHONY: k3d-test
k3d-test:
	$(MAKE) k3d-create
	$(MAKE) k3d-secrets
	$(MAKE) k3d-add
	kubectl rollout status deployment backend

.PHONY: k3d-delete
k3d-delete:
	k3d cluster delete $(K3D_NAME)

## Trivy Security Scan

.PHONY: trivy-scan
trivy-scan:
	docker run --rm \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v "$(GITHUB_WORKSPACE)":/output \
		aquasec/trivy image \
		--ignore-unfixed \
		--severity CRITICAL,HIGH \
		--exit-code 1 \Upload Trivy scan
		--output /output/trivy-results.sarif \
		$(CI_IMAGE)

.PHONY: trivy-log
trivy-log:
	less trivy-debug.log

# Frontend CI with Github actions

## nektos/act Workflow
### Testing workflows using nektos/act.

.PHONY: act-frontend
act-frontend:
	act -W '.github/workflows/frontend.yml' --secret-file $(CI_ENVFILE)
