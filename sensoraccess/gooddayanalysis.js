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
const lowTempForBikingMaxWind = 2;
const lowTempForHiking = 60;
const lowTempForHikingMaxWind = 5;

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

    if (ambientdata.windspdmph_avg10m <= lowTempForBikingMaxWind &&
        ambientdata.tempf >= lowTempForBiking &&
        ambientdata.tempf < perfectTempForBiking) {
            GoodDay.bikingRatingColor = 'yellow';
    }

    if (ambientdata.windspdmph_avg10m <= lowTempForHikingMaxWind &&
        ambientdata.tempf >= lowTempForHiking &&
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

    GoodDay.hikingDisplayText = getHikingDisplayText(ambientdata, purpleairdata);
    GoodDay.bikingDisplayText = getBikingDisplayText(ambientdata, purpleairdata);

    if (ambientdata.uv >= uvIndexSunscreenRecommended && 
        GoodDay.hikingRatingColor !== 'red') {
        GoodDay.bikingDisplayText += ' Wear sunscreen.';
        GoodDay.hikingDisplayText += ' Wear sunscreen.';
    }

    GoodDay.hikingDisplayText.trim();
    GoodDay.bikingDisplayText.trim();

    return GoodDay;
}

function getHikingDisplayText(ambientdata, purpleairdata) {
    let hikingdisplaytext = '';

    if (purpleairdata.aqi >= aqiTooHighForAnything) {
        hikingdisplaytext += ' The air is too dirty.';
    }  
    if (ambientdata.windspdmph_avg10m >= windTooHighForAnything) {
        hikingdisplaytext += ' It is too windy.';
    }
    if (ambientdata.tempf <= tempTooLowForAnything) {
        hikingdisplaytext += ' It is too cold.';
    }
    if (ambientdata.tempf >= tempTooHighForAnything) {
        hikingdisplaytext += ' It is too hot.' + ambientdata.tempf;
    }

    if (hikingdisplaytext !== '') {
        return hikingdisplaytext;
    }

    // Low wind situation

    if (ambientdata.windspdmph_avg10m <= lowTempForHikingMaxWind &&
        ambientdata.tempf >= lowTempForHiking &&
        ambientdata.tempf < perfectTempForHiking) {
            return 'It is chilly but not windy so wear long sleeves and go.';
    }

    // Perfect situation

    if (ambientdata.windspdmph_avg10m <= acceptableWindForHiking &&
        ambientdata.tempf >= perfectTempForHiking) {
            return 'It is perfect so go!';
    }

    return hikingdisplaytext;

}

function getBikingDisplayText(ambientdata, purpleairdata) {
    let bikingdisplaytext = '';

    if (purpleairdata.aqi >= aqiTooHighForAnything) {
        bikingdisplaytext += ' The air is too dirty.';
    }
    if (ambientdata.windspdmph_avg10m >= windTooHighForAnything) {
        bikingdisplaytext += ' It is too windy.';
    }
    if (ambientdata.tempf <= tempTooLowForAnything) {
        bikingdisplaytext += ' It is too cold.';
    }
    if (ambientdata.tempf >= tempTooHighForAnything) {
        bikingdisplaytext += ' It is too hot.';
    }

    if (bikingdisplaytext !== '') {
        return bikingdisplaytext;
    }

    // Low wind situation

    if (ambientdata.windspdmph_avg10m <= lowTempForBikingMaxWind &&
        ambientdata.tempf >= lowTempForBiking &&
        ambientdata.tempf < perfectTempForBiking) {
            return 'It is chilly but not windy so wear long sleeves and go.';
    }

    // Perfect situation

    if (ambientdata.windspdmph_avg10m <= acceptableWindForBiking &&
        ambientdata.tempf >= perfectTempForBiking) {
            return 'It is perfect so go!';
    }

    return bikingdisplaytext;
}

