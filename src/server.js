'use strict';

var bodyParser = require('body-parser');
var careers = require('./models/careers');
var compression = require('compression');
var console = require('console');
var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');

var app = express();

// comment out line below to simulate production environment
// process.env.NODE_ENV = 'production';

// Routes
function getCareerNames(req, res, next) {
  console.time('getCareerNames');

  careers.getAllCareerNames().then(function(careerNames) {
      console.timeEnd('getCareerNames');
      // Cache for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
      logResponseTime('getCareerNames', res);
      res.send(careerNames);
  }, function(err) {
      console.timeEnd('getCareerNames');
      res.send(400);
  });
}

//expects a 'careers' param whose value is an array of career names
function getCareerData(req, res) {
  console.time('getCareerData');

  var careerNames = req.query.careers;

  careers.findByCareerNames(careerNames).then(function(careerData) {
      console.timeEnd('getCareerData');
      // Cache for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
      logResponseTime('getCareerData', res);
      res.send(careerData);
  }, function(err) {
      console.timeEnd('getCareerData');
      res.send(400);
  });
}

// Middleware

// for increased security, Angular suggests adding padding to JSON:
// https://docs.angularjs.org/api/ng/service/$http
function sendWithAngularJSONProtection(req, res, next) {
    console.time('angularJSON');
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

    console.timeEnd('angularJSON');
    next();
}

// Cache all static files except for .html files.
var re = new RegExp("html$");

// Utility functions
function cacheControl(res, path) {
    console.time('cacheControl');
    if (!re.test(path)) {
        res.setHeader('Cache-Control', 'public, max-age=31557600000');
    }
    console.timeEnd('cacheControl');
}

function logResponseTime(route, res) {
  var startTime = res.getHeader('X-Response-Time');
  var endDate = new Date();
  var diff = endDate.getTime() - startTime;
  console.log(route + ' request took ' + diff + ' ms');
}

function startResponseTimer(req, res, next) {
    console.log("new request------------------------------");
    console.log("path: ", req.originalUrl);
    var d = new Date();
    res.setHeader('X-Response-Time', d.getTime());
    next();
}

app.set('port', process.env.PORT || 3000);
// Simple request with no middleware
app.use('/baseline/before-middleware', function(req, res) {
    console.time('baseline');
    console.timeEnd('baseline');
    res.send(200);
});

app.use(startResponseTimer);

// Determines by default if response is compressible. Also sets "Vary" header.
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    // Don't cache dynamic .html content.
    app.use(serveStatic(__dirname + '/../dist', {
        'setHeaders': cacheControl
    }));

} else {
    // Don't cache dynamic .html content.
    app.use(serveStatic(__dirname + '/../app', {
        'setHeaders': cacheControl
    }));
}

app.use(sendWithAngularJSONProtection);

//routes
app.get('/careers/names', getCareerNames);
app.get('/careers', getCareerData);
app.use('/baseline/after-middleware', function(req, res) {
    logResponseTime('baseline', res);
    res.send(200);
});

http.createServer(app).listen(app.get('port'), function() {
  console.info('Server now listening on port ' + app.get('port'));
});

exports.app = app;

