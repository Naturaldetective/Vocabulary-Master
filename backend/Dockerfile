FROM node:latest

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json  ./

# 安装依赖（使用国内源加速）
RUN npm install --omit=dev --registry=https://registry.npmmirror.com

COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]

