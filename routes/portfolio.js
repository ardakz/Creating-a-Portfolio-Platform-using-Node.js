const express = require('express');
const router = express.Router();
const {
    getPortfolioItems,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    getEditPage,
} = require('../controllers/portfolioController');

// Просмотр всех элементов
router.get('/', getPortfolioItems);

// Страница редактирования элемента
router.get('/edit/:id', getEditPage);

// Добавление нового элемента
router.post('/create', createPortfolioItem);

// Обновление элемента
router.post('/update/:id', updatePortfolioItem);

// Удаление элемента
router.post('/delete/:id', deletePortfolioItem);

module.exports = router;
