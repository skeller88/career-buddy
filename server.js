var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded());
// app.use(express.static(__dirname + '/app'));

var pgConnectionString = process.env.DATABASE_URL || "postgres://dniqjxtclfosxv:CNS2zKW_NvlDy41DBFEsl0NzMt@ec2-54-225-101-164.compute-1.amazonaws.com:5432/daubvob22clj7l?ssl=true";

app.get('/careers', function(req,res){

  var knex = require('knex')({
    client: 'pg',
    connection: pgConnectionString
  });

  knex.select('career_name').from('careers')
    .then(function(rows) {
      res.send(rows);
    });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server now listening on port ' + app.get('port'));
});

