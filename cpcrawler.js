
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
        // ͨ������ҳ����Ϣ��ȡʵ��������ֲ�ͼ��Ϣ
        var kittiesGridData = filterKittiesGrid($);
        // ��ӡ��Ϣ
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
        // ����JQuery��񣬶���$
        //var $ = cheerio.load(html);
	var $ = $;

        // ����id��ȡ�ֲ�ͼ�б���Ϣ
        var kittiesGrid = $('.KittiesGrid');
        // �ֲ�ͼ����
        var kittiesGridData = [];

        /* �ֲ�ͼ�б���Ϣ���� */
        kittiesGrid.find('div.KittiesGrid-item').each(function(item) {
            var pic = $(this);
            // �ҵ�a��ǩ����ȡhref����
            var pic_href = pic.find('a').attr('href');
            // ��ȡ�۸�
	    var pic_price = $(this).find('span.KittyStatus-note').text();
            // ��ȡ����
	    var pic_detail = [];
	    $(this).find('.KittyCard-details-item').each(function(item) {
		pic_detail.push($(this).text().trim());
	    });
            // �������������
            kittiesGridData.push({
                pic_href : pic_href,
		pic_price : pic_price,
		pic_detail : pic_detail,
            });
        });
        // �����ֲ�ͼ�б���Ϣ
        return kittiesGridData;
    } else {
        console.log('�����ݴ��룡');
    }
}

/* ��ӡ��Ϣ */
function printInfo(kittiesGridData) {
    // ����
    var count = 0;
    // ������Ϣ�б�
    kittiesGridData.forEach(function(item) {
        // ��ȡͼƬ��Ӧ�����ӵ�ַ
        var pic_href = item.pic_href;
	var pic_price = item.pic_price;
	var pic_detail = item.pic_detail;

        // ��ӡ��Ϣ
	console.log(pic_detail.slice(0,2).toString() + ","+ pic_price + ", " + pic_detail.slice(2,4).toString());
    });
}