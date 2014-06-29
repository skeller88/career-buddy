var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var nearCache = require('./server/nearCache.js');

var app = express();
var pgConnectionString = process.env.DATABASE_URL || "postgres://dniqjxtclfosxv:CNS2zKW_NvlDy41DBFEsl0NzMt@ec2-54-225-101-164.compute-1.amazonaws.com:5432/daubvob22clj7l?ssl=true";

var knex = require('knex')({
  client: 'pg',
  connection: pgConnectionString
});

var getCareerNames = function(req,res){

  function queryCareerNames() {
    return knex
    .select('career_name')
    .from('careers')
    .then(function(names) {
      names = _.indexBy(names, 'career_name');
      return names;
    });
  }

  nearCache.get('careerNames', queryCareerNames)
    .then(function(names) {
      res.send(names);
    });
};

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/app'));

app.get('/careers', getCareerNames);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server now listening on port ' + app.get('port'));
});

