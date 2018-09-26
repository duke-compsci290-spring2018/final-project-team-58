import { 
    WATSON_TONE_ANALYZER_USER,
    WATSON_TONE_ANALYZER_PASS,
    WATSON_PERSONALITY_INSIGHTS_USER,
    WATSON_PERSONALITY_INSIGHTS_PASS
} from './../secrets';

import ToneAnalyzerV3 from "watson-developer-cloud/tone-analyzer/v3"
import PersonalityInsightsV3 from "watson-developer-cloud/personality-insights/v3"

const toneAnalyzer = new ToneAnalyzerV3({
    username: WATSON_TONE_ANALYZER_USER,
    password: WATSON_TONE_ANALYZER_PASS,
    version: '2017-09-21',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
});

const personalityInsights = new PersonalityInsightsV3({
    username: WATSON_PERSONALITY_INSIGHTS_USER,
    password: WATSON_PERSONALITY_INSIGHTS_PASS,
    version: '2017-10-13',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});

export default {

    analyzeTone(req, res) {

        var tone_input = req.body;

            var toneParams = {
                tone_input: tone_input,
                content_type: "application/json",
                sentences: false
            };

            toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
                if (error) {
                    console.log(error);
                    res.send("error: " + error);
                    res.end();
                } else {
                    res.send(toneAnalysis);
                    res.end();
                }
            });

    },

    analyzePersonality(req, res) {
        var content = req.body;
        var personalityParams = {
            content: content,
            content_type: "application/json",
            consumption_preferences: true
        }

        personalityInsights.profile(personalityParams, function (error, profile) {
            if (error) {
                console.log(error);
                res.send("error: " + error);
                res.end();
            } else {
                res.send(profile);
                res.end();
            }
        })
    }

}