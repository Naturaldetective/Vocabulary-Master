# Vocabulary Master - 词汇学习管理工具

## 一、项目简介
Vocabulary Master 是一款专注于个人词汇学习与管理的 Web 应用，帮助用户高效积累、复习单词，适用于语言学习者（如英语四六级、雅思托福备考者）、外语爱好者，助力打造专属词汇库，通过合理的复习提醒机制强化记忆。

## 二、针对人群
1. **语言学习者**：备考英语四六级、雅思、托福等考试，需要系统积累和复习词汇的学生。
2. **外语爱好者**：自学小语种（如日语、法语等），想持续扩充词汇量、管理学习内容的人群。 
3. **教育工作者**：可用于辅助学生进行词汇作业布置、词汇学习情况跟踪（需简单改造适配教学场景）。

## 三、功能概览
1. **单词管理**：支持手动添加单词（含释义、分类），可批量从数据库导入单词，便捷管理个人词汇库。 
2. **复习提醒**：自动为新增单词安排复习计划（基于间隔重复算法，需后端定时任务支持完善）。 
3. **筛选排序**：按单词名称、添加时间排序，支持关键词搜索快速定位单词。 
4. **用户认证**：基础的登录退出功能，保障个人词汇数据隐私。 

## 四、使用说明
### （一）环境依赖
- **前端**：浏览器需支持 ES6 及以上特性，推荐使用 Chrome、Edge 最新版。 
- **后端**：依赖 Docker。 


### （二）生产环境使用（Docker 部署）
1. **准备环境**  
确保已安装 Docker、Docker Compose，克隆项目到服务器：  
```bash
git clone https://github.com/Naturaldetective/Vocabulary-Master.git
cd vocabulary-master
```
2. **修改配置**  
- 编辑 `frontend/index.html` 中 `API_BASE_URL`，若后端通过 Docker 部署且在同一网络，可修改为后端服务名（如 `http://backend:3000/api/words` ，需配合 `docker-compose.yml` 网络配置）；若暴露公网 IP，替换为实际服务器公网 IP（如 `http://1.2.3.4:3000/api/words` ，上线后建议用反向代理优化）。  
- 确认 `docker-compose.yml` 中各服务端口、镜像、挂载卷配置符合需求。  
3. **启动服务**  
```bash
docker-compose up -d 
```
4. **访问应用**  
浏览器访问服务器公网 IP + 前端端口（如 `http://1.2.3.4:8443` ，根据 `docker-compose.yml` 中前端 Nginx 配置确认），登录后使用词汇管理功能。  


## 五、部署指南
### （一）Docker 快速部署（推荐）
1. **服务器环境准备**  
- 安装 Docker、Docker Compose：  
  - Ubuntu/Debian：  
```bash
sudo apt update 
sudo apt install docker.io docker-compose 
sudo systemctl enable --now docker 
```
  - CentOS/RHEL：  
```bash
sudo yum install docker docker-compose 
sudo systemctl enable --now docker 
```
- 开放端口：确保服务器安全组/防火墙开放 `8443`（前端）、`3000`（后端）、`27017`（MongoDB，生产环境建议仅内部访问）端口。  
2. **项目部署**  
按“生产环境使用（Docker 部署）”步骤操作，通过 `docker-compose up -d` 启动服务，即可完成部署。  


### （二）手动部署（了解流程用）
1. **部署 MongoDB**  
- 安装 MongoDB：参考[官方文档](https://www.mongodb.com/docs/manual/installation/)完成安装，启动服务并创建 `vocabulary` 数据库。  
- 配置连接：在后端 `server.js` 中，修改 `MONGO_URI` 为实际 MongoDB 连接地址（如 `mongodb://localhost:27017/vocabulary` ）。  
2. **部署后端**  
- 进入后端目录，安装依赖、启动服务：  
```bash
cd backend 
npm install 
node server.js 
```
3. **部署前端**  
- 进入前端目录，构建生产包（若用构建工具）：  
```bash
cd frontend 
npm run build 
```
- 将构建后的静态文件（如 `dist` 目录）部署到 Web 服务器（如 Nginx），配置反向代理指向后端服务：  
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        root /path/to/frontend/dist; 
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000/api; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
- 重启 Nginx 服务，访问域名即可使用。  


## 六、注意事项
1. **数据备份**：定期备份 MongoDB 数据（通过 `mongodump` 等工具），避免数据丢失。  
2. **安全配置**：生产环境中，MongoDB 需配置访问权限（设置用户名密码），后端接口添加身份验证（如 JWT），前端避免硬编码敏感信息。  
3. **功能完善**：当前复习提醒功能需补充定时任务实现（如用 Node.js `node-schedule` 库），可根据需求扩展。  


通过以上说明，用户可快速了解项目价值、使用方式与部署流程，助力高效管理个人词汇学习！ 
