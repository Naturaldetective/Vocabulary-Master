const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');
const mongoose = require('mongoose');

// 获取所有单词（支持搜索）
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // 如果有搜索参数，添加模糊查询条件
    if (search) {
      query = {
        $or: [
          { word: { $regex: search, $options: 'i' } },
          { definition: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const words = await Vocabulary.find(query).sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ message: 'Server error while fetching words' });
  }
});

// 获取单个单词
router.get('/:id', async (req, res) => {
  try {
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid word ID format' });
    }

    const word = await Vocabulary.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json(word);
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ message: 'Server error while fetching word' });
  }
});

// 添加新单词
router.post('/', async (req, res) => {
  try {
    const { word, definition, category } = req.body;

    // 验证必填字段
    if (!word || !definition) {
      return res.status(400).json({ message: 'Word and definition are required' });
    }

    // 创建新单词
    const newWord = new Vocabulary({
      word,
      definition,
      category: category || ''
    });

    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ message: 'Server error while adding word' });
  }
});

// 修改单词（新增接口）
router.put('/:id', async (req, res) => {
  try {
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid word ID format' });
    }

    const { word, definition, category } = req.body;

    // 验证必填字段
    if (!word || !definition) {
      return res.status(400).json({ message: 'Word and definition are required' });
    }

    // 查找并更新单词
    const updatedWord = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      { word, definition, category: category || '' },
      { new: true, runValidators: true } // new: 返回更新后的文档；runValidators: 启用验证
    );

    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json(updatedWord);
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).json({ message: 'Server error while updating word' });
  }
});

// 删除单词
router.delete('/:id', async (req, res) => {
  try {
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid word ID format' });
    }

    const word = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ message: 'Server error while deleting word' });
  }
});

module.exports = router;

