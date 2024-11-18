const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Настройка Nodemailer для отправки писем
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Показ страницы регистрации
exports.registerPage = (req, res) => {
    res.render('auth/register', { 
        title: 'Register', 
        body: '<h1>Register Form</h1>' 
    });
};

exports.loginPage = (req, res) => {
    res.render('auth/login', { 
        title: 'Login', 
        body: '<h1>Login Form</h1>' 
    });
};


// Обработка регистрации
exports.register = async (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, firstName, lastName, age, gender });
        await newUser.save();

        // Отправка приветственного письма
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: username,
            subject: 'Welcome to Portfolio Platform',
            text: 'Thank you for registering!',
        });

        res.redirect('/auth/login');
    } catch (error) {
        if (error.code === 11000) {
            // Ошибка уникальности username
            return res.status(400).send('A user with this email already exists.');
        }
        console.error(error);
        res.status(500).send('Registration failed');
    }
};


// Обработка входа
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Проверяем, существует ли пользователь
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid credentials. User not found.');

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials. Incorrect password.');

        // Сохраняем информацию о пользователе в сессии
        req.session.user = user;

        // Перенаправляем на страницу портфолио
        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Login failed. Please try again.');
    }
};
