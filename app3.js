const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');

const startId = "620719"; //��ʼID
const articalSavePath = "./data"; //���´��·��

const fetchLimit = process.argv[2] || 50; //ץȡ����
//���������ļ���
if (!fs.existsSync(articalSavePath)) {
  fs.mkdirSync(articalSavePath);
}

//������
let fetched = 0;
//��ȡ��������id
let getNext = function(_csrf, op) {
  let syncUrl = 'http://www.cnbeta.com/comment/read';
  return new Promise(function(resolve, reject) {
    if (!_csrf || !op) {
      return reject(`getNext() param error: _csrf: ${_csrf}, op: ${op}`);
    } else {
      syncUrl += '?_csrf=' + encodeURIComponent(_csrf) + '&op=' + encodeURIComponent(op);
      http.get(syncUrl, function(res) {
        let resChunk = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          resChunk += chunk;
        });
        res.on('end', () => {
          try {
            let json = JSON.parse(resChunk);
            let lastId = json.result.neighbor.last;
            resolve(lastId);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  });
};
//��������
let savedContent = function($, news_title) {
  $('.article-content p').each(function(index, item) {
    let x = $(this).text().trim();
    if (x) {
      x = '  ' + x + '\n';
      fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
};

//ץȡ����
let fetchPage = function(x, fullpath) {
  if (fetched > fetchLimit) {
    fetched = 0;
    console.log(`�����ץȡ ${fetchLimit} ������`);
    return process.exit();
  }
  let articalUrl = fullpath || `http://www.cnbeta.com/articles/${x}.htm`;
  let client = http.get(articalUrl, function(res) {
    if (res.statusCode === 301) {
      if (res.headers.location) {
        fetchPage(null, res.headers.location);
      } else {
        console.log('fetchPage() reLocated. ', articalUrl);
      }
      return client.abort();
    }
    let html = '';
    res.setEncoding('utf-8');
    res.on('data', function(chunk) {
      html += chunk;
    });
    res.on('end', function() {
      if (html) {
        fetched++;
        const $ = cheerio.load(html);
        const time = $('.cnbeta-article .title .meta span:first-child').text().trim();
        let news_title = $('.cnbeta-article .title h1').text().trim().replace(/\//g, '-');
        if (news_title.length > 40) {
          news_title = news_title.slice(0, 40);
        }
        savedContent($, news_title);
        savedImg($, news_title);
        console.log(`got: ${news_title} url: ${articalUrl}`);
        //ץȡ��һƪ
        let _csrf = $('meta[name="csrf-token"]').attr('content');
        let opStr = html.match(/{SID:[^{}]+}/)[0];
        let op = '1,';
        op += opStr.match(/SID:"([^"]+)"/)[1] + ',' + opStr.match(/SN:"([^"]+)"/)[1];
        getNext(_csrf, op).then(function(lastId) {
          fetchPage(lastId);
        }).catch(function(error) {
          console.log(error);
        });
      } else {
        console.log('fetchPage() failed. ', articalUrl);
      }
    });
  }).on('error', function(err) {
    console.log(err);
  });
};

console.log(`����ץȡ ${fetchLimit} ������`);
fetchPage(startId);