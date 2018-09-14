<template>
<div id="app">
    <v-app>
        <v-snackbar v-model="message.visible" top>
            {{ message.text }}
            <v-btn color="cyan" flat @click="message.visible = false">
                Close
            </v-btn>
        </v-snackbar>
        <v-toolbar color="transparent" flat height="80px">

            <v-btn fab small v-if="page != 'home'" @click="goTo('home')">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-speed-dial v-if="signedIn" v-model="userOptions" absolute bottom right direction="left" transition="slide-x-reverse-transition">
                <v-btn slot="activator" fab small v-model="userOptions">
                    <v-icon>account_circle</v-icon>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-btn fab dark small color="orange lighten-1" @click="logout">
                    <v-icon>power_settings_new</v-icon>
                </v-btn>
                <v-btn fab dark small color="pink lighten-2" @click="goTo('account-settings')">
                    <v-icon>settings</v-icon>
                </v-btn>
                <v-btn fab dark small color="purple darken-1" @click="goTo('account-history')">
                    <v-icon>history</v-icon>
                </v-btn>
                <v-btn fab dark small color="deep-purple darken-3" @click="goTo('account-bookmarks')">
                    <v-icon>bookmark</v-icon>
                </v-btn>
                <v-chip color="transparent" text-color="white">
                    <h4 class="subheading font-weight-medium">
                        Hello, {{ user.name }}!
                    </h4>
                </v-chip>
            </v-speed-dial>
            <v-btn v-if="!signedIn" round absolute right v-model="loginDialog" @click.stop="loginDialog = true">
                Sign In
            </v-btn>
        </v-toolbar>
        <v-layout row justify-center v-if="!signedIn">
            <v-dialog v-model="loginDialog" max-width="500px" lazy>
                <login-form :login="login" :register="register"></login-form>
            </v-dialog>
        </v-layout>

        <v-content>
            <search v-if="page == 'home'" :submit-search="submitSearch" :display-message="displayMessage"></search>
            <results v-if="page == 'results'" :results="results" :is-bookmark="isBookmark" :bookmark-save="updateBookmark" :signed-in="signedIn"></results>
            <compare v-if="page == 'compare'" :search-a="toCompare[0]" :search-b="toCompare[1]"></compare>
            <account-settings v-if="goToAccountPage" :user="user" :curr-tab="page" :view-bookmark="viewBookmark" :compare-bookmarks="compareResults" :delete-bookmark="deleteBookmark" :delete-all-bookmarks="deleteAllBookmarks" :delete-history-item="deleteHistoryItem" :delete-all-history="deleteAllHistory" :update-profile="updateProfile" :update-password="updatePassword" :delete-account="deleteAccount" :set-page="setPage" :master-history="masterHistory" :delete-guest-history="deleteGuestHistory" :admin="admin['.value']"></account-settings>
        </v-content>
        <!--<v-footer dark height="auto">
            <v-card flat tile class="indigo lighten-1 white--text text-xs-center">
                <v-card-text>

                </v-card-text>

                <v-card-text class="white--text pt-0">
                    Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et
                    faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient
                    montes, nascetur ridiculus mus.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-text class="white--text">
                    &copy;2018 <strong>Alina Walling</strong>
                </v-card-text>
            </v-card>
        </v-footer>-->
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
} from "./services/twitter"
import {
    firebase,
    auth,
    db
} from "./services/firebase"

import {
    request,
    twitterSearchAuth,
    twitterSearchConfig
} from "./services/yeet"

import Search from "./components/Search.vue"
import Results from "./components/Results.vue"
import LoginForm from "./components/LoginForm.vue"
import AccountSettings from "./components/AccountSettings.vue"
import Compare from "./components/Compare.vue"

import t1 from "./assets/data/tone-test-1.json"
import t2 from "./assets/data/tone-test-2.json"
import t3 from "./assets/data/tone-test-3.json"
import t4 from "./assets/data/tone-test-4.json"

import p1 from "./assets/data/personality-test-1.json"
import p2 from "./assets/data/personality-test-2.json"
import p3 from "./assets/data/personality-test-3.json"
import p4 from "./assets/data/personality-test-4.json"

export default {
    name: 'App',
    components: {
        Search,
        Results,
        LoginForm,
        AccountSettings,
        Compare
    },

    firebase: {
        /*page: {
            source: db.ref("page"),
            asObject: true
        },*/
        admin: {
            source: db.ref("administrator"),
            asObject: true
        },
        guest: {
            source: db.ref("users/guest"),
            asObject: true
        },
        guestHistory: db.ref("users/guest/history")
    },

    data () {
        return {
            message: {
                visible: false,
                text: ""
            },
            page: "home",
            username: "",
            signedIn: false,
            userOptions: false,
            loginDialog: false,
            searchQuery: "",
            submitted: false,
            results: {},
            isBookmark: false,
            toCompare: [],
            toneTests: [t1, t2, t3, t4],
            personalityTests: [p1, p2, p3, p4]
        }
    },

    created: function () {
        var app = this;
        auth.onAuthStateChanged(function (user) {
            if (user) {
                app.signedIn = true;
                db.ref().once("value").then(function (snapshot) {
                    if (!snapshot.hasChild("users/" + user.uid)) {
                        db.ref("users/" + user.uid).set({
                            name: app.username,
                            email: user.email,
                            bookmarks: [],
                            history: [],
                            page: app.page
                        });
                    }
                });
                app.$bindAsObject("user", db.ref("users/" + user.uid));
                app.$bindAsArray("bookmarks", db.ref("users/" + user.uid + "/bookmarks"));
                app.$bindAsArray("history", db.ref("users/" + user.uid + "/history"));

                db.ref("users/" + user.uid + "/page").once("value").then(function (snapshot) {
                    if (snapshot.val()) {
                        app.page = snapshot.val();
                    } else {
                        app.page = "home";
                    }
                });

                db.ref("users/" + user.uid + "/currentResults").once("value").then(function (snapshot) {
                    if (snapshot.val()) {
                        app.results = snapshot.val();
                        app.isBookmark = snapshot.val().isBookmark;
                    } else {
                        app.resetResults();
                    }
                });

                db.ref("users/" + user.uid + "/currentCompare").once("value").then(function (snapshot) {
                    if (snapshot.val()) {
                        app.toCompare = snapshot.val();
                    } else {
                        app.resetCompare();
                    }
                });

            } else {
                app.signedIn = false;
                app.username = "";
                if (app.user && app.bookmarks && app.history) {
                    app.$unbind("user");
                    app.$unbind("bookmarks");
                    app.$unbind("history");
                }
            }
        });

    },

    computed: {

        goToAccountPage() {
            if (this.page == "account-bookmarks" || this.page == "account-history" || this.page == "account-master-history" || this.page == "account-settings") {
                return true;
            }
            return false;
        },

        masterHistory() {
            var master = [];
            if (this.signedIn && this.user != null) {
                if (this.user[".key"] == this.admin[".value"]) {
                    db.ref("users").once("value").then(function (snapshot) {
                        var val = snapshot.val();
                        if (val) {
                            for (var u in val) {
                                if (val[u].hasOwnProperty("history")) {
                                    for (var item in val[u]["history"]) {
                                        master.push({
                                            user: val[u]["name"],
                                            name: val[u]["history"][item]["name"],
                                            timestamp: val[u]["history"][item]["timestamp"]
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            };
            return master;
        }
    },

    methods: {

        /* ------------------------------
         * WEB NAVIGATION
         * ------------------------------ */

        goTo(newPage) {

            if (this.page == "results") {
                if (this.signedIn) {
                    if (confirm("Are you sure you want to leave this page? You will lose the results unless you bookmark them.")) {
                        this.setPage(newPage);
                        this.resetResults();
                    }
                } else {
                    this.setPage(newPage);
                    this.resetResults();
                }
            } else if (this.page == "compare") {
                if (confirm("Are you sure you want to leave this page?")) {
                    this.setPage(newPage);
                    this.resetCompare();
                }
            } else {
                this.setPage(newPage);
            }
        },

        setPage(newPage) {
            this.page = newPage;
            if (this.user) {

                db.ref("users/" + this.user[".key"] + "/page").set(this.page);
            }
        },

        displayMessage(text) {
            this.message.text = text;
            this.message.visible = true;
        },

        /* ------------------------------
         * USERS
         * ------------------------------ */

        register(name, email, password) {
            this.username = name;
            auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
                alert(error.message);
            });
        },

        login(email, password) {
            if (auth.currentUser) {
                auth.signOut();
            } else {
                auth.signInWithEmailAndPassword(email, password).catch(function (error) {
                    alert(error.message);
                });
            }
        },

        logout() {
            if (auth.currentUser && confirm("Are you sure you want to log out?")) {
                this.setPage("home");
                auth.signOut();
            }
        },

        updateProfile(name, email, password) {
            var app = this;
            if (name != this.user.name) {
                auth.currentUser.updateProfile({
                    displayName: name
                }).then(function () {
                    app.username = name;

                    var copy = app.user;
                    delete copy[".key"];
                    copy.name = name;
                    app.$firebaseRefs.user.set(copy);

                    app.displayMessage("Profile saved.");
                }).catch(function (error) {
                    app.displayMessage("Unable to save profile changes.");
                    console.log(error);
                });
            }

            if (email != this.user.email) {
                if (password) {
                    const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, password);
                    auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        auth.currentUser.updateEmail(email).then(function () {

                            var copy = app.user;
                            delete copy[".key"];
                            copy.email = email;
                            app.$firebaseRefs.user.set(copy);

                            app.displayMessage("Profile saved.");
                        }).catch(function (error) {
                            app.displayMessage("Unable to save profile changes.");
                            console.log(error);
                            // An error happened.
                        });
                    }).catch(function (error) {
                        console.log(error);
                        app.displayMessage("Unable to reauthenticate account credentials.")
                        // An error happened.
                    });
                } else {
                    this.displayMessage("Please enter your password before changing your email address.")
                }
            }

        },

        updatePassword(oldPassword, newPassword) {
            var app = this;

            const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, oldPassword);
            auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                auth.currentUser.updatePassword(newPassword).then(function () {
                    app.displayMessage("Password successfully updated.")
                }).catch(function (error) {
                    console.log(error);
                    app.displayMessage("Unable to update password.")
                });

            }).catch(function (error) {
                console.log(error);
                app.displayMessage("Unable to reauthenticate account credentials.")
                // An error happened.
            });

        },

        deleteAccount(email, password) {
            var app = this;
            var userID = this.user[".key"];
            if (confirm("Are you sure you want to delete your account? This cannot be undone!")) {
                if (confirm("Are you SUPER SURE you want to delete your account? This is your last chance to change your mind.")) {
                    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                    auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        app.setPage("home");
                        app.signedIn = false;
                        app.username = "";
                        if (app.user && app.bookmarks && app.history) {
                            app.$unbind("user");
                            app.$unbind("bookmarks");
                            app.$unbind("history");
                        }
                        db.ref("users/" + userID).remove();
                        auth.signOut();
                        auth.currentUser.delete().then(function () {
                            app.displayMessage("Account successfully deleted.");
                        }).catch(function (error) {
                            console.log(error);
                            app.displayMessage("Unable to delete account.");
                        });
                    }).catch(function (error) {
                        console.log(error);
                        app.displayMessage("Please make sure you've entered your current email address and password to reauthenticate before deleting.")
                        // An error happened.
                    });
                }
            }

        },

        /* ------------------------------
         * PERFORM A SEARCH
         * ------------------------------ */

        submitSearch(q) {

            this.submitted = true;

            this.results.id = Date.now(),
                this.results.query = q;
            this.searchTweets();
            //this.results.numTweets = 0;

            /* if (q == "one") {
                 this.results.tones = this.toneTests[0];
                 this.results.personality = this.personalityTests[0];
             } else if (q == "two") {
                 this.results.tones = this.toneTests[1];
                 this.results.personality = this.personalityTests[1];
             } else if (q == "three") {
                 this.results.tones = this.toneTests[2];
                 this.results.personality = this.personalityTests[2];
             } else if (q == "four") {
                 this.results.tones = this.toneTests[3];
                 this.results.personality = this.personalityTests[3];
             } else {
                 this.displayMessage("Problem.");
                 this.resetResults();
                 return;
             }

             this.addHistoryItem(this.results);
             this.displayResults();*/
            /*
                        if (this.searchTweets()) {
                            if (this.analyzeTone()) {
                                if (this.analyzePersonality()) {
                                    this.addHistoryItem(this.results);
                                    this.displayResults();
                                    return;
                                } else {
                                    this.displayMessage("Unable to analyze personality.");
                                }
                            } else {
                                this.displayMessage("Unable to analyze tone.");
                            }
                        } else {
                            this.displayMessage("Unable to search Tweets.");
                        }

                        this.resetResults();*/
        },

        /* ------------------------------
         * DISPLAY RESULTS
         * ------------------------------ */

        displayResults() {
            if (this.user) {

                db.ref("users/" + this.user[".key"] + "/currentResults").set(this.results);
                db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
            }
            this.setPage("results");
        },

        resetResults() {
            if (this.user) {

                db.ref("users/" + this.user[".key"] + "/currentResults").remove();
            }
            this.submitted = false;
            this.isBookmark = false;

            this.results = {
                id: null,
                query: "",
                numTweets: 0,
                numWords: 0,
                tweets: [],
                tones: {},
                personality: {}
            }
        },

        resetCompare() {
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/currentCompare").remove();
            }
            this.toCompare = [];
        },

        viewBookmark(item) {
            this.results = item;
            this.isBookmark = true;
            this.submitted = true;
            this.setPage("results");

            let save = Object.assign({}, this.results);
            delete save[".key"];

            db.ref("users/" + this.user[".key"] + "/currentResults").set(save);
            db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
        },

        compareResults(bookmarks) {
            this.toCompare = bookmarks;
            this.submitted = true;

            if (this.user) {

                let save1 = Object.assign({}, this.toCompare[0]);
                delete save1[".key"];

                let save2 = Object.assign({}, this.toCompare[1]);
                delete save2[".key"];

                var saveCompare = [save1, save2];
                db.ref("users/" + this.user[".key"] + "/currentCompare").set(saveCompare);
            }
            this.setPage("compare");
        },

        /* ------------------------------
         * SEARCH TWEETS
         * ------------------------------ */

        searchTweets() {
            var app = this;
            var query = {
                "query": "#" + app.results.query
            }

            var requestOptions = {
                url: "https://" + twitterSearchConfig["url"] + twitterSearchConfig["env"] + ".json",
                oauth: twitterSearchAuth,
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: query,
                withCredentials: false
                
            }

            request.post(requestOptions, function (error, response, body) {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(body);
            })

            /*
                        var app = this;

                        twitter.get("tweets/search/fullarchive/dev", {
                            query: this.results.query,
                            maxResults: 500
                        }, function (error, data, response) {
                            if (error) {
                                console.log(error);
                                return false;
                            } else {
                                console.log(data);
                                var tweets = data.results;

                                app.results.numTweets = tweets.length;

                                for (var i = 0; i < tweets.length; i++) {
                                    app.results.tweets.push(parseTweetObject(tweets[i]));
                                };

                                return true;

                                // keep id string, text, place, time
                                // params are query, count 100, include_entities false
                            }
                        });

                        return false;*/
        },

        parseTweetObject(tweet) {
            var t = {};

            t.timestamp = tweet["created_at"];
            t.id = tweet["id_str"];
            t.text = tweet["text"];

            return t;

        },

        /* ------------------------------
         * TONE ANALYZER
         * ------------------------------ */

        createToneText() {
            var text;

            for (var i = 0; i < this.results.tweets.length; i++) {
                text += ". " + tweets[i].text;
            }

            return text;
        },

        analyzeTone() {
            var app = this;

            var toneParams = {
                tone_input: {
                    text: app.createToneText()
                },
                content_type: "application/json",
                sentences: false
            };

            toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
                if (error) {
                    console.log(error);
                    return false;
                } else {
                    app.results.tones = toneAnalysis;
                    return true;
                }
            });

            return false;
        },

        /* ------------------------------
         * PERSONALITY INSIGHTS
         * ------------------------------ */

        createPersonalityText() {

            var content = {
                contentItems: []
            };

            for (var i = 0; i < this.results.tweets.length; i++) {

                var item = {
                    content: tweets[i].text,
                    contenttype: "text/plain",
                    id: tweets[i].id,
                    langauge: "en"
                };

                content.contentItems.push(item);
            }

            return content;

        },

        analyzePersonality() {
            var app = this;

            var personalityParams = {
                content: app.createPersonalityText(),
                content_type: "application/json",
                consumption_preferences: true
            };

            personalityInsights.profile(personalityParams, function (error, profile) {
                if (error) {
                    console.log(error);
                    return false;
                } else {
                    app.results.personality = profile;
                    return true;
                }
            });

            return false;
        },

        /* ------------------------------
         * BOOKMARKS
         * ------------------------------ */

        updateBookmark(save, bookmark) {
            if (save && bookmark) {
                this.isBookmark = save;
                this.addBookmark(bookmark);
            } else {
                this.deleteBookmark(bookmark);
            }
        },

        addBookmark(item) {
            var num = this.bookmarks.length;
            this.$firebaseRefs.bookmarks.push(item);
            this.results = this.bookmarks[num];
            db.ref("users/" + this.user[".key"] + "/currentResults").set(item);
            db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
        },

        deleteBookmark(item) {
            if (confirm("Are you sure you want to delete this bookmark?")) {
                this.$firebaseRefs.bookmarks.child(item['.key']).remove();
                this.isBookmark = false;
                db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
            }
        },

        deleteAllBookmarks() {
            if (confirm("Are you sure you want to delete all of your bookmarks?")) {
                this.$firebaseRefs.bookmarks.remove();
            }
        },

        /* ------------------------------
         * SEARCH HISTORY
         * ------------------------------ */

        addHistoryItem() {
            var app = this;
            var date = new Date(this.results.id);
            if (this.signedIn) {
                this.$firebaseRefs.history.push({
                    name: app.results.query,
                    timestamp: date.toLocaleString()
                });
            } else {
                this.$firebaseRefs.guestHistory.push({
                    name: app.results.query,
                    timestamp: date.toLocaleString()
                });
            }
        },

        deleteHistoryItem(item) {
            if (confirm("Are you sure you want to delete this search from your history?")) {
                this.$firebaseRefs.history.child(item['.key']).remove();
            }
        },

        deleteAllHistory() {
            if (confirm("Are you sure you want to clear your search history?")) {
                this.$firebaseRefs.history.remove();
            }
        },

        deleteGuestHistory() {
            if (confirm("Are you sure you want to clear the guest search history?")) {
                this.$firebaseRefs.guestHistory.remove();
            }
        }

    }
}
</script>

<style>
#app {
    background: #3A1C71;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #FFAF7B, #D76D77, #3A1C71);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #FFAF7B, #D76D77, #3A1C71);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
