'use strict';

// Require the framework and instantiate it
const express = require('express');
const app = express();

const purpleairdump = require('./purpleair/purpleairdumpall');
const purpleair = require('./purpleair/purpleair');
const ambientweather = require('./ambientweather/ambientweather')

// Start the retrieval functions to store the sensor readings
purpleair.startPurpleAirRetrieval();

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
  purpleair.getPurpleAirDataFromDB().then(response => {
    res.render('pages/currentpurpleair', {
      purpleairdata: response
    });
  });
});

app.get('/purpleairdumpall', (req, res) => {
  /*purpleairdump.getDetails().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });*/
  /*let purpleairDBdata = purpleair.getPurpleAirDataFromDB();
  res.send("<pre>"+JSON.stringify(purpleairDBdata, null, 2)+"</pre>")*/
});

app.get('/ambientweather', (req, res) => {
  ambientweather.getInfo().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`MyHomeSensors app listening on port ${port}`);
});