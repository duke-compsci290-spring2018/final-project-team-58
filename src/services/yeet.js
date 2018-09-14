export const request = require("request");

export const twitterSearchAuth = {
    consumer_key: "hzpbBZl9Fh9OI11fx4CtnZLKf",
    consumer_secret: "Yniz3bWqNykpAXUvJswb2MXGkrQTDUpUknX3IY3goPEAHbocc3"
    //access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    //access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

export const twitterSearchConfig = {
    url: "api.twitter.com/1.1/tweets/search/fullarchive/",
    env: "dev"
}