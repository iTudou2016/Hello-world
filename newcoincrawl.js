var Crawler = require("crawler");

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
	if(!/ICO|POS|AIRDROP/i.test($(e).text())) {
	        console.log($(e).text());
  	        console.log($(e).find('a').attr('href'));
	}
	      });
        }
       console.log("task over");
        done();
    }
});

// Queue just one URL, with default callback
c.queue(['https://bitcointalk.org/index.php?board=159.0','https://bitcointalk.org/index.php?board=159.40','https://bitcointalk.org/index.php?board=159.80','https://bitcointalk.org/index.php?board=159.120']);
