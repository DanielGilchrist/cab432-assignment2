module.exports = function(io) {
  let express = require('express');
  let zerorpc = require('zerorpc');
  let url = require('url');
  let twitter = require('./twitter');
  let router = express.Router();
  let loki = require('lokijs', {
    autosave: true,
    autosaveInterval: 500,
    autoload: true
  });
  
  let db = new loki('database.db');
  let table = db.addCollection("words");
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    if (req.query.streaming) {
      let client = new zerorpc.Client();
      client.connect("tcp://127.0.0.1:4242");
    
      let twit = new twitter();
      let twitterClient = twit.client;
      let track = req.query.terms.split(" ").join(", ");
      let params = {
        tweet_mode: 'extended',
        language: 'en',
        track: track
      };
  
      let positive = 0;
      let neutral = 0;
      let negative = 0;
      let allTweets = [];
    
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
                  if(results[i]){
                    let text = results[i].text;
                    let size = Number(results[i].size);
                    // let item = table.find({'text': {'$eq': text}});
                    // if (item.length > 0) {
                    //   let new_size = Number(item[0].size) + size;
                    //   // Remove object
                    //   // table.remove(item[0]);
                    //   new_text = text;
  
                    //   table.insert({text: new_text, size: new_size});
                    //   db.saveDatabase();
                    // } else {
                      table.insert({text: text, size: size});
                      db.saveDatabase();
                    // }
                  }
                }
  
                
                let table_data = [].concat(table.data);
                table_data = table_data.filter(function(obj) { 
                  delete obj['meta']; 
                  delete obj['$loki']; 
                  return obj; 
                });
  
                io.sockets.emit('word-cloud', table_data);
              }
            });
          }
        }, 2000);
    
        stream.on('error', (error) => {
          console.log("Stream error: " + error);
          res.redirect('/error');
        });
      }); 
    
      res.render('index', { title: 'CAB432 Assignment 2', streaming: true });
    } else {
      res.render('index', { title: 'CAB432 Assignment 2' });
    }
  });

  router.post('/start', function(req, res) {
    let terms = req.body.terms;

    res.redirect(url.format({
      pathname: '/',
      query: {
        "terms": terms, 
        "streaming": true
      }
    }));
  });

  router.post('/stop', function(req, res) {
    res.redirect(url.format({
      pathname: '/',
      query: {
        "terms": '',
        "streaming": false
      }
    }));
  });

  router.get('/error', function(req, res, next) {
    res.render('error', {});
  });

  return router;
};  