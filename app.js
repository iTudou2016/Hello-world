var express = require('express');
var app = express();
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

var birds = require('./birds');
var dogs = require('./dogs');
app.use('/dogs',dogs);
app.use('/birds', birds);

app.set('views','./views');
app.set('view engine', 'jade');

//app.use(express.static('crawler'));

app.get('/', function(req, res) {
 res.render('index', {title: 'My jade', message: 'Hello world.'});
});

// POST method route
app.post('/', function (req, res) {

fetchKittiesGrid(res);
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function fetchKittiesGrid(res) {
  request('https://cloudpet.io/cat/sale', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //$ = cheerio.load(body);

        // 通过过滤页面信息获取实际需求的轮播图信息
        var kittiesGridData = filterKittiesGrid(body);
	res.render('index', {title: 'My jade', message: kittiesGridData});

    }
  })
}



/* filter Kitties */
function filterKittiesGrid(body) {
    if (body) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(body);

        // 根据class获取猫咪列表信息
        var kittiesGrid = $('.KittiesGrid');
        // 猫咪数据
        var kittiesGridData = [];

        /* 猫咪列表信息遍历 */
        kittiesGrid.find('div.KittiesGrid-item').each(function(item) {
            var cat = $(this);
            // 找到a标签并获取href属性
            var cat_href = cat.find('a').attr('href');
            // 获取价格
	    var cat_price = $(this).find('span.KittyStatus-note').text();
            // 获取详情
	    var cat_detail = [];
	    $(this).find('.KittyCard-details-item').each(function(item) {
		cat_detail.push($(this).text().trim());
	    });
fs.appendFile('./apet.txt', cat_href + cat_price + cat_detail + '\r\n', 'utf-8', function(err) {
        if (err) {
          console.log(err);
        }
      });
            // 向数组插入数据
            kittiesGridData.push({
                cat_href : cat_href,
		cat_price : cat_price,
		cat_detail : cat_detail,
            });
        });
        // 返回轮播图列表信息
        return kittiesGridData;
    } else {
        console.log('无数据传入！');
    }
}

/* 打印信息 */
function printInfo(res,kittiesGridData) {
    // 计数
    var count = 0;
res.write('hello');
    // 遍历信息列表
    kittiesGridData.forEach(function(item) {
        // 获取图片对应的链接地址
        var pic_href = item.pic_href;
	var pic_price = item.pic_price;
	var pic_detail = item.pic_detail;

        // 打印信息
	console.log(pic_detail.slice(0,2).toString() + ","+ pic_price + ", " + pic_detail.slice(2,4).toString());
    });
}