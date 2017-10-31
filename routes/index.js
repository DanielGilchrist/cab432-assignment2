module.exports = function(io) {
  let express = require('express');
  let zerorpc = require('zerorpc');
  let twitter = require('./twitter');
  let router = express.Router();
  
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

    let allTweets = []
  
    twitterClient.stream('statuses/filter', params, (stream) => {
      stream.on('data', (event) => {
        allTweets.push(event);
      });

      setInterval(() => {
        let nextTweet = allTweets.shift();

        if (nextTweet) {
          client.invoke("hello", nextTweet.text, function(error, res, more) {
            if (error) {
              console.log("Invoke error: " + error);
              throw error;
            } else {
              console.log("Text: " + nextTweet.text);
              console.log("polarity: " + res);
              io.sockets.emit('tweet', nextTweet);
            }
          });
        }
      }, 1000);
  
      stream.on('error', (error) => {
        console.log("Stream error: " + error);
        throw error;
      });
    }); 
  
    res.render('index', { title: 'CAB432 Assignment 2' });
  });

  return router;
};  