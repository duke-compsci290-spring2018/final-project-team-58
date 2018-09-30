// use Node Request Package
const request = require("request");

// save Twitter API keys
const twitterSearchAuth = {
    consumer_key: "v88r6lWdrpiiYFrcYVZtwN4gx",
    consumer_secret: "nvbKZnwuOpBajOKjGIJtBKfhtGOpdlp8GLNO46HoqIFIWvLCT7"
}

// save Twitter API url
const twitterSearchConfig = {
    url: "api.twitter.com/1.1/tweets/search/fullarchive/",
    env: "dev"
}

// search tweets function sent by server
exports.searchTweets = function(req, res) {
        // query search parameter
        var query = req.body;

        // generate Twitter credentials
        var key = twitterSearchAuth.consumer_key;
        var secret = twitterSearchAuth.consumer_secret;
        var cat = key + ":" + secret;
        var credentials = new Buffer(cat).toString('base64');

        // request a Bearer Token from Twitter with credentials for authentication
        request.post({
            url: 'https://api.twitter.com/oauth2/token',
            headers: {
                "Authorization": "Basic " + credentials,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: "grant_type=client_credentials"

        }, function (error, resp, result) {
            // catch an error and end request
            if (error) {
                console.log(error);
                res.send("error:" + error);
                res.end();
            }
            // save the Bearer token retrieved from Twitter
            var tokenData = JSON.parse(result);
            var token = tokenData.access_token;

            // submit search Tweets request to Twitter with Bearer Token authentication
            request.post({
                url: "https://" + twitterSearchConfig["url"] + twitterSearchConfig["env"] + ".json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": 'application/json'
                },
                body: query,
                json: true
            }, function (e, r, tweets) {
                // catch an error and end request
                if (e) {
                    console.log(e);
                    res.send("error:" + e);
                    res.end();
                } 
                // send the Tweets to request
                else {
                    res.send(tweets);
                    res.end();
                }
            });
        });
    }







