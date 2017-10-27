require('dotenv').load();

let twitter = require('twitter');

class Twitter {
    constructor() {
        /*this.client = new twitter({
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_KEY_SECRET,
            bearer_token: process.env.TWITTER_BEARER_TOKEN
        });*/

        this.client = new twitter({
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_KEY_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    }

    buildTweetParams(query, location, count) {
        let params = {
            q: query,
            geocode: location,
            count: count,
            lang: 'en'
        };

        return params;
    }

    getTweets(query, location, count, callback) {
        let params = this.buildTweetParams(query, location, count);
        
        return this.client.get('search/tweets', params, callback);
    }

    getTweetsText(tweets) {
        let tweetTexts = [];
        let statuses = tweets.statuses;

        statuses.forEach(function(status) {
            tweetTexts.push(status.text);            
        }, this);

        return tweetTexts;
    }
}

module.exports = Twitter;