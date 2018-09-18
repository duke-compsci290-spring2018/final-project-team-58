const request = require("request");

const twitterSearchAuth = {
    consumer_key: "v88r6lWdrpiiYFrcYVZtwN4gx",
    consumer_secret: "nvbKZnwuOpBajOKjGIJtBKfhtGOpdlp8GLNO46HoqIFIWvLCT7"
    //access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    //access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

export const twitterSearchConfig = {
    url: "api.twitter.com/1.1/tweets/search/30day/",
    env: "dev30"
}

import { API_URL } from "./../config.js"

export default {
    searchTweets(req, res) {
        
        var query = req.body;

        var key = twitterSearchAuth.consumer_key;
        var secret = twitterSearchAuth.consumer_secret;
        var cat = key + ":" + secret;
        var credentials = new Buffer(cat).toString('base64');

        request.post({
            url: 'https://api.twitter.com/oauth2/token',
            headers: {
                "Authorization": "Basic " + credentials,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: "grant_type=client_credentials"

        }, function (error, resp, result) {

            if (error) {
                console.log(error);
                res.send("error:" + error);
                res.end();
            }

            var tokenData = JSON.parse(result);
            var token = tokenData.access_token;

            request.post({
                url: "https://" + twitterSearchConfig["url"] + twitterSearchConfig["env"] + ".json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": 'application/json'
                },
                body: query,
                json: true
            }, function (e, r, tweets) {
                if (e) {
                    console.log(e);
                    res.send("error:" + e);
                    res.end();
                } else {
                    console.log
                }
                res.send(tweets);
                res.end();
            })

        });

    }







}