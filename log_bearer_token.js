require('dotenv').load();
let request = require("request");

let key = process.env.TWITTER_KEY;
let secret = process.env.TWITTER_SECRET;
let cat = key +":"+secret;
let credentials = new Buffer(cat).toString('base64');

let url = 'https://api.twitter.com/oauth2/token';

request({ url: url,
    method:'POST',
    headers: {
        "Authorization": "Basic " + credentials,
        "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"

}, function(err, resp, body) {
    console.log(body); // log bearer token
});