module.exports = function(io) {
  let express = require('express');
  let zerorpc = require('zerorpc');
  let loki = require('lokijs')
  let twitter = require('./twitter');
  let router = express.Router();
  
  let db = new loki('database.db');
  let table = db.addCollection('words');
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    let client = new zerorpc.Client();
    client.connect("tcp://127.0.0.1:4242");
  
    let twit = new twitter();
    let twitterClient = twit.client;
    let params = {
      tweet_mode: 'extended',
      language: 'en',
      track: 'javascript'
    };

    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let allTweets = [];
    let entities = {words: []};
  
    twitterClient.stream('statuses/filter', params, (stream) => {
      stream.on('data', (event) => {
        allTweets.push(event);
      });

      setInterval(() => {
        let nextTweet = allTweets.shift();

        if (nextTweet) {
          client.invoke("get_sentiment", nextTweet.text, function(error, res, more) {
            if (error) {
              console.log("Invoke error: " + error);
              throw error;
            } else {
              let sentiment = JSON.parse(res.toString());
              console.log("Text: " + nextTweet.text);
              console.log("polarity: " + sentiment.polarity);

              if (sentiment.polarity > 0.1) {
                positive++;
              } else if (sentiment.polarity < -0.1) {
                negative++;
              } else {
                neutral++;
              }

              io.sockets.emit('tweet', nextTweet);
              io.sockets.emit('chart', positive, neutral, negative);
            }
          });

          client.invoke("get_entities", nextTweet.text, function(error, res, more) {
            if (error) {
              console.log("Invoke error: " + error);
              throw error;
            } else {
              let results = JSON.parse(res.toString());
              
              // add results to database
              for(let i = 0; i < results.length; i++){
                let text = results[i].text;
                let size = results[i].text;
                let item = table.findOne({'text': text});
                if (item) {
                  item.size += size;
                  table.update(item);
                } else {
                  table.insert({'text': text, 'size': size});
                }
              }

              console.log(table.data);

              io.sockets.emit('word-cloud', table.data);
            }
          });
        }
      }, 2000);
  
      stream.on('error', (error) => {
        console.log("Stream error: " + error);
        res.redirect('/error');
      });
    }); 
  
    res.render('index', { title: 'CAB432 Assignment 2' });
  });

  router.get('/error', function(req, res, next) {
    res.render('error', {});
  });

  return router;
};  