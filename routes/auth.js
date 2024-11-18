const express = require('express');
const router = express.Router();
const { registerPage, loginPage, register, login } = require('../controllers/authController');

// Отображение страниц
router.get('/register', registerPage);
router.get('/login', loginPage);

// Обработка форм
router.post('/register', register);
router.post('/login', login);

module.exports = router;
