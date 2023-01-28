'use strict';

// Require the framework and instantiate it
const express = require('express');
const app = express();

const purpleairdump = require('./sensoraccess/purpleairdumpall');
const purpleair = require('./sensoraccess/purpleair');
const ambientweather = require('./sensoraccess/ambientweather');
const gooddayanalysis = require('./sensoraccess/gooddayanalysis');

// Start the retrieval functions to store the sensor readings
purpleair.startPurpleAirRetrieval();
ambientweather.startAmbientWeatherRetrieval();

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// This sets the public directory to be used for things like CSS files.
// Note that it also means the index.html file from this directory will be used
// for the root of the web site if it exists.
// app.use(express.static('public'));

app.get('/', (req, res) => {
  purpleairdump.getDetails().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

app.get('/purpleair', (req, res) => {
  let purpleairdata = purpleair.getPurpleAirDataFromDB();
  res.render('pages/currentpurpleair', {
    purpleairdata: purpleairdata
  });
});

app.get('/purpleairdumpall', (req, res) => {
  purpleairdump.getDetails().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

app.get('/ambientweather', (req, res) => {
  ambientweather.getInfo().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

app.get('/gooddayfor', (req, res) => {
  let ambientweatherdata = gooddayanalysis.testfunction();
  res.send("<pre>"+JSON.stringify(ambientweatherdata, null, 2)+"</pre>")
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`MyHomeSensors app listening on port ${port}`);
});