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

DATABASE_URL:=postgres://merchant:foobarbaz@db:5432/db

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
	@echo "Deliting backend"
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

include $(CI_ENVFILE)
export

CI_IMAGE=davidalej/tm-backend-ci:$(GITHUB_RUN_ID)
CI_DOCKERFILE=backend/dockerfiles/Dockerfile.10
CI_COMPOSEFILE=docker-compose.integration-test.yml 
CI_ENVFILE=ci.env

## nektos/act
### Testing workflows using nektos/act. Works with simple actions (not k3d action)

.PHONY: run-backend-workflow
run-backend-workflow:
	act -W .github/workflows/backend.yml --secret-file $(CI_ENVFILE)

## Push and Build testing image

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

## CI integration tests
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
K3D_CONFIG = k3d-config.yml
K3D_MANIFESTS = manifests

.PHONY: create-k3d
create-k3d:
	k3d cluster create $(K3D_NAME) --config $(K3D_CONFIG)

.PHONY: sercets-k3d
secrets-k3d:
	kubectl create secret docker-registry regcred \
		--docker-username=$(DOCKERHUB_USERNAME) \
		--docker-password=$(DOCKERHUB_TOKEN) && \
	kubectl create secret generic backend-secrets \
		--from-literal=COOKIES_SECRET=$(COOKIES_SECRET) \
		--from-literal=CSRF_SECRET=$(CSRF_SECRET) \
		--from-literal=CSRF_COOKIE_NAME=$(CSRF_COOKIE_NAME)

.PHONY: add-k3d
add-k3d:
	kubectl apply -f manifests/01-db.yml
	kubectl apply -f manifests/02-my-redis.yml
	export TESTING_IMAGE=$(CI_IMAGE) && \
		envsubst < manifests/03-backend.yml  | kubectl apply -f -

.PHONY: log-k3d
log-k3d:
	@echo "==== Jobs ====" && \
		kubectl get jobs -A && \
		echo "==== Pods ====" && \
		kubectl get pods -A -o wide && \
		echo "==== All pod logs ====" && \
		for pod in $$(kubectl get pods -o name); do \
			echo "---- Logs from $$pod ----"; \
			kubectl logs "$$pod" || true; \
		done

.PHONY: test-k3d
test-k3d:
	$(MAKE) create-k3d
	$(MAKE) secrets-k3d
	$(MAKE) add-k3d
	kubectl rollout status deployment backend

.PHONY: delete-k3d
delete-k3d:
	k3d cluster delete $(K3D_NAME)