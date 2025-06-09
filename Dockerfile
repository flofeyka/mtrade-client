FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install

COPY . . 

RUN yarn run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]