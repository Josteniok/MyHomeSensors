'use strict';

exports.testfunction = testfunction;

const purpleair = require('./purpleair');
const ambientweather = require('./ambientweather');

function testfunction() {
    let ambientdata = ambientweather.getAmbientWeatherDataFromDB();

    return ambientdata;
}

