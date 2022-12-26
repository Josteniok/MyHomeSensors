'use strict';

// Require the framework and instantiate it
const express = require('express');
const app = express();

const purpleairdump = require('./purpleair/purpleairdumpall');
const ambientweather = require('./ambientweather/ambientweather')

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

// This sets the public directory to be used for things like CSS files
app.use(express.static('public'));

// Declare a route
app.get('/', (req, res) => {
  purpleairdump.getDetails().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

app.get('/ambientweather', (req, res) => {
  ambientweather.getInfo().then(response => {
    res.send("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Mypurpleairsensors app listening on port ${port}`);
});