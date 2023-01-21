'use strict';

exports.getInfo = getInfo;

const AmbientWeatherApi = require('ambient-weather-api');
const sqlite3DB = require('better-sqlite3');

const ambientWeatherApiKey = process.env.AMBIENT_API_KEY || "";
const ambientWeatherAppKey = process.env.AMBIENT_APPLICATION_KEY || "";

const api = new AmbientWeatherApi({
    apiKey: ambientWeatherApiKey,
    applicationKey: ambientWeatherAppKey
});

async function getInfo() {
    const sensors = await api.userDevices();
    
    // Just use the first device since we don't currently have multiple
    // devices.
    const sensorData = await api.deviceData(sensors[0].macAddress, { limit: 3 });

    console.log(JSON.stringify(sensorData, null, 2));

    /*api.userDevices()
.then((devices) => {

  devices.forEach((device) => {
    // fetch the most recent data
    api.deviceData(device.macAddress, {
      limit: 5
    })
    .then((deviceData) => {
      console.log('The 5 most recent temperature reports for ' + device.info.name + ' - ' + device.info.location + ':')
      deviceData.forEach((data) => {
        console.log(data.date + ' - ' + data.tempf + '°F')
      })
      console.log('---')
    })
  })
})*/

    return sensors;
}

function startAmbientWeatherRetrieval() {
    saveAmbientWeatherReading();
}

async function saveAmbientWeatherReading() {
    const sensors = await api.userDevices();

    // Just use the first device since we don't currently have multiple
    // devices. Get the last three readings.
    const sensorData = await api.deviceData(sensors[0].macAddress, { limit: 3 });

    let ambientweatherdb = new sqlite3DB('./db/homesensors.db', { verbose: console.log });
    ambientweatherdb.pragma('journal_mode = WAL');

    // Save data before this

    ambientweatherdb.close();
}
