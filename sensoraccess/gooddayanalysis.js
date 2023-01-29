'use strict';

exports.testfunction = testfunction;
exports.getGoodDayForData = getGoodDayForData;

const purpleair = require('./purpleair');
const ambientweather = require('./ambientweather');

let GoodDay = {
    ratingColor: 'white',
    aqi: 0.0
};

function testfunction() {
    let ambientdata = ambientweather.getAmbientWeatherDataFromDB();

    return ambientdata;
}

function getGoodDayForData() {
    let ambientdata = ambientweather.getAmbientWeatherDataFromDB();
    let purpleairdata = purpleair.getPurpleAirDataFromDB();

    if (ambientdata.tempf < 65) {
        GoodDay.ratingColor = 'red';
    } else {
        if (ambientdata.windspdmph_avg10m > 6) {
            GoodDay.ratingColor = 'red';
        } else {
            GoodDay.ratingColor = 'green';
        }
    }

    return GoodDay;
}

