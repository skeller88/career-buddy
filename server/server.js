var http = require("http");
var url = require("url");
var handler = require("./request-handler.js");

var port = 3000;
var ip = "127.0.0.1";

var routes = {
  "/": handler.handler
};

var router = function(req, res) {
  var parsedURI = url.parse(req.url);
  if(routes[parsedURI.pathname]){
    var route = routes[parsedURI.pathname];
    route(req, res);
  }else{
    handler.sendResponse(res, null, 404);
  }
};

var server = http.createServer(router);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
