var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var console = require('console');
var careers = require('./models/careers');
var dbHelpers = require('./util/dbHelpers');
var app = express();

function sendWithJSONProtection(req, res, next) {
    var padding = ')]}\',\n';
    var send = res.send; // save the existing res.send()

    res.send = function (object) { // override res.send()
        // var body = string instanceof Buffer ? string.toString() : string;
        var body = object instanceof Object ? JSON.stringify(object) : object; 
        send.call(this, padding + body); // call the original res.send()
    };

  next();
}

function getCareerNames(req, res, next) {
  console.time('careerNames');

  careers.getAllCareerNames().then(function(careerNames) {
      console.timeEnd('careerNames');
      res.send(careerNames);
  }, function(err) {
      console.timeEnd('careerData');
      res.send(404);
  })
};

//expects a 'careers' param whose value is an array of career names
function getCareerData(req, res) {
  console.time('careerData');

  var careerNames = req.query.careers;

  careers.findByCareerNames(careerNames).then(function(careerData) {
      console.timeEnd('careerData');
      res.send(careerData);
  }, function(err) {
      console.timeEnd('careerData');
      res.send(404);
  });
}

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/../app'));
app.use(sendWithJSONProtection);

//routes
app.get('/careers/names', getCareerNames);
app.get('/careers', getCareerData);

http.createServer(app).listen(app.get('port'), function() {
  console.info('Server now listening on port ' + app.get('port'));
});

