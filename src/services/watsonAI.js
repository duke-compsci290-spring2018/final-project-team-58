import { 
    WATSON_TONE_ANALYZER_USER,
    WATSON_TONE_ANALYZER_PASS,
    WATSON_PERSONALITY_INSIGHTS_USER,
    WATSON_PERSONALITY_INSIGHTS_PASS
} from './../secrets';

import ToneAnalyzerV3 from "watson-developer-cloud/tone-analyzer/v3"
import PersonalityInsightsV3 from "watson-developer-cloud/personality-insights/v3"

export const toneAnalyzer = new ToneAnalyzerV3({
    username: WATSON_TONE_ANALYZER_USER,
    password: WATSON_TONE_ANALYZER_PASS,
    version: '2017-09-21',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
});

export const personalityInsights = new PersonalityInsightsV3({
    username: WATSON_PERSONALITY_INSIGHTS_USER,
    password: WATSON_PERSONALITY_INSIGHTS_PASS,
    version: '2017-10-13',
    url: "http://localhost:3000/" + 'https://gateway.watsonplatform.net/personality-insights/api'
});