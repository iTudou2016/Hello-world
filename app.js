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

        // ͨ������ҳ����Ϣ��ȡʵ��������ֲ�ͼ��Ϣ
        var kittiesGridData = filterKittiesGrid(body);
	res.render('index', {title: 'My jade', message: kittiesGridData});

    }
  })
}



/* filter Kitties */
function filterKittiesGrid(body) {
    if (body) {
        // ����JQuery��񣬶���$
        var $ = cheerio.load(body);

        // ����class��ȡè���б���Ϣ
        var kittiesGrid = $('.KittiesGrid');
        // è������
        var kittiesGridData = [];

        /* è���б���Ϣ���� */
        kittiesGrid.find('div.KittiesGrid-item').each(function(item) {
            var cat = $(this);
            // �ҵ�a��ǩ����ȡhref����
            var cat_href = cat.find('a').attr('href');
            // ��ȡ�۸�
	    var cat_price = $(this).find('span.KittyStatus-note').text();
            // ��ȡ����
	    var cat_detail = [];
	    $(this).find('.KittyCard-details-item').each(function(item) {
		cat_detail.push($(this).text().trim());
	    });
fs.appendFile('./apet.txt', cat_href + cat_price + cat_detail + '\r\n', 'utf-8', function(err) {
        if (err) {
          console.log(err);
        }
      });
            // �������������
            kittiesGridData.push({
                cat_href : cat_href,
		cat_price : cat_price,
		cat_detail : cat_detail,
            });
        });
        // �����ֲ�ͼ�б���Ϣ
        return kittiesGridData;
    } else {
        console.log('�����ݴ��룡');
    }
}

/* ��ӡ��Ϣ */
function printInfo(res,kittiesGridData) {
    // ����
    var count = 0;
res.write('hello');
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