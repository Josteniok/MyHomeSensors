'use strict';

const fetch = require('node-fetch');

function getDetails(sensorid, purpleAirApiReadKey) {
    let customHeader = new fetch.Headers();
    customHeader.append('X-API-Key', purpleAirApiReadKey);
    let initObject = {
        method: 'GET', headers: customHeader,
    };
    fetch("https://api.purpleair.com/v1/sensors/"+sensorid, initObject)
    .then(response => response.json())
    .then(function (data) {
        return JSON.stringify(data, null, 2)
    })
    .catch(function (err) {
        console.log("ERROR: ", err);
    });
}

exports.getDetails = getDetails;