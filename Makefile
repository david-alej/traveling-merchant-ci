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

.PHONY: run-ci-integration
run-ci-integration:
	docker build -t tm-backend-ci -f backend/dockerfiles/Dockerfile.10 --target test backend/
	TESTING_IMAGE=tm-backend-ci \
		COOKIES_SECRET=AwW5XWhJhxfLZUtgzC_LLDhgN6yTaeNGLVXk27m1R53D7K3aBwTkLrDYYZaLe_WB \
		CSRF_SECRET=2ESeKzkR4QdQ5-SqWWF0RANSaitHUJ8d9YbZUu1lpr0R-cIffCzBKDJHQ7z5KNSd \
		CSRF_COOKIE_NAME=psifi.x-csrf-token \
		docker compose -f docker-compose.integration-test.yml \
		up \
		--build --exit-code-from sut

.PHONY: stop-ci-integration
stop-ci-integration:
	TESTING_IMAGE=tm-backend-ci \
		COOKIES_SECRET=AwW5XWhJhxfLZUtgzC_LLDhgN6yTaeNGLVXk27m1R53D7K3aBwTkLrDYYZaLe_WB \
		CSRF_SECRET=2ESeKzkR4QdQ5-SqWWF0RANSaitHUJ8d9YbZUu1lpr0R-cIffCzBKDJHQ7z5KNSd \
		CSRF_COOKIE_NAME=psifi.x-csrf-token \
	  docker compose -f docker-compose.integration-test.yml down --remove-orphans