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
 res.render('index', {title: 'BCT ANN list', message: ''});
});

// POST method route
app.post('/', function (req, res) {
  fetchannData(res);
});
//每隔10分钟刷新一次
setInterval(fetchannData(res),600000);

var server = app.listen(8080, function () {
var host = server.address().address;
var port = server.address().port;
  console.log('Bitcointalk crawler listening at http://%s:%s', host, port);
});

function fetchannData(svrres) {
// Queue just one URL, with default callback
var bctannData = [];
var task = [];
var c = new Crawler({
    //maxConnections : 10,
    rateLimit: 500,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            process.stdout.write(".");
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $("[id^='msg_4']").each(function(i, e) {
	var ann_msgID = $(e).attr('id').replace("msg_", "");
	var ann_title = $(e).text();
	var ann_href = $(e).find('a').attr('href');
	if(ann_title.search(/ANN/)>-1&&(/POW/i.test(ann_title)||!/ICO|POS|AIRDROP|WHITELIST|SALE/i.test(ann_title))&&Number(ann_href.slice(40, -2))>4600000 ) {
	         // 向数组插入数据
	         bctannData.push({
		ann_msgID: ann_msgID + "//" + ann_href.slice(40, -2),
		ann_title : ann_title,
		ann_href : ann_href,
	          });
	}
             });
        }
        done();
    }
});
process.stdout.write(new Date().toLocaleTimeString() + ": Crawler work starting.");
  for (var i=0; i<20; i++)
  {
       task.push('https://bitcointalk.org/index.php?board=159.' + i*40);
  }
c.queue(task);
c.on('drain',function(){
    // 异步数据处理
   process.stdout.write("\n");
   console.log(new Date().toLocaleTimeString() + ": Crawler work done. " + bctannData.length + " links crawled!");
   svrres.render('index', {title: 'BCT ANN list', message: bctannData});
});
}
