var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var console = require('console');
var nearCache = require('./server/nearCache.js');

var app = express();
var pgConnectionString = process.env.DATABASE_URL || "postgres://dniqjxtclfosxv:CNS2zKW_NvlDy41DBFEsl0NzMt@ec2-54-225-101-164.compute-1.amazonaws.com:5432/daubvob22clj7l?ssl=true";
var knex = require('knex')({
  client: 'pg',
  connection: pgConnectionString
});

function getCareerNames(req,res) {
  console.time('careerNames');

  function queryCareerNames() {
    return knex
    .select('career_name')
    .from('careers')
    .then(function(names) {
      return names;
    });
  }

  nearCache.get('careerNames', queryCareerNames)
    .then(function(names) {
      console.timeEnd('careerNames');
      res.send(names);
    });
};

//expects a 'careers' param whose value is an array of career names
function getCareerData(req, res) {
  console.time('careerData');
  
  var careerNames = JSON.parse(req.query.careers);
  var careerQueryKey = careerNames.sort().join('');

  function queryCareerData() {
    return knex.select().from('careers')
    .whereIn('career_name', careerNames)
    .then(function(matchedCareers) {
      return matchedCareers;
    });
  }

  nearCache.get(careerQueryKey, queryCareerData)
    .then(function(careers) {
      console.timeEnd('careerData');
      res.send(careers);
    });
}

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/app'));

//routes
app.get('/careers/names', getCareerNames);
app.get('/careers', getCareerData);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server now listening on port ' + app.get('port'));
});

