'use strict';

var bodyParser = require('body-parser');
var careers = require('./models/careers');
var compression = require('compression');
var console = require('console');
var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');

var app = express();

// process.env.NODE_ENV = 'production';

function getCareerNames(req, res, next) {
  console.log('getCareerNames route');
  console.time('careerNames');

  careers.getAllCareerNames().then(function(careerNames) {
      console.timeEnd('careerNames');
      // Cache for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.send(careerNames);
  }, function(err) {
      console.timeEnd('careerNames');
      res.send(400);
  });
}

//expects a 'careers' param whose value is an array of career names
function getCareerData(req, res) {
  console.log('getCareerData route');
  console.time('careerData');

  var careerNames = req.query.careers;

  careers.findByCareerNames(careerNames).then(function(careerData) {
      console.timeEnd('careerData');
      // Cache for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.send(careerData);
  }, function(err) {
      console.timeEnd('careerData');
      res.send(400);
  });
}

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
var re = new RegExp(".html$");

function cacheControl(res, path) {
    console.time('cacheControl');
    if (!re.test(path)) {
        console.log(path);
        res.setHeader('Cache-Control', 'public, max-age=31557600000');
    }
    console.timeEnd('cacheControl');
}

app.set('port', process.env.PORT || 3000);
// Simple request with no middleware
app.use('/baseline/before-middleware', function(req, res) {
    console.time('baseline');
    console.timeEnd('baseline');
    res.send(200);
});

app.use(function(req, res, next) {
    var d = new Date();
    res.setHeader('X-Response-Time', d.getTime());
    next();
});
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
    var startTime = res.getHeader('X-Response-Time');
    var endDate = new Date();
    console.log('request took ' + startTime - endDate.getTime() + ' ms');
    res.send(200);
});

http.createServer(app).listen(app.get('port'), function() {
  console.info('Server now listening on port ' + app.get('port'));
});

exports.app = app;

