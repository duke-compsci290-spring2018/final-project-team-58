<template>
<v-container>
    <v-jumbotron>
        <v-container fill-height>
      <v-layout row wrap align-center justify-center>
        <v-flex xs12 text-xs-center>
          <h3 class="display-3">{{ searchQuery }} heck</h3>
        </v-flex>
        <v-flex sm4>
            <v-card color="transparent" flat>
                      <v-card-text>
                          <v-icon>access_time</v-icon>
                          Searched on
                          <br>
                          <v-icon>fas fa-twitter</v-icon>
                          Tweets Analyzed
                  <br>
                  Strength of Data Analysis
                      </v-card-text>
                  
            </v-card>
        </v-flex>
        <v-flex sm4>
                  <v-card color="transparent" flat>
                      <v-card-text>
                          Number of Tweets Analyzed:
                  <br>
                  Strength of Data Analysis:
                      </v-card-text>
                  
                  </v-card>
        </v-flex>

          <v-btn round>
            <v-icon left size="20">bookmark_border</v-icon>
            Save Search
              </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    </v-jumbotron>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 md6>
                <tone-chart :tones="tones"></tone-chart>
            </v-flex>
            <v-flex xs12 md6>
                <results-summary></results-summary>
            </v-flex>
            <v-flex xs12 sm6 md4 d-flex>
                <personality-summary></personality-summary>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-layout row wrap>
                    <v-flex xs12>
                        <personality-preferences :likely="true" :behaviors="likelyTo"></personality-preferences>
                    </v-flex>
                    <v-flex xs12>
                        <personality-preferences :likely="false" :behaviors="unlikelyTo"></personality-preferences>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm4>
                <personality-chart chartID="personality" :traits="personality"></personality-chart>
            </v-flex>
            <v-flex xs12 sm4>
                <personality-chart chartID="needs" :traits="needs"></personality-chart>
            </v-flex>
            <v-flex xs12 sm4>
                <personality-chart chartID="values" :traits="values"></personality-chart>
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
      import traits from "./../assets/data/personality-test.json"
      import tones from "./../assets/data/tone-test.json"
      import ResultsSummary from "./ResultsSummary.vue"

    export default {
        name: 'Results',
        props: [
            //"personalityResults"
            "searchQuery"
        ],
        components: {
            PersonalitySummary,
            PersonalityPreferences,
            PersonalityChart,
            ToneChart,
            ResultsSummary
        },

        data () {
            return {
                toneResults: tones,
                personalityResults: traits,
                likelyTo: [],
                unlikelyTo: []
            }
        },

        created: function () {
            this.sortPreferences();
        },

        computed: {

            tones () {
                return this.toneResults["document_tone"]["tones"];
            },

            personality () {
                return this.personalityResults["personality"];
            },

            needs () {
                return this.personalityResults["needs"];
            },

            values () {
                return this.personalityResults["values"];
            },

            preferences () {
                return this.personalityResults["consumption_preferences"];
            }

        },
    
        methods: {
            sortPreferences () {
                for (var i = 0; i < this.preferences.length; i++) {
                    if (this.preferences[i].hasOwnProperty("consumption_preferences")) {
                        var subPrefs = this.preferences[i]["consumption_preferences"];
                        for (var j = 0; j < subPrefs.length; j++) {
                            if (subPrefs[j].score === 0) {
                                this.unlikelyTo.push(subPrefs[j]);
                            } else if (subPrefs[j].score === 1) {
                                this.likelyTo.push(subPrefs[j]);
                            }
                        }
                    }  
                }
            }
        }
    }
</script>

<style>
    
</style>
