var pg = require('pg');

var actions = {
  'GET': getCareers,
  'OPTIONS': options
};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // seconds
  "Content-Type": "application/json"
};

exports.sendResponse = function(res, object, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);

  res.end(JSON.stringify(object));
};

function options(req, res){
  exports.sendResponse(res, {a: 'options object'});
};

function getCareers(req, res) {
  statusCode = 200;

  // pg.connect(process.env.DATABASE_URL, function(err, client) {
  //   var query = client.query('SELECT * FROM careers LIMIT 5');

  //   query.on('row', function(row) {
  //     console.log(JSON.stringify(row));
  //   });
  // });

  exports.sendResponse(res, {results: 'getCareers object'} );
};

exports.handler = function(req, res) {
  console.log(res.output);
  if(actions[req.method]){
    var action = actions[req.method];
    action(req, res);
  }else{
    exports.sendResponse(res, null, 404);
  }
};