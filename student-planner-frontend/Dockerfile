FROM node:20.18-alpine as builder
WORKDIR /app
COPY . .
ARG BACKEND_ADDRESS
ENV BACKEND_ADDRESS $BACKEND_ADDRESS
RUN npm i
RUN npm run build

FROM nginx:1.27
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]