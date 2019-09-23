var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


var port = 3000;
var app = express();

app.get('/', function(req, res){

  var url = 'https://en.wikipedia.org/wiki/Phyllotaxis';

  request(url, function(error, response, html) {
    if(!error) {
      //res.send(html);
      var $ = cheerio.load(html);
      var data = {
        articleTitle : '',
        articleImg : '',
        articleParagraph : '',
      };

      $('#content').filter(function(){

        data.articleTitle = $(this).find('#siteSub').text();
        data.articleImg = $(this).find('img').first().attr('src');
        data.articleParagraph = $(this).find('p:nth-of-type(2)').text();



    });

    res.send(data);

    fs.writeFile('wiki-output.js', JSON.stringify(data, null, 4), function(error){
      console.log('File written on Hard Drive!');
    });

  }
});

  });

  app.get('/imdb', function(req, res){

    var url = 'https://imdb.com/chart/top';

    request(url, function(error, response, html) {

      if( !error ) {
        var $ = cheerio.load(html);
        var data = [];

        $('.lister-list').filter(function(){
          $(this).find('tr').each(function(i, elem){
            data[i] = "'" + $(this).find('.posterColumn').find('img').attr('src') + "'";
          });
        });

      res.send(data);

      fs.writeFile('imdb-output.js', 'var imdb_list = [' + data + ']', function(error){
        console.log('File written on Hard Drive!');
      });

    }

    });


  //res.send('Hello World!');

});

app.listen(port);
console.log('Magic happens on port' + port);

exports = module.exports = app;
