<template>
  <div id="app">

  </div>
</template>

<script>

import { toneAnalyzer, personalityInsights } from "./services/watsonAI"
import { twitter } from "./services/twit"

export default {
  name: 'App',
  components: {

  },

  data () {
    return {
      searchQuery: "",
      tweets: [],
      toneResults: {},
      personalityResults: {}
    }
  },

  mounted: function () {

  },

  computed: {
    tweetParams () {
      return {
        q: this.searchQuery,
        count: 100,
        include_entities: false
      } 
    }
  },

  methods: {

    searchTweets () {

      twitter.get("search/tweets", this.tweetParams, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          var statuses = response.statuses;
          console.log(statuses);
          // keep id string, text, place, time
          // params are query, count 100, include_entities false
        }
      })
    },

    analyzeTone () {
      var app = this;

      var params = {
        //utterances: app.tweets
      };

      toneAnalyzer.toneChat(params, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
          //app.toneResults = response;
        }
      })
    },

    analyzePersonality () {
      var app = this;

      var params = {

      };

      personalityInsights.profile(params, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      })
    }


  }
}
</script>

<style>

</style>
