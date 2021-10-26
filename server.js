'use strict';

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

// PurpleAir API settings
const purpleAirApiReadKey = process.env.API_READ_KEY || "";
const outdoorsensorid = process.env.OUTDOOR_SENSOR_ID || "";
const indoorsensorindex = process.env.INDOOR_SENSOR_INDEX || "";
const sensorgroupindex = process.env.SENSOR_GROUP_INDEX || "";

import {getDetails} from './purpleair/purpleairdumpall';

// Declare a route
fastify.get('/', async (request, reply) => {
  // return { hello: process.env.TEST_VAR || 'hello' };
  getDetails(indoorsensorindex, purpleAirApiReadKey);
})



// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();