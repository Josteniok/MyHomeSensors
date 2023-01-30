'use strict';

exports.getGoodDayForData = getGoodDayForData;

const purpleair = require('./purpleair');
const ambientweather = require('./ambientweather');

// Sensor settings for the different activities
// and recommendations.
const aqiTooHighForAnything = 100;
const windTooHighForAnything = 15;
const tempTooLowForAnything = 50;
const tempTooHighForAnything = 100;

const lowTempForBiking = 65;
const lowTempForBikingMaxWind = 5;
const lowTempForHiking = 60;
const lowTempForHikingMaxWind = 2;

const perfectTempForBiking = 68;
const acceptableWindForBiking = 6;
const perfectTempForHiking = 65;
const acceptableWindForHiking = 8;

const uvIndexSunscreenRecommended = 3;


let GoodDay = {
    ratingColor: 'white',
    bikingRatingColor: 'white',
    hikingRatingColor: 'white',
    bikingDisplayText: '',
    hikingDisplayText: ''
};

function getGoodDayForData() {
    let ambientdata = ambientweather.getAmbientWeatherDataFromDB();
    let purpleairdata = purpleair.getPurpleAirDataFromDB();

    if (purpleairdata.aqi >= aqiTooHighForAnything ||
        ambientdata.windspdmph_avg10m >= windTooHighForAnything ||
        ambientdata.tempf <= tempTooLowForAnything ||
        ambientdata.tempf >= tempTooHighForAnything) {
            GoodDay.bikingRatingColor = 'red';
            GoodDay.hikingRatingColor = 'red';
    }

    if (ambientdata.tempf >= lowTempForBiking &&
        ambientdata.windspdmph_avg10m <= lowTempForBikingMaxWind &&
        ambientdata.tempf < perfectTempForBiking) {
            GoodDay.bikingRatingColor = 'yellow';
    }

    if (ambientdata.tempf >= lowTempForHiking &&
        ambientdata.windspdmph_avg10m <= lowTempForHikingMaxWind &&
        ambientdata.tempf < perfectTempForHiking) {
            GoodDay.hikingRatingColor = 'yellow';
    }

    if (ambientdata.tempf >= perfectTempForBiking &&
        ambientdata.windspdmph_avg10m <= acceptableWindForBiking) {
            GoodDay.bikingRatingColor = 'green';
    }

    if (ambientdata.tempf >= perfectTempForHiking &&
        ambientdata.windspdmph_avg10m <= acceptableWindForHiking) {
            GoodDay.hikingRatingColor = 'green';
    }

    if (ambientdata.uv >= uvIndexSunscreenRecommended) {
        GoodDay.bikingDisplayText += ' Wear sunscreen.';
        GoodDay.hikingDisplayText += ' Wear sunscreen.';
    }

    return GoodDay;
}

function getHikingDisplayText(ambientdata, purpleairdata) {
    let hikingdisplaytext = '';

    if (ambientdata.windspdmph_avg10m >= windTooHighForAnything) {
        hikingdisplaytext += "It is too windy.";
    }

}

function getBikingDisplayText(ambientdata, purpleairdata) {

}

