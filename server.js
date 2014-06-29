var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var console = require('console');
var dbHelpers = require('./util/dbHelpers');
var nearCache = require('./server/nearCache.js');

var app = express();
// var knex = dbHelpers.connectToDB();

function getCareerNames(req,res) {
  console.time('careerNames');

  nearCache.get('careerNames', dbHelpers.queryCareerNames)
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

  nearCache.get(careerQueryKey, dbHelpers.queryCareerData, careerNames)
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
  console.info('Server now listening on port ' + app.get('port'));
});

