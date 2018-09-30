// when deployed, use locally defined values, otherwise use typical settings for server
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

// use Express as our router
const Express = require('express');
const BodyParser = require('body-parser')
const Cors = require('cors')

// create express app
const app = Express()
// allow requests from any domain, no cross site concerns
app.use(Cors())
// parse form data more easily
app.use(BodyParser.urlencoded({ extended: true }))
// parse JSON form data
app.use(BodyParser.json())

// import Watson and Twitter services
const WatsonAPI = require("./src/services/watsonAI.js")
const Twitter = require("./src/services/twitter.js")

// list of URLs (and their protocols) that this server responds to
app.post("/tweets", Twitter.searchTweets);
app.post("/tones", WatsonAPI.analyzeTone);
app.post("/personality", WatsonAPI.analyzePersonality);

// nothing useful for root URL to do
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Alina Walling's final project!"})
    res.end()
})

// start server to listen for requests
app.listen(PORT, function() {
    console.log(`Server is listening on port http://${this.address().address}:${this.address().port}`);
})