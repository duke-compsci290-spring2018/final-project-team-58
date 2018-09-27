<template>
<v-container class="mb-3" fluid>
   <v-responsive height="250px">
        <v-container fill-height>
            <v-layout row align-center justify-center>
                <v-flex xs6 text-xs-center>
                    <h1 class="mb-4 display-3 font-weight-light text-xs-center white--text">
                        #{{ resultsA.hashtag }}
                    </h1>
                </v-flex>
                <v-flex xs6 text-xs-center>
                    <h1 class="mb-4 display-3 font-weight-light text-xs-center white--text">
                        #{{ resultsB.hashtag }}
                    </h1>
                </v-flex>
            </v-layout>
        </v-container>
    </v-responsive>

    <v-container fluid grid-list-lg>
        <v-layout row wrap mb-5>
                <v-flex xs6 class="purple--text text--lighten-4">
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">access_time</v-icon>
                        Searched on <span class="font-weight-bold">{{ resultsA.timestamp }}</span>
                    </p>
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">fas fa-twitter</v-icon>
                        <span class="font-weight-bold">{{ resultsA.numTweets }}</span> Tweets Analyzed
                    </p>
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">subject</v-icon>
                        <span class="font-weight-bold">{{ resultsA.numWords }}</span> Words Analyzed
                    </p>
                </v-flex>
                <v-flex xs6 class="purple--text text--lighten-4">
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">access_time</v-icon>
                        Searched on <span class="font-weight-bold">{{ resultsB.timestamp }}</span>
                    </p>
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">fas fa-twitter</v-icon>
                        <span class="font-weight-bold">{{ resultsB.numTweets }}</span> Tweets Analyzed
                    </p>
                    <p class="subheading">
                        <v-icon class="mr-2" color="purple lighten-5">subject</v-icon>
                        <span class="font-weight-bold">{{ resultsB.numWords }}</span> Words Analyzed
                    </p>
                </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Tones Analysis</h2>
            </v-flex>
            <v-flex xs12 md6 d-flex>
                <tone-chart v-cloak chartID="tones-A" :tones="resultsA.tones" :header="false"></tone-chart>
            </v-flex>
            <v-flex xs12 md6 d-flex>
                <tone-chart v-cloak chartID="tones-B" :tones="resultsB.tones" :header="false"></tone-chart>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Personality Summary</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-summary v-cloak :header="false" :text-summary="resultsA.summary"></personality-summary>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-summary v-cloak :header="false" :text-summary="resultsB.summary"></personality-summary>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Personality</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="personality-A" :traits="resultsA.traits" :header="false"></personality-chart>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="personality-B" :traits="resultsB.traits" :header="false"></personality-chart>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Needs</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="needs-A" :traits="resultsA.needs" :header="false"></personality-chart>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="needs-B" :traits="resultsB.needs" :header="false"></personality-chart>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Values</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="values-A" :traits="resultsA.values" :header="false"></personality-chart>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-chart v-cloak chartID="values-B" :traits="resultsB.values" :header="false"></personality-chart>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Users are likely to...</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="true" :behaviors="resultsA.likelyPrefs" :header="false"></personality-preferences>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="true" :behaviors="resultsB.likelyPrefs" :header="false"></personality-preferences>
            </v-flex>
        </v-layout>

        <v-layout row wrap mb-5>
            <v-flex xs12 class="text-xs-center">
                <h2 class="display-1 font-weight-light mb-3 white--text">Users are unlikely to...</h2>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="false" :behaviors="resultsA.unlikelyPrefs" :header="false"></personality-preferences>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
                <personality-preferences v-cloak :likely="false" :behaviors="resultsB.unlikelyPrefs" :header="false"></personality-preferences>
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
import ResultsSummary from "./ResultsSummary.vue"

export default {
    name: 'Compare',
    props: [
        "searchA",
        "searchB"
    ],
    components: {
        PersonalitySummary,
        PersonalityPreferences,
        PersonalityChart,
        ToneChart
    },

    data() {
        return {
            resultsA: {
                timestamp: this.searchA.timestamp,
                hashtag: this.searchA.hashtag,
                numTweets: this.searchA.numTweets,
                numWords: this.searchA.numWords,
                tones: this.searchA.tones,
                summary: this.searchA.summary,
                traits: this.searchA.traits,
                needs: this.searchA.needs,
                values: this.searchA.values,
                likelyPrefs: this.searchA.likelyPrefs,
                unlikelyPrefs: this.searchA.unlikelyPrefs
            },
            resultsB: {
                timestamp: this.searchB.timestamp,
                hashtag: this.searchB.hashtag,
                numTweets: this.searchB.numTweets,
                numWords: this.searchB.numWords,
                tones: this.searchB.tones,
                summary:this.searchB.summary,
                traits: this.searchB.traits,
                needs: this.searchB.needs,
                values: this.searchB.values,
                likelyPrefs: this.searchB.likelyPrefs,
                unlikelyPrefs: this.searchB.unlikelyPrefs
            }
        }
    }
}
</script>

<style>

</style>
