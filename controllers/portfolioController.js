const PortfolioItem = require('../models/PortfolioItem');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.getPortfolioItems = async (req, res) => {
    try {
        const items = await PortfolioItem.find(); 
        res.render('portfolio/index', {
            title: 'Portfolio',
            items, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching portfolio items');
    }
};


// Страница редактирования элемента
exports.getEditPage = async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid ID format');
        }

        // Ищем элемент в базе данных
        const item = await PortfolioItem.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Portfolio item not found');
        }

        // Передаём элемент в шаблон
        res.render('portfolio/edit', { title: 'Edit Item', item });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading edit page');
    }
};

// Добавление нового элемента
exports.createPortfolioItem = async (req, res) => {
    const { title, description, images } = req.body;

    try {
        const newItem = new PortfolioItem({
            title,
            description,
            images: images.split(',').map(img => img.trim()),
        });
        await newItem.save();


        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'ardakabdullaev1314@gmail.com', 
            subject: 'New Portfolio Item Added',
            text: `A new portfolio item was added: ${title}`,
        });



        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating portfolio item');
    }
};

// Обновление элемента
exports.updatePortfolioItem = async (req, res) => {
    const { title, description, images } = req.body;

    try {
        await PortfolioItem.findByIdAndUpdate(req.params.id, {
            title,
            description,
            images: images.split(',').map(img => img.trim()),
        });
        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating portfolio item');
    }
};


exports.deletePortfolioItem = async (req, res) => {
    try {
        await PortfolioItem.findByIdAndDelete(req.params.id);
        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting portfolio item');
    }
};
