'use strict';

export function getDetails(sensorid, purpleAirApiReadKey) {
    let customHeader = new Headers();
    customHeader.append('X-API-Key', purpleAirApiReadKey);
    let initObject = {
        method: 'GET', headers: customHeader,
    };
    fetch("https://api.purpleair.com/v1/sensors/"+sensorid, initObject)
    .then(response => response.json())
    .then(function (data) {
        console.log(JSON.stringify(data, null, 2))
    })
    .catch(function (err) {
        console.log("ERROR: ", err);
    });
}