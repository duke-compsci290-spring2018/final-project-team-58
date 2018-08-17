<template>
  <div id="app">
    <v-app>
      <v-toolbar absolute color="transparent" flat height="80px">
        <v-speed-dial v-if="currUser" v-model="userOptions" absolute bottom right direction="left" transition="slide-x-reverse-transition">
          <v-btn slot="activator" fab v-model="userOptions">
            <v-icon>account_circle</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn fab dark small color="pink lighten-2">
            <v-icon>bookmark</v-icon>
          </v-btn>
          <v-btn fab dark small color="purple darken-1">
            <v-icon>settings</v-icon>
          </v-btn>
          <v-btn fab dark small color="deep-purple darken-3" @click="signOut">
            <v-icon>power_settings_new</v-icon>
          </v-btn>
          <v-chip color="transparent" text-color="white">
            <h4 class="subheading">Hello, {{ currUser.name }} </h4>
          </v-chip>
        </v-speed-dial>
        <v-btn v-if="!currUser" round absolute right v-model="dialog" @click.stop="dialog = true">
          Sign In
        </v-btn>
      </v-toolbar>
      <v-layout row justify-center>
        <v-dialog v-if="!currUser" v-model="dialog" max-width="500px" lazy>
          <login-form :sign-in="signIn" :sign-up="signUp"></login-form>
        </v-dialog>
      </v-layout>
  
      <v-content v-if="!submitted">
        <search :submit-search="submitSearch"></search>
            <results></results>
      </v-content>
      <v-content v-if="submitted">
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import {
    toneAnalyzer,
    personalityInsights
  } from "./services/watsonAI"
  import {
    twitter
  } from "./services/twit"
  import {
    auth,
    database
  } from "./services/firebase"
  import Search from "./components/Search.vue"
  import Results from "./components/Results.vue"
  import LoginForm from "./components/LoginForm.vue"
  
  export default {
    name: 'App',
    components: {
      Search,
      Results,
      LoginForm
    },
  
    firebase: {
  
    },
  
    data() {
      return {
        dialog: false,
        userOptions: false,
        currUser: null,
        submitted: false,
        searchQuery: "",
        tweets: [],
        toneResults: {},
        personalityResults: {}
      }
    },
  
    mounted: function() {
      var app = this;
      auth.onAuthStateChanged(function(user) {
        if (user) {
          app.currUser = {};
          app.currUser.email = user.email;
          app.currUser.emailVerified = user.emailVerified;
          app.currUser.displayName = user.displayName;
          app.currUser.uid = user.uid;
        } else {
          app.currUser = null;
        }
      });
    },
  
    computed: {
      tweetParams() {
        return {
          q: this.searchQuery,
          count: 100,
          include_entities: false
        }
      }
    },
  
    methods: {
  
      signUp(name, email, password) {
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
          alert(error.message);
        });
      },
  
      signIn(email, password) {
        if (auth.currentUser) {
          auth.signOut();
        } else {
          auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            alert(error.message);
          });
          this.currUser = {};
          this.currUser.displayName = name;
        }
      },
  
      signOut() {
        if (auth.currentUser && confirm("Are you sure you want to sign out?")) {
          auth.signOut();
          app.currUser = null;
        }
      },
  
      submitSearch(q) {

        q = q.trim();
        if (q && q.length <= 140 && /^#\D\w*$/g.test(q)) {
          console.log("yay");
          //this.submitted = true;
          //this.searchTweets();
          //this.analyzeTone();
          //this.analyzePersonality();
        } else {
          //error
        }
      },
  
      searchTweets() {
  
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
  
      analyzeTone() {
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
  
      analyzePersonality() {
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
  #app {
    background: #de6161;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #2657eb, #de6161);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #2657eb, #de6161);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>
