'use strict';

exports.getInfo = getInfo;

const AmbientWeatherApi = require('ambient-weather-api');

const ambientWeatherApiKey = process.env.AMBIENT_API_KEY || "";
const ambientWeatherAppKey = process.env.AMBIENT_APPLICATION_KEY || "";

const api = new AmbientWeatherApi({
    apiKey: ambientWeatherApiKey,
    applicationKey: ambientWeatherAppKey
});

async function getInfo() {
    const sensors = await api.userDevices();

    return sensors;
}
