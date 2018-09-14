const TwitterClient = require('twitter');
//const getBearerToken = require("get-twitter-bearer-token");

const TWITTER_CONSUMER_KEY = "hzpbBZl9Fh9OI11fx4CtnZLKf";
const TWITTER_CONSUMER_SECRET = "Yniz3bWqNykpAXUvJswb2MXGkrQTDUpUknX3IY3goPEAHbocc3";
const TWITTER_ACCESS_TOKEN = "264954753-qwp9PBo8fCVTB6qOCftRMVphJYFDI9K5KRbLnBbR";
const TWITTER_ACCESS_TOKEN_SECRET = "ao5C4jwyPfCIaTK9C2CC545OV4foBd0zom2fd5wupjrha";
var TWITTER_BEARER_TOKEN = "";
/*
getBearerToken(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, (error, response) => {
  if (error) {
    // handle error
    console.log(error);
    console.log("oh no");
  } else {
    TWITTER_BEARER_TOKEN = response.body.access_token;
    // bearer token
    console.log("success!");
    console.log(response.body.access_token);
  }
});*/


var R = require("request");

var key = TWITTER_CONSUMER_KEY;
var secret = TWITTER_CONSUMER_SECRET;
var cat = key +":"+secret;
var credentials = new Buffer(cat).toString('base64');

var url = 'https://api.twitter.com/oauth2/token';


R.post({ url: url,
    method:'POST',
    headers: {
        //"Access-Control-Allow-Origin": "*",
        "Authorization": "Basic " + credentials,
        "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        'Access-Control-Allow-Credentials': "true"
        
    },
    body: "grant_type=client_credentials"

}, function(err, resp, body) {

  if (err) {
    console.log(err);
    console.log("oh no");
  } else {

  

    //console.dir(body); //the bearer token...
    console.log(body);
    console.log("success");
    TWITTER_BEARER_TOKEN = body;
  }
});

export const twitter = new TwitterClient({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    //access_token_key: TWITTER_ACCESS_TOKEN,
    //access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
    bearer_token: TWITTER_BEARER_TOKEN
  });