// 加载https模块
var https = require('https');
// Cheerio 是一个Node.js的库， 它可以从html的片断中构建DOM结构，然后提供像jquery一样的css选择器查询
var cheerio = require('cheerio');

// 定义网络爬虫的目标地址：自如友家的主页
var url = 'https://cloudpet.io/cat/sale';

https.get(url, function(res) {
    var html = '';
    // 获取页面数据
    res.on('data', function(data) {
        html += data;
    });
    // 数据获取结束
    res.on('end', function() {
        // 通过过滤页面信息获取实际需求的轮播图信息
        var kittiesGridData = filterKittiesGrid(html);
        // 打印信息
        printInfo(kittiesGridData);
    });
}).on('error', function() {
    console.log('获取数据出错！');
});

/* filter Kitties */
function filterKittiesGrid(html) {
    if (html) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(html);

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