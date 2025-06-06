# Build stage ------------------------------------
FROM node:22.16.0-bullseye AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/user/src/app/.npm \
  npm set cache /user/src/app/.npm && \
  npm ci

COPY . .

RUN npm run build

# Run stage -----------------------------------
FROM nginxinc/nginx-unprivileged:1.22-alpine-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build usr/src/app/dist/ /user/share/nginx/html

EXPOSE 8080