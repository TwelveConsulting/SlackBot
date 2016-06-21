var http = require('http');
var moment = require('moment');
moment.locale('fr')
var date = moment().format('LLLL');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end(date);
});
server.listen(8080);