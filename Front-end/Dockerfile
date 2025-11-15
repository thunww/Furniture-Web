FROM nginx:alpine

# Xóa config default
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy cấu hình Nginx của FE
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy dist đã build sẵn (anh upload từ local)
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
