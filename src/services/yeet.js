export const request = require("request");

export const twitterSearchAuth = {
    consumer_key: "v88r6lWdrpiiYFrcYVZtwN4gx",
    consumer_secret: "nvbKZnwuOpBajOKjGIJtBKfhtGOpdlp8GLNO46HoqIFIWvLCT7"
    //access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    //access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

export const twitterSearchConfig = {
    url: "api.twitter.com/1.1/tweets/search/fullarchive/",
    env: "dev"
}