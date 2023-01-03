'use strict';

exports.getPurpleAirData = getPurpleAirData;

const purpleAirApiReadKey = process.env.API_READ_KEY || "";
const outdoorsensorindex = process.env.OUTDOOR_SENSOR_INDEX || "";
const indoorsensorindex = process.env.INDOOR_SENSOR_INDEX || "";
const sensorgroupid = process.env.SENSOR_GROUP_ID || "";

// Fields object
const Fields = {
    pm1: 'pm1.0',
    pm25: 'pm2.5',
    pm10: 'pm10.0',
    pm25cf: 'pm2.5_cf_1',
    humidity: 'humidity',
    lastseen: 'last_seen',
    um03: '0.3_um_count',
    um05: '0.5_um_count',
    um1: '1.0_um_count',
    um25: '2.5_um_count',
    um5: '5.0_um_count',
    um10: '10.0_um_count'
};

let PurpleAirData = {
    indoor: {
        pm1: 0.0,
        pm25: 0.0,
        pm10: 0.0,
        pm25cf: 0.0,
        humidity: 0.0,
        lastseen: 0.0,
        um03: 0.0,
        um05: 0.0,
        um1: 0.0,
        um25: 0.0,
        um5: 0.0,
        um10: 0.0,
        correctedpm25: 0.0,
        aqi: 0.0,
        bgcolor: 'green'
    },
    outdoor: {
        pm1: 0.0,
        pm25: 0.0,
        pm10: 0.0,
        pm25cf: 0.0,
        humidity: 0.0,
        lastseen: 0.0,
        um03: 0.0,
        um05: 0.0,
        um1: 0.0,
        um25: 0.0,
        um5: 0.0,
        um10: 0.0,
        correctedpm25: 0.0,
        aqi: 0.0,
        bgcolor: 'green'
    }
};

async function getPurpleAirData() {
    return getAqi(sensorgroupid);
}

// Initial pull
// getAqi(sensorgroupid);

// Repeat pulls
// let indoorAQI = setInterval(getAqi, 120000, sensorgroupid);

async function getAqi(groupid) {
    let customHeader = new Headers();
    customHeader.append('X-API-Key', purpleAirApiReadKey);
    let initObject = {
        method: 'GET', headers: customHeader,
    };

    // Sensor fields
    const sensorfields = Fields.pm1 
        + ',' + Fields.pm25 
        + ',' + Fields.pm10 
        + ',' + Fields.pm25cf 
        + ',' + Fields.humidity
        + ',' + Fields.lastseen
        + ',' + Fields.um03
        + ',' + Fields.um05
        + ',' + Fields.um1
        + ',' + Fields.um25
        + ',' + Fields.um5
        + ',' + Fields.um10;

    let purpleairfetch = await fetch(
        "https://api.purpleair.com/v1/groups/"+groupid+"/members?fields="+sensorfields, initObject, {});
    let purpleairjson = await purpleairfetch.json();
    let sensorDataFields = purpleairjson.fields;
    purpleairjson.data.forEach((sensor) => {
        if (sensor[0] == indoorsensorindex) {
            saveSensorData("indoor", sensor, sensorDataFields);
        } else if (sensor[0] == outdoorsensorindex) {
            saveSensorData("outdoor", sensor, sensorDataFields);
        }
    });

    return PurpleAirData;
}

function saveSensorDataTesting(sensorData) {
    for (let field in sensorData.fields) {
        console.log('First field: ' + field + ' is ' + sensorData.fields[field]);
    }
}

function saveSensorData(location, sensorData, sensorDataFields) {
    const pm1data = sensorData[sensorDataFields.indexOf(Fields.pm1)];
    const pm25data = sensorData[sensorDataFields.indexOf(Fields.pm25)];
    const pm10data = sensorData[sensorDataFields.indexOf(Fields.pm10)];
    const pm25_cf_1data = sensorData[sensorDataFields.indexOf(Fields.pm25cf)];
    const humiditydata = sensorData[sensorDataFields.indexOf(Fields.humidity)];
    const lastseendata = sensorData[sensorDataFields.indexOf(Fields.lastseen)];
    const um03data = sensorData[sensorDataFields.indexOf(Fields.um03)];
    const um05data = sensorData[sensorDataFields.indexOf(Fields.um05)];
    const um1data = sensorData[sensorDataFields.indexOf(Fields.um1)];
    const um25data = sensorData[sensorDataFields.indexOf(Fields.um25)];
    const um5data = sensorData[sensorDataFields.indexOf(Fields.um5)];
    const um10data = sensorData[sensorDataFields.indexOf(Fields.um10)];

    PurpleAirData[location].pm1 = pm1data;
    PurpleAirData[location].pm25 = pm25data;
    PurpleAirData[location].pm10 = pm10data;
    PurpleAirData[location].pm25cf = pm25_cf_1data;
    PurpleAirData[location].humidity = humiditydata;
    PurpleAirData[location].lastseen = formattedTime(lastseendata);
    PurpleAirData[location].um03 = um03data;
    PurpleAirData[location].um05 = um05data;
    PurpleAirData[location].um1 = um1data;
    PurpleAirData[location].um25 = um25data;
    PurpleAirData[location].um5 = um5data;
    PurpleAirData[location].um10 = um10data;

    PurpleAirData[location].correctedpm25 = correctPM25(pm25_cf_1data, humiditydata);
    PurpleAirData[location].aqi = calcAQI(PurpleAirData[location].correctedpm25).toFixed(0);
    PurpleAirData[location].bgcolor = getBGColorForAQI(PurpleAirData[location].aqi);
}

function correctPM25(pm25cf, humidity) {
    return ((0.52 * pm25cf) - (0.085 * humidity) + 5.71);
}

function formattedTime(unixtime) {
    const milliseconds = unixtime * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString();
}

function calcAQI(pm25) {
    let bphi = 12.0;
    let bplo = 0.0;
    let aqhi = 50;
    let aqlo = 0;
    switch (true) {
        case (pm25 <= 12.0):
            break;
        case (pm25 > 12.0 && pm25 <=35.4):
            bphi = 35.4;
            bplo = 12.1;
            aqhi = 100;
            aqlo = 51;
            break;
        case (pm25 > 35.4 && pm25 <=55.4):
            bphi = 55.4;
            bplo = 35.5;
            aqhi = 150;
            aqlo = 101;
            break;
        case (pm25 > 55.4 && pm25 <=150.4):
            bphi = 150.4;
            bplo = 55.5;
            aqhi = 200;
            aqlo = 151;
            break;
        case (pm25 > 150.4 && pm25 <= 250.4):
            bphi = 250.4;
            bplo = 150.5;
            aqhi = 300;
            aqlo = 201;
            break;
        case (pm25 > 250.4 && pm25 <= 350.4):
            bphi = 350.4;
            bplo = 250.5;
            aqhi = 400;
            aqlo = 301;
            break;
        case (pm25 > 350.4 && pm25 <= 500.4):
            bphi = 500.4;
            bplo = 350.5;
            aqhi = 500;
            aqlo = 401;
            break;
        default:
            break;
    }
    let aqi = ((aqhi - aqlo)/(bphi - bplo))*(pm25 - bplo) + aqlo;
    return aqi;
}

function getBGColorForAQI(aqi) {
    switch (true) {
        case (aqi <= 50):
            return 'green';
        case (aqi > 50 && aqi <= 100):
            return 'yellow';
        case (aqi > 100 && aqi <= 150):
            return 'orange';
        case (aqi > 150 && aqi <= 200):
            return 'red';
        case (aqi > 200 && aqi <= 300):
            return 'purple';
        case (aqi > 300):
            return 'maroon';
        default:
            return 'green';
    }
}