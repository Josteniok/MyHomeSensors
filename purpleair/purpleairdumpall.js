'use strict';

exports.getDetails = getDetails;

const fetch = require('node-fetch');

// PurpleAir API settings
const purpleAirApiReadKey = process.env.API_READ_KEY || "";
const outdoorsensorindex = process.env.OUTDOOR_SENSOR_ID || "";
const indoorsensorindex = process.env.INDOOR_SENSOR_INDEX || "";
const sensorgroupid = process.env.SENSOR_GROUP_ID || "";

async function getDetails() {
    let customHeader = new fetch.Headers();
    customHeader.append('X-API-Key', purpleAirApiReadKey);
    let initObject = {
        method: 'GET', headers: customHeader,
    };
    const response = await fetch("https://api.purpleair.com/v1/sensors/"+outdoorsensorindex, initObject, {});
    const json = await response.json();

    return json;
}