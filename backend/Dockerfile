FROM node:18-alpine as Builder
RUN yarn global add typescript @nestjs/cli
COPY ../backend /app/
RUN cd /app && yarn && yarn run build

FROM node:18-alpine as Production
WORKDIR /app
COPY --from=Builder /app .
CMD node ./dist/main