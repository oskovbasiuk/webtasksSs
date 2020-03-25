const express = require('express');
const router = express.Router();
const NewsModel = require('../models/News');
const AppealsModel = require('../models/Appeals');

router.get('/news', async (req, res, next) => {
  const news = await NewsModel.find();
  res.json(news);
});
router.get('/appeals', async (req, res, next) => {
  const appeals = await AppealsModel.find();
  res.json(appeals);
});

router.post('/news', async (req, res, next) => {
  const news = req.body;
  if (!news.header || !news.body || !news.img) {
    res.status(400).json({
      error: 'bad data request'
    });
  } else {
    const itemToSave = new NewsModel({ ...news });
    const result = await itemToSave.save();
    res.json(result);
  }
});

router.post('/appeals', async (req, res, next) => {
  const appeal = req.body;
  if (!appeal.text || !appeal.date || !appeal.time) {
    res.status(400).json({
      error: 'bad data request'
    });
  } else {
    const itemToSave = new AppealsModel({ ...appeal });
    const result = await itemToSave.save();
    res.json(result);
  }
});

module.exports = router;
