# Added .dockerignore file that includes node_modules
FROM node:22.16.0-bullseye-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json .env .sequelizerc ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

USER node

COPY --chown=node:node ./src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]
