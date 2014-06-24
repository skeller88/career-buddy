var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

// var pg = require('pg').native;

// var client = new pg.Client({
//   host: 'ec2-54-243-49-204.compute-1.amazonaws.com',
//   port: '5432',
//   database: 'da8g81b6klacig',
//   user: 'gbucxcgyytxjfu',
//   password: 'EJ8f0r_idtBFxhXqqz8kQ814SX'
// });

// var knex = require('knex')({
//   client: 'pg',
//   connection: "dbname=d79onnfkt300fv host=ec2-54-204-32-91.compute-1.amazonaws.com port=5432 user=jitpluhwkhnmfi password=SFqDPMve7-IXcGZij-bY6WeoK2 sslmode=require"
// });

// var knex = require('knex')({
//   host: 'ec2-54-243-49-204.compute-1.amazonaws.com',
//   port: '5432',
//   database: 'da8g81b6klacig',
//   user: 'gbucxcgyytxjfu',
//   password: 'EJ8f0r_idtBFxhXqqz8kQ814SX'
// });

// app.use(express.static(__dirname + '/../app'));
app.use(bodyParser.urlencoded());

app.get('/careers', function(req,res){
  // check to see if there's a user id parameter
  // if there is, run a query through the DB to see if that user id exists; return with data if it does
  // send res.redirect to '/new with information'

  pg.connect(process.env.DATABASE_URL, function(err, client) {
    console.log('err: ', err);
    var query = client.query('SELECT * FROM careers limit 5');
    query.on('row', function(row) {
      console.log(JSON.stringify(row));
    });
  });
  console.log('get');

  // res.send('/index.html');
});

function serveIndex(req, res) {
  statusCode = 200;

  // client.connect();

  // knex.select('*').table('careers').limit(2)
  //   .then(function(rows) {
  //     console.log('rows', rows);
  //   });

  console.log(process.env.HEROKU_POSTGRESQL_DBNAME_URL)
  pg.connect(database_url, function(err, client) {
    var query = client.query('SELECT * FROM careers');

    query.on('row', function(row) {
      console.log(JSON.stringify(row));
    });
  });
};
