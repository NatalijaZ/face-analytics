FROM node:current-alpine

WORKDIR /usr/source

ADD . ./
RUN ls -la

RUN apk add --no-cache curl
RUN npm i --production
