var http = require('http');
var moment = require('moment');
moment().format();

var date = moment().format();
var server = http.createServer(function(req, res) {
    res.write('nr');
    res.end();
});
server.listen(8080);