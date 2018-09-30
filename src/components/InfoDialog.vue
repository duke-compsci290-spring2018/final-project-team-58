<!-- App Info Dialog -->
<template>
<v-card class="elevation-12">

    <!-- TOOLBAR -->
    <v-toolbar card dark color="purple darken-4">
        <!-- title -->
        <v-toolbar-title>About the App</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- close button -->
        <v-btn icon @click="closeDialog">
            <v-icon>close</v-icon>
        </v-btn>
    </v-toolbar>

    <!-- CONTENT -->
    <v-card-text class="pa-5">
        <h2 class="deep-purple--text text--darken-3 display-1 font-weight-light mb-3">Have you ever wanted to know how Twitter users from all over the world feel about a specific event or topic?</h2>
        <p>
            Twitter hashtags make it easy to find Tweets centering around the same topic, but uncovering the general feelings surrounding that hashtag is more of a challenge. You could search through all those Tweets and find out for yourself, or you could let this app do it for you. All you have to do is choose a hashtag.
        </p>
        <v-divider class="my-4"></v-divider>
        <h2 class="purple--text text--darken-1 display-1 font-weight-light mb-3">How does it work?</h2>
        <p class="font-weight-bold">
            Once you submit a valid Twitter hashtag in the search box, the search process broken down goes a little something like this:
        </p>
        <ol>
            <li>The app gathers up to 100 of the most recent Tweets containing that hashtag
                <ul>
                    <li>The number of Tweets analyzed is displayed</li>
                </ul>
            </li>
            <li>The text from the body of the Tweets is analyzed using IBM Watson’s Tone Analyzer
                <ul>
                    <li>The list of tones and their scores found in the text is saved</li>
                    <li>The tones are displayed as a bar graph of the tone scores created using the D3 JavaScript Library</li>
                </ul>
            </li>
            <li>The text from the body of the Tweets is analyzed using IBM Watson’s Personality Insights service
                <ul>
                    <li>The personality profile inferred from the text is saved</li>
                    <li>The number of words analyzed is displayed</li>
                    <li>The personality profile is run through the IBM Watson Personality Insights Personality Text Summary generator service and displayed as a short text summary of the results</li>
                    <li>The personality traits, values, and needs and their percentages from the profile are displayed as three separate circle bar graphs created using the D3 JavaScript Library</li>
                    <li>The consumption preferences from the profile are separated into likely and unlikely preferences and displayed as two separate condensed lists</li>
                </ul>
            </li>
            <li>You’ll be taken to the results page to view all the visualized data collected from the different services about the Tweets from your hashtag!</li>
        </ol>
        <v-divider class="my-4"></v-divider>
        <h2 class="pink--text text--darken-2 display-1 font-weight-light mb-3">What should I search?</h2>
        <p>You can search any valid Twitter hashtag. Whether you choose a hashtag relevant to an important world event, a person, sports, a TV show, or anything else you might be interested in, the app will find the Tweets and analyze them for you.</p>
        <p><span class="font-weight-bold">Some search examples might include:</span> #NBAFinals, #MeToo, #TheBachelorFinale, #covfefe, #funny, #TheVoice, #NationalDonutDay…</p>
        <p>The world (or rather Twitter) is your oyster!</p>
        <v-divider class="my-4"></v-divider>
        <h2 class="pink--text text--lighten-2 display-1 font-weight-light mb-3">Where do the results come from?</h2>
        <p class="font-weight-bold">This app uses the following services:</p>
        <ul class="mb-3">
            <li><a class="info" href="https://developer.twitter.com/en/docs/tweets/search/overview/premium" target="_blank">Twitter's Search API</a></li>
            <li><a class="info" href="https://www.ibm.com/watson/services/tone-analyzer/" target="_blank">IBM Watson AI Tone Analyzer</a></li>
            <li><a class="info" href="https://www.ibm.com/watson/services/personality-insights/" target="_blank">IBM Watson AI Personality Insights</a></li>
            <li><a class="info" href="https://d3js.org" target="_blank">D3 JavaScript Library</a></li>
        </ul>
        <p><span class="font-weight-bold">The Tweets matching the hashtag query are retrieved using Twitter’s Search APIs.</span> To read more about Twitter’s Search APIs, you can view the <a class="info" href="https://developer.twitter.com/en/docs/tweets/search/overview/premium" target="_blank">documentation.</a></p>
        <p><span class="font-weight-bold">The tone analysis is obtained using the IBM Watson AI Tone Analyzer service.</span> As detailed in the IBM Watson documentation, the “service uses linguistic analysis to detect emotional and language tones in written text.” The text from the Tweets is passed as an input to the Tone Analyzer, and the service analyzes the text for its perceived tone. You will see a chart displaying the tones detected in the Tweets, giving insight into the emotions of the Twitter users when posting Tweets including that hashtag. To read more about the IBM Watson AI Tone Analyzer, you can view the <a class="info" href="https://www.ibm.com/watson/services/tone-analyzer/" target="_blank">homepage</a> or the <a class="info" href="https://console.bluemix.net/docs/services/tone-analyzer/getting-started.html#gettingStarted" target="_blank">documentation.</a></p>
        <p><span class="font-weight-bold">The personality insights are obtained using the IBM Watson AI Personality Insights service.</span> As detailed in the IBM Watson documentation, “the service uses linguistic analytics to infer individuals' intrinsic personality characteristics from digital communications such as email, text messages, tweets, and forum posts.” The text from the Tweets is passed as an input to the Personality Insights service, and it analyzes the text for its perceived personality characteristics. You’ll see a range of personality data displayed in different formats when you search: a text personality summary, charts of personality characteristics including traits, values, and needs, and a list of consumption preferences. The personality results give insight into the personalities of the Twitter users posting with that hashtag. To read more about the IBM Watson AI Personality Insights service, you can view the <a class="info" href="https://www.ibm.com/watson/services/personality-insights/" target="_blank">homepage</a> or the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/getting-started.html#gettingStarted" target="_blank">documentation.</a></p>
        <p><span class="font-weight-bold">The graphs of the data are created using the D3 JavaScript Library.</span> To read more about the library, you can view the <a class="info" href="https://d3js.org" target="_blank">homepage</a> or the <a class="info" href="https://github.com/d3/d3/wiki" target="_blank">documentation.</a></p>
        <v-divider class="my-4"></v-divider>
        <h2 class="orange--text text--darken-1 display-1 font-weight-light mb-3">What can I do with the results?</h2>
        <p>Once you search for a hashtag, you can view the results as long as you’d like. However, leaving the results page will cause you to lose the data.</p>
        <p>If you have an account, you can <span class="font-weight-bold">bookmark the results</span> of your search to view them later. The bookmark saves the specific data obtained during that search specific to the time the search was completed. For example, if you searched for #TheVoice the day before and the day after a new episode of The Voice aired, the results will be different!</p>
        <p>In this case, you can also <span class="font-weight-bold">compare two sets of results.</span> If you bookmark two or more searches, you’ll have the option to view the bookmarked data again side-by-side. You can view results from the same hashtag searched at different times or two entirely different hashtags. This way, you can compare the tones and personalities across hashtags.</p>
        <p><span class="font-weight-bold">The list of your bookmarks can be found in your account settings.</span> From that list, you’ll be able to view the data of one of your bookmarks again, select two bookmarks to compare the data, or delete your bookmarks.</p>
        <v-divider class="my-4"></v-divider>
        <h2 class="amber--text text--darken-1 display-1 font-weight-light mb-3">Do I need an account?</h2>
        <p><span class="font-weight-bold">Nope!</span> You can search hashtags and view results freely without an account. However, if you want to bookmark or compare any of your results, you will need to <span class="font-weight-bold">create an account to save your data.</span></p>
        <v-divider class="my-4"></v-divider>
        <h2 class="orange--text text--lighten-3 display-1 font-weight-light mb-3">Who made this?</h2>
        <p class="mb-0"><span class="font-weight-bold">Alina Walling</span> made this for her final project in her Web Development course at Duke University. Check out more about her at her <a class="info" href="https://www.alinawalling.com" target="_blank">personal website</a>! I hear she’s pretty cool :)</p>
    </v-card-text>
</v-card>
</template>

<script>
export default {
    name: 'InfoDialog',
    props: ["closeDialog"]
}
</script>