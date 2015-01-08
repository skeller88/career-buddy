'use strict';

//must be invoked before any other db helper functions can query database
exports.dbConnectionObj = (function() {
  var knex;

  // production
  if (process.env.DATABASE_URL) {
      knex = require('knex')({
        client: 'pg',
        connection: process.env.DATABASE_URL
      });
  // development
  } else {
      knex = require('knex')({
          client: 'pg',
          connection: {
            host: '127.0.0.1',
            database: 'careers'
          }
      });
  }

  return knex;
})();

