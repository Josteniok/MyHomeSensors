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

// Create a new pool for the database connection
/*const {Pool} = require('pg');
const pool = new Pool({
 connectionString: "postgres://xguqgtzqeocepv:1d5abdafefd2742cd96ba650aee0857bbf9578764812aaf6b272e044941b8f46@ec2-18-214-214-252.compute-1.amazonaws.com:5432/davkg6fmjicq4k",
 ssl: {
 rejectUnauthorized: false
 }
});*/

let currenttime = Date.now() / 1000.0;

/*// Test writing a timestamp periodically to the test table
pool.query(`INSERT INTO TestTable(datetime) VALUES(to_timestamp(${currenttime}))`, (err, res) => {
  if (err) {
      console.log("Error - Failed to insert data into TestTable");
      console.log(err);
  }
});*/

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
    res.render('pages/index', {
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