let express = require('express');
let zerorpc = require('zerorpc');
let twitter = require('./twitter');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let client = new zerorpc.Client();
  client.connect("tcp://34.214.81.157:4242");

  /*client.invoke("hello", "World!", function(error, res, more) {
    if (error) {
      console.log("ERROR: " + error);
    } else {
      console.log(res);
    }
  });*/

  let twit = new twitter();
  let twitterClient = twit.client;

  let stream = twitterClient.stream('statuses/filter', { track: 'trump' }, (stream) => {
    stream.on('data', (event) => {
      client.invoke("hello", event.text, function(error, res, more) {
        if (error) {
          console.log("Invoke error: " + error);
          throw error;
        } else {
          console.log("Text: " + event.text);
          console.log("polarity: " + res);
        }
      });
    });

    stream.on('error', (error) => {
      console.log("Stream error: " + error);
      throw error;
    });
  }); 

  res.render('index', { title: 'CAB432 Assignment 2' });
});

module.exports = router;
