require('dotenv').load();

let twitter = require('twitter');

class Twitter {
    constructor() {
        this.client = new twitter({
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_KEY_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    }
}

module.exports = Twitter;