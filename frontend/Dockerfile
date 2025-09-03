FROM nginx:alpine

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制前端文件到Nginx服务目录
COPY index.html /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]

