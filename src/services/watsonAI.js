// API keys for Watson Tone Analyzer
const WATSON_TONE_ANALYZER_USER = "fe8a6e93-7956-4537-88f6-cc2aeaf467a1";
const WATSON_TONE_ANALYZER_PASS = "orFyEbGYJmQg";

// API keys for Watson Personality Insights
const WATSON_PERSONALITY_INSIGHTS_USER = "8aaaf6cd-bbcd-4016-867c-4302346159b6";
const WATSON_PERSONALITY_INSIGHTS_PASS = "5KJdgHMx1ywn";

// create Tone Analyzer and Personality Insights objects from Watson Node SDK
const ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");
const PersonalityInsightsV3 = require("watson-developer-cloud/personality-insights/v3");

// configure Tone Analyzer with credentials
const toneAnalyzer = new ToneAnalyzerV3({
    username: WATSON_TONE_ANALYZER_USER,
    password: WATSON_TONE_ANALYZER_PASS,
    version: '2017-09-21',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
});

// configure Personality Insights with credentials
const personalityInsights = new PersonalityInsightsV3({
    username: WATSON_PERSONALITY_INSIGHTS_USER,
    password: WATSON_PERSONALITY_INSIGHTS_PASS,
    version: '2017-10-13',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});

// analyze tone function sent by server
exports.analyzeTone = function (req, res) {
    // text input
    var tone_input = req.body;
    // parameters for request
    var toneParams = {
        tone_input: tone_input,
        content_type: "application/json",
        sentences: false
    };

    // use Tone Analyzer object to make request with parameters
    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
        // catch an error and end request
        if (error) {
            console.log(error);
            res.send("error: " + error);
            res.end();
        }
        // send response data back to request
        else {
            res.send(toneAnalysis);
            res.end();
        }
    });
};

// analyze personality function sent by server
exports.analyzePersonality = function (req, res) {
    // text input
    var content = req.body;
    // parameters for request
    var personalityParams = {
        content: content,
        content_type: "application/json",
        consumption_preferences: true
    };

    // use Personality Insights object to make request with parameters
    personalityInsights.profile(personalityParams, function (error, profile) {
        // catch an error and end request
        if (error) {
            console.log(error);
            res.send("error: " + error);
            res.end();
        }
        // send response data back to request
        else {
            res.send(profile);
            res.end();
        }
    });
};