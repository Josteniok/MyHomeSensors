'use strict';

exports.getInfo = getInfo;
exports.startAmbientWeatherRetrieval = startAmbientWeatherRetrieval;
exports.getAmbientWeatherDataFromDB = getAmbientWeatherDataFromDB;

const AmbientWeatherApi = require('ambient-weather-api');
const sqlite3DB = require('better-sqlite3');

const ambientWeatherTableName = 'ambientweather';

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

function startAmbientWeatherRetrieval() {
    saveAmbientWeatherReading();
    let ambientAirRetriever = setInterval(saveAmbientWeatherReading, 120000);
}

async function saveAmbientWeatherReading() {
    const sensors = await api.userDevices();

    // Just use the first device since we don't currently have multiple
    // devices. Get the last three readings.
    // const sensorData = await api.deviceData(sensors[0].macAddress, { limit: 3 });

    let lastData = sensors[0].lastData;

    let ambientairinsertvalues = [
      lastData.dateutc,
      lastData.date,
      lastData.baromrelin,
      lastData.baromabsin,
      lastData.tempf,
      lastData.tempinf,
      lastData.temp1f,
      lastData.humidity,
      lastData.humidityin,
      lastData.humidity1,
      lastData.winddir,
      lastData.windspeedmph,
      lastData.windspdmph_avg10m,
      lastData.windgustmph,
      lastData.maxdailygust,
      lastData.hourlyrainin,
      lastData.eventrainin,
      lastData.dailyrainin,
      lastData.weeklyrainin,
      lastData.monthlyrainin,
      lastData.yearlyrainin,
      lastData.solarradiation,
      lastData.uv,
      lastData.dewPoint,
      lastData.dewPointin,
      lastData.dewPoint1,
      lastData.lastRain,
      lastData.tz
    ];

    let ambientweatherdb = new sqlite3DB('./db/homesensors.db', { verbose: console.log });
    ambientweatherdb.pragma('journal_mode = WAL');

    let ambientairinsertsqlstatement = ambientweatherdb.prepare('INSERT INTO ' 
        + ambientWeatherTableName
        + ' (dateutc, datez, baromrelin, baromabsin, tempf, tempinf,'
        + ' temp1f, humidity, humidityin, humidity1, winddir, windspeedmph,'
        + ' windspdmph_avg10m, windgustmph, maxdailygust, hourlyrainin,'
        + ' eventrainin, dailyrainin, weeklyrainin, monthlyrainin, yearlyrainin,'
        + ' solarradiation, uv, dewpoint, dewpointin, dewpoint1, lastRain, tz) '
        + ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    let runinfo = ambientairinsertsqlstatement.run(ambientairinsertvalues);

    ambientweatherdb.close();
}

async function getAmbientWeatherDataFromDB() {
  let ambientweatherdb = new sqlite3DB('./db/homesensors.db', { verbose: console.log });
  ambientweatherdb.pragma('journal_mode = WAL');

  let latestreadingstatement = ambientweatherdb.prepare(
      'SELECT * FROM ' + ambientWeatherTableName 
      + ' WHERE dateutc = (SELECT MAX(dateutc) FROM ' + ambientWeatherTableName + ' )'
  );

  let latestreading = latestreadingstatement.get();

  ambientweatherdb.close();

  return latestreading;
}
