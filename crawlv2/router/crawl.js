const express = require('express');
const router = express.Router();
const crawlProduct = require('../controller/crawlProduct')
router.get('/product', crawlProduct.crawlProduct)
module.exports = router;