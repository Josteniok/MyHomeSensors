'use strict';

const purpleAirApiReadKey = process.env.API_READ_KEY || "";
const outdoorsensorindex = process.env.OUTDOOR_SENSOR_INDEX || "";
const indoorsensorindex = process.env.INDOOR_SENSOR_INDEX || "";
const sensorgroupid = process.env.SENSOR_GROUP_ID || "";

// Fields object
const Fields = {
    pm1: 'pm1.0',
    pm1index: 1,
    pm25: 'pm2.5',
    pm25index: 2,
    pm10: 'pm10.0',
    pm10index: 3,
    pm25cf: 'pm2.5_cf_1',
    pm25cfindex: 4,
    humidity: 'humidity',
    humidityindex: 5,
    lastseen: 'last_seen',
    lastseenindex: 6,
    um03: '0.3_um_count',
    um03index: 7,
    um05: '0.5_um_count',
    um05index: 8,
    um1: '1.0_um_count',
    um1index: 9,
    um25: '2.5_um_count',
    um25index: 10,
    um5: '5.0_um_count',
    um5index: 11,
    um10: '10.0_um_count',
    um10index: 12
};

// Initial pull
getAqi(sensorgroupid);

// Repeat pulls
let indoorAQI = setInterval(getAqi, 600000, sensorgroupid);

function getAqi(groupid) {
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

    fetch("https://api.purpleair.com/v1/groups/"+groupid+"/members?fields="+sensorfields, initObject)
    .then(response => response.json())
    .then(function (sensorData) {
        sensorData.data.forEach((sensor) => {
            if (sensor[0] == indoorsensorindex) {
                injectSensorData("indoor", sensor);
            } else if (sensor[0] == outdoorsensorindex) {
                injectSensorData("outdoor", sensor);
            }
        })
    })
    .catch(function (err) {
        console.log("ERROR: ", err);
    });
}

function injectSensorData(location, sensorData) {
    const pm1data = sensorData[Fields.pm1index];
    const pm25data = sensorData[Fields.pm25index];
    const pm10data = sensorData[Fields.pm10index];
    const pm25_cf_1data = sensorData[Fields.pm25cfindex];
    const humiditydata = sensorData[Fields.humidityindex];
    const lastseendata = sensorData[Fields.lastseenindex];
    const um03data = sensorData[Fields.um03index];
    const um05data = sensorData[Fields.um05index];
    const um1data = sensorData[Fields.um1index];
    const um25data = sensorData[Fields.um25index];
    const um5data = sensorData[Fields.um5index];
    const um10data = sensorData[Fields.um10index];

    // DOM locations
    const docid = location + "aqi";
    const gridid = location + "-column";
    const pm1id = location + "pm1.0";
    const pm25id = location + "pm2.5";
    const pm10id = location + "pm10.0";
    const datatimeid = location + "datatime";
    const um03id = location + "0.3um";
    const um05id = location + "0.5um";
    const um1id = location + "1.0um";
    const um25id = location + "2.5um";
    const um5id = location + "5.0um";
    const um10id = location + "10.0um";

    const correctedpm25 = correctPM25(pm25_cf_1data, humiditydata);
    const aqi = calcAQI(correctedpm25);
    document.getElementById(docid).innerHTML = String(aqi.toFixed(0));
    document.getElementById(gridid).style.backgroundColor = getBGColorForAQI(aqi);
    document.getElementById(pm1id).innerHTML = String(pm1data);
    document.getElementById(pm25id).innerHTML = String(pm25data);
    document.getElementById(pm10id).innerHTML = String(pm10data);
    document.getElementById(datatimeid).innerHTML = formattedTime(lastseendata);
    document.getElementById(um03id).innerHTML = String(um03data);
    document.getElementById(um05id).innerHTML = String(um05data);
    document.getElementById(um1id).innerHTML = String(um1data);
    document.getElementById(um25id).innerHTML = String(um25data);
    document.getElementById(um5id).innerHTML = String(um5data);
    document.getElementById(um10id).innerHTML = String(um10data);
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