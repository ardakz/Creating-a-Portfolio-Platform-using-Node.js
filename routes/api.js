// routes/api.js
const express = require('express');
const router = express.Router();
const { fetchAPIData, visualizeAPIData } = require('../controllers/apiController');

// Получение данных из API
router.get('/fetch', fetchAPIData);

// Визуализация данных
router.get('/visualize', visualizeAPIData);

module.exports = router;
