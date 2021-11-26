'use strict';

// Require the framework and instantiate it
const express = require('express');
const app = express();

const purpleairdump = require('./purpleair/purpleairdumpall');

// PurpleAir API settings
const purpleAirApiReadKey = process.env.API_READ_KEY || "";
const outdoorsensorindex = process.env.OUTDOOR_SENSOR_ID || "";
const indoorsensorindex = process.env.INDOOR_SENSOR_INDEX || "";
const sensorgroupid = process.env.SENSOR_GROUP_ID || "";

// Create a new pool for the database connection
const {Pool} = require('pg');
const pool = new Pool({
 connectionString: "postgres://xguqgtzqeocepv:1d5abdafefd2742cd96ba650aee0857bbf9578764812aaf6b272e044941b8f46@ec2-18-214-214-252.compute-1.amazonaws.com:5432/davkg6fmjicq4k",
 ssl: {
 rejectUnauthorized: false
 }
});

let currenttime = Date.now() / 1000.0;

// Test writing a timestamp periodically to the test table
pool.query('INSERT INTO TestTable(datetime) VALUES(to_timestamp(${currenttime}))', (err, res) => {
  if (err) {
      console.log("Error - Failed to insert data into TestTable");
      console.log(err);
  }
});

// Declare a route
app.get('/', (req, res) => {
  purpleairdump.getDetails(indoorsensorindex, purpleAirApiReadKey).then(response => {
    res.json(response);
  });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})