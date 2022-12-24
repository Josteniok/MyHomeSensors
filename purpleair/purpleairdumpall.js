'use strict';


exports.getDetails = getDetails;

const fetch = require('node-fetch');

async function getDetails(sensorid, purpleAirApiReadKey) {
    let customHeader = new fetch.Headers();
    customHeader.append('X-API-Key', purpleAirApiReadKey);
    let initObject = {
        method: 'GET', headers: customHeader,
    };
    const response = await fetch("https://api.purpleair.com/v1/sensors/"+sensorid, initObject, {});
    const json = await response.json();

    return json;
}