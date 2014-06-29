module.exports = function() {

  //must be invoked before any other db helper functions can query database
  function connectToDB() {
    var pgConnectionString = process.env.DATABASE_URL || "postgres://dniqjxtclfosxv:CNS2zKW_NvlDy41DBFEsl0NzMt@ec2-54-225-101-164.compute-1.amazonaws.com:5432/daubvob22clj7l?ssl=true";
    var knex = require('knex')({
      client: 'pg',
      connection: pgConnectionString
    });

    return knex;
  }

  var knex = connectToDB();

  function queryCareerNames() {
    return knex
    .select('career_name')
    .from('careers')
    .then(function(names) {
      return names;
    });
  }

  function queryCareerData(careerNames) {
    console.info(careerNames);
    return knex.select().from('careers')
    .whereIn('career_name', careerNames)
    .then(function(matchedCareers) {
      return matchedCareers;
    });
  }

  return {
    connectToDB: connectToDB,
    queryCareerNames: queryCareerNames,
    queryCareerData: queryCareerData
  }
}();

