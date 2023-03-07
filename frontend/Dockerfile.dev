FROM node:18-alpine as Builder
COPY ../frontend /app/
ENV REACT_APP_BACKEND_HOST='128.199.73.179'
RUN cd /app && yarn && yarn run build

FROM nginx:1.22-alpine as Production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=Builder /app/build /usr/share/nginx/html
COPY ../frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]