'use strict';

//must be invoked before any other db helper functions can query database
exports.dbConnectionObj = (function() {
  //production
  //var pgConnectionString = process.env.DATABASE_URL || "postgres://dniqjxtclfosxv:CNS2zKW_NvlDy41DBFEsl0NzMt@ec2-54-225-101-164.compute-1.amazonaws.com:5432/daubvob22clj7l?ssl=true";
  //development
  var pgConnectionString = process.env.DATABASE_URL || "postgres://ridycrnekqeenm:36ijB7sOymHbWMgmuRLVOBLofq@ec2-54-221-243-6.compute-1.amazonaws.com:5432/d1eb2fbft5f994?ssl=true";
  console.log(pgConnectionString);
  var knex = require('knex')({
    client: 'pg',
    connection: pgConnectionString
  });

  return knex;
})();

