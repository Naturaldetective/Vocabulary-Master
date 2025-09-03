const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wordsRouter = require('./routes/words');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vocabulary';

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据

// 路由
app.use('/api/words', wordsRouter);

// 根路由测试
app.get('/', (req, res) => {
  res.json({ message: 'Vocabulary API is running' });
});

// 连接MongoDB并启动服务
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // 连接失败时退出进程
  });

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

