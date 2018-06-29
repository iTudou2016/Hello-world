
'use strict';

const http = require('http');
const cheerio = require('cheerio');
const Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        // 通过过滤页面信息获取实际需求的轮播图信息
        var kittiesGridData = filterKittiesGrid($);
        // 打印信息
        printInfo(kittiesGridData);
        }
        done();
    }
});


//web server
var webSvr = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.write('welcome to 91Mud, web content will show here later');
    res.end('I am web server');
});

webSvr.listen(8888, function(req, res) {
    console.log('web server running at port ' + '8888')
    c.queue('https://cloudpet.io/cat/sale');
});

/* filter Kitties */
function filterKittiesGrid($) {
    if ($) {
        // 沿用JQuery风格，定义$
        //var $ = cheerio.load(html);
	var $ = $;

        // 根据id获取轮播图列表信息
        var kittiesGrid = $('.KittiesGrid');
        // 轮播图数据
        var kittiesGridData = [];

        /* 轮播图列表信息遍历 */
        kittiesGrid.find('div.KittiesGrid-item').each(function(item) {
            var pic = $(this);
            // 找到a标签并获取href属性
            var pic_href = pic.find('a').attr('href');
            // 获取价格
	    var pic_price = $(this).find('span.KittyStatus-note').text();
            // 获取详情
	    var pic_detail = [];
	    $(this).find('.KittyCard-details-item').each(function(item) {
		pic_detail.push($(this).text().trim());
	    });
            // 向数组插入数据
            kittiesGridData.push({
                pic_href : pic_href,
		pic_price : pic_price,
		pic_detail : pic_detail,
            });
        });
        // 返回轮播图列表信息
        return kittiesGridData;
    } else {
        console.log('无数据传入！');
    }
}

/* 打印信息 */
function printInfo(kittiesGridData) {
    // 计数
    var count = 0;
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