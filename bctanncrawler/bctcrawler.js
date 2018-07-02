//Bitcointalk ANN crawler

var express = require('express');
var app = express();
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
var Crawler = require("crawler");

app.set('views','.');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
 res.render('index', {title: 'BctANN list', message: ''});
});

// POST method route
app.post('/', function (req, res) {
  fetchannData(res);
});

var server = app.listen(8080, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('Bitcointalk crawler listening at http://%s:%s', host, port);
});


function fetchannData(svrres) {
// Queue just one URL, with default callback
var bctannData = [];
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $("[id^='msg_4']").each(function(i, e) {
	if(/POW/i.test($(e).text())||!/ICO|POS|AIRDROP|WHITELIST/i.test($(e).text())) {
	        console.log($(e).attr('id').replace("msg_", ""));
	        console.log($(e).text());
  	        console.log($(e).find('a').attr('href'));
	         // 向数组插入数据
	         bctannData.push({
		ann_msgID: $(e).attr('id').replace("msg_", ""),
		ann_title : $(e).text(),
		ann_href : $(e).find('a').attr('href'),
	          });
	}
             });
        }
        done();
    }
});
c.queue(['https://bitcointalk.org/index.php?board=159.0','https://bitcointalk.org/index.php?

board=159.40','https://bitcointalk.org/index.php?board=159.80','https://bitcointalk.org/index.php?board=159.120']);
c.on('drain',function(){
    // 异步数据处理
   console.log("Crawler work done!");
   svrres.render('index', {title: 'BctANN list', message: bctannData});
});
}
