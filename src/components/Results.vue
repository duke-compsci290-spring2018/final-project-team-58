<!-- Results Page -->
<template>
<v-container class="mb-3" fluid>

    <!-- HEADER -->
    <v-responsive>
        <v-container fill-height>
            <v-layout row wrap align-center justify-center>
                <!-- hashtag header -->
                <v-flex xs12 text-xs-center>
                    <h1 class="mb-4 display-3 font-weight-light text-xs-center white--text">
                        #{{ hashtag }}
                    </h1>
                </v-flex>
                <!-- results summary info -->
                <v-flex sm6 class="purple--text text--lighten-4">
                    <p class="subheading">
                        <!-- date searched -->
                        <v-icon class="mr-2" color="purple lighten-5">access_time</v-icon>
                        Searched on <span class="font-weight-bold">{{ timestamp }}</span>
                    </p>
                    <p class="subheading">
                        <!-- number of tweets analyzed -->
                        <v-icon class="mr-2" color="purple lighten-5">fab fa-twitter</v-icon>
                        <span class="font-weight-bold">{{ numTweets }}</span> Tweets Analyzed
                    </p>
                    <p class="subheading">
                        <!-- number of words analyzed -->
                        <v-icon class="mr-2" color="purple lighten-5">subject</v-icon>
                        <span class="font-weight-bold">{{ numWords }}</span> Words Analyzed
                    </p>
                </v-flex>
                <v-flex sm3 class="text-xs-center">
                    <v-layout d-flex column>
                        <!-- export data button -->
                        <v-flex>
                            <v-btn fab color="purple darken-1" :large="!signedIn" @click="downloadJSON">
                                <v-icon color="white" :large="!signedIn">save_alt</v-icon>
                            </v-btn>
                        </v-flex>
                        <!-- bookmark results button -->
                        <v-flex>
                            <v-btn fab @click="updateBookmark" color="pink lighten-2" v-if="signedIn">
                                <v-icon v-if="!bookmarked" color="white">bookmark_border</v-icon>
                                <v-icon v-if="bookmarked" color="white">bookmark</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-responsive>

    <!-- RESULTS GRID -->
    <v-container fluid grid-list-lg>
        <v-layout row wrap>
            <!-- tone chart -->
            <v-flex xs12 xl6 d-flex>
                <tone-chart v-cloak chartID="tones" :tones="tones" :header="true"></tone-chart>
            </v-flex>
            <!-- personality text summary -->
            <v-flex xs12 sm6 md12 xl6 d-flex>
                <personality-summary v-cloak :header="true" :text-summary="summary"></personality-summary>
            </v-flex>
            <!-- personality traits chart -->
            <v-flex xs12 sm6 md4 d-flex>
                <personality-chart v-cloak chartID="personality" :traits="traits" :header="true"></personality-chart>
            </v-flex>
            <!-- personality needs chart -->
            <v-flex xs12 sm6 md4 d-flex>
                <personality-chart v-cloak chartID="needs" :traits="needs" :header="true"></personality-chart>
            </v-flex>
            <!-- personality values chart -->
            <v-flex xs12 sm6 md4 d-flex>
                <personality-chart v-cloak chartID="values" :traits="values" :header="true"></personality-chart>
            </v-flex>
            <!-- personality likely preferences -->
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="true" :behaviors="likelyPrefs" :header="true"></personality-preferences>
            </v-flex>
            <!-- personality unlikely preferences -->
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="false" :behaviors="unlikelyPrefs" :header="true"></personality-preferences>
            </v-flex>
        </v-layout>
    </v-container>
</v-container>
</template>

<script>
import PersonalitySummary from "./PersonalitySummary.vue"
import PersonalityPreferences from "./PersonalityPreferences.vue"
import PersonalityChart from "./PersonalityChart.vue"
import ToneChart from "./ToneChart.vue"

// require personality text summary generator
var PersonalityTextSummaries = require('personality-text-summary');
// define new personality text summary generator
var v3EnglishTextSummaries = new PersonalityTextSummaries({
    locale: 'en',
    version: 'v3'
});

export default {
    name: 'Results',
    props: [
        "signedIn",         // true if user is signed in (for displaying bookmark function)
        "results",          // results object
        "isBookmark",       // true if displaying a bookmark and not a new search
        "bookmarkSave",     // update bookmark for this search
        "downloadJSON"      // export the JSON data
    ],
    components: {
        PersonalitySummary,
        PersonalityPreferences,
        PersonalityChart,
        ToneChart
    },

    data() {
        return {
            bookmarked: false,
            hashtag: "",
            timestamp: "",
            numTweets: 0,
            numWords: 0,
            tones: [],
            summary: "",
            traits: [],
            needs: [],
            values: [],
            prefs: [],
            likelyPrefs: [],
            unlikelyPrefs: []
        }
    },

    created: function () {
        // set the data in the component from the results object property
        this.setData();
    },

    methods: {

        // set the component data from the results object property based on if bookmark
        setData() {
            this.numTweets = this.results.numTweets;
            this.numWords = this.results.numWords;
            this.tones = this.results.tones;

            if (this.isBookmark) {
                this.bookmarked = true;
                this.hashtag = this.results.hashtag;
                this.timestamp = this.results.timestamp;
                this.summary = this.results.summary;
                this.traits = this.results.traits;
                this.needs = this.results.needs;
                this.values = this.results.values;
                this.likelyPrefs = this.results.likelyPrefs;
                this.unlikelyPrefs = this.results.unlikelyPrefs;
            } else {
                var date = new Date(this.results.id);
                this.hashtag = this.results.query;
                this.timestamp = date.toLocaleString();
                this.summary = v3EnglishTextSummaries.getSummary(this.results.personality);
                this.traits = this.results.personality["personality"];
                this.needs = this.results.personality["needs"];
                this.values = this.results.personality["values"];
                this.prefs = this.results.personality["consumption_preferences"];

                // sort the consumption preferences
                this.sortPreferences();
            }

        },

        // sorts the consumption preferences into likely and unlikely
        sortPreferences() {
            // for each preference in the personality profile
            for (var i = 0; i < this.prefs.length; i++) {
                if (this.prefs[i].hasOwnProperty("consumption_preferences")) {
                    var subPrefs = this.prefs[i]["consumption_preferences"];
                    for (var j = 0; j < subPrefs.length; j++) {
                        // prefs with a score of 0 are unlikely
                        if (subPrefs[j].score === 0) {
                            this.unlikelyPrefs.push(subPrefs[j]);
                        } 
                        // prefs with a score of 1 are likely
                        else if (subPrefs[j].score === 1) {
                            this.likelyPrefs.push(subPrefs[j]);
                        }
                    }
                }
            }
        },

        // update the bookmark for this search
        updateBookmark() {
            this.bookmarked = !this.bookmarked;
            var toSave;
            // save all the results data from this search in an easier, more concise format
            // exclude the extra data from the results object that isn't needed when saving
            if (this.bookmarked) {
                toSave = {
                    id: this.results.id,
                    timestamp: this.timestamp,
                    hashtag: this.hashtag,
                    numTweets: this.numTweets,
                    numWords: this.numWords,
                    tones: this.tones,
                    summary: this.summary,
                    traits: this.traits,
                    needs: this.needs,
                    values: this.values,
                    likelyPrefs: this.likelyPrefs,
                    unlikelyPrefs: this.unlikelyPrefs
                }
            } else {
                toSave = this.results;
            }
            // pass the bookmark info to the app to save
            this.bookmarkSave(this.bookmarked, toSave);
        }
    }
}
</script>