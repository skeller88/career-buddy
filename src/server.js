'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var console = require('console');
var careers = require('./models/careers');
var app = express();

// for increased security, Angular suggests adding padding to JSON:
// https://docs.angularjs.org/api/ng/service/$http
function sendWithAngularJSONProtection(req, res, next) {
    var originalSend = res.send;

    // overload res.send
    res.send = function () { // override res.send()
        // send status code only (200, 400)
        if (arguments.length == 1 && (typeof arguments[0]) == "number") {
            //TODO- why is context 'this'?
            originalSend.call(this, arguments[0]);
        // send status code and response body
        } else {
            res.contentType('application/json');

            var status, body;
            if (arguments.length == 2) {
                status = arguments[0];
                body = arguments[1];
            }
            else {
                body = arguments[0];
            }
            var newBody;
            if (body instanceof Object) {
                newBody = JSON.stringify(body);
            } else {
                newBody = body;
            }
            //need padding length for testing
            exports.padding = ')]}\',\n';
            if (arguments.length == 2) {
                originalSend.call(this, status, exports.padding + newBody);
            } else {
                originalSend.call(this, exports.padding + newBody);
            }
        }
    };

    next();
}

function getCareerNames(req, res, next) {
  console.time('careerNames');

  careers.getAllCareerNames().then(function(careerNames) {
      console.timeEnd('careerNames');
      res.send(careerNames);
  }, function(err) {
      console.timeEnd('careerNames');
      res.send(400);
  });
}

//expects a 'careers' param whose value is an array of career names
function getCareerData(req, res) {
  console.time('careerData');

  var careerNames = req.query.careers;

  careers.findByCareerNames(careerNames).then(function(careerData) {
      console.timeEnd('careerData');
      res.send(careerData);
  }, function(err) {
      console.timeEnd('careerData');
      res.send(400);
  });
}

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded());

//production
app.use(express.static(__dirname + '/../dist'));

//development
// app.use(express.static(__dirname + '/../app'));

app.use(sendWithAngularJSONProtection);

//routes
app.get('/careers/names', getCareerNames);
app.get('/careers', getCareerData);

http.createServer(app).listen(app.get('port'), function() {
  console.info('Server now listening on port ' + app.get('port'));
});

exports.app = app;

