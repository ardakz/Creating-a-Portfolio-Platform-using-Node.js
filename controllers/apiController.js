const axios = require('axios');

const FIRST_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.WEATHER_API_KEY}&units=metric`;
const SECOND_API_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`;

// Получение данных из API
exports.fetchAPIData = async (req, res) => {
    try {
        const [weatherResponse, cryptoResponse] = await Promise.all([
            axios.get(FIRST_API_URL),
            axios.get(SECOND_API_URL),
        ]);

        const weatherData = weatherResponse.data;
        const cryptoData = cryptoResponse.data;

        res.render('api/data', { weatherData, cryptoData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching API data');
    }
};

// Визуализация данных
exports.visualizeAPIData = async (req, res) => {
    try {
        const { data } = await axios.get(FIRST_API_URL);

        // Данные для графика
        const chartData = [
            { label: 'Temperature', value: data.main.temp },
            { label: 'Feels Like', value: data.main.feels_like },
            { label: 'Humidity', value: data.main.humidity }
        ];

        res.render('api/visualize', { data: chartData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error visualizing API data');
    }
};
