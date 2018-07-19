//SnowBlossom FrontEnd.
//Created by xxcc.

var express = require('express');
var app = express();
const http = require('http');
const cheerio = require('cheerio');
var fs=require('fs');

app.set('views','.');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
getShare(res);
});
app.get('/css/default.css', function(req, res) {
res.sendFile(__dirname+'/css/default.css');
});

// POST method route
app.post('/', function (req, res) {

});

var server = app.listen(8080, function () {
var host = server.address().address;
var port = server.address().port;
  console.log('SnowBlossom Pool listening at http://%s:%s', host, port);
});

function getShare(res) {
  var share=JSON.parse(fs.readFileSync( "share.json"));
  var report=JSON.parse(fs.readFileSync( "report.json"));
  report.miners.pop();
  share.miners.pop();
  res.render('index', {title: 'SnowBlossom Pool', share: share, report: report});
}
