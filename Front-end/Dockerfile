# --------------------------
# 1) BUILD STAGE - VITE
# --------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files trước để tối ưu cache
COPY package*.json ./

RUN npm install

# Copy toàn bộ FE vào
COPY . .

# Build ra thư mục dist
RUN npm run build



# --------------------------
# 2) RUN STAGE - NGINX
# --------------------------
FROM nginx:alpine

# Xóa default config của Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy config Nginx custom (em tạo file bên dưới)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy FE build (dist) vào nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
