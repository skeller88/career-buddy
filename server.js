var express = require('express');
var app = express();

require('./server/request-handler')(app);

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Server now listening on port ' + port);
