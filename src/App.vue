<template>
<div id="app">
    <v-app>

        <!-- message for displaying errors and notifications to the user -->
        <v-snackbar v-model="message.visible" top>
            {{ message.text }}
            <v-btn color="cyan" flat @click="message.visible = false">
                Close
            </v-btn>
        </v-snackbar>

        <!-- TOOLBAR -->
        <v-toolbar color="transparent" flat height="80px">

            <!-- back button arrow to go back to home page if on different page -->
            <v-btn fab small v-if="page != 'home'" @click="goTo('home')">
                <v-icon>arrow_back</v-icon>
            </v-btn>

            <!-- account settings speed dial button -->
            <v-speed-dial v-if="signedIn" v-model="userOptions" absolute bottom right direction="left" transition="slide-x-reverse-transition">
                <!-- activator button to open menu -->
                <v-btn slot="activator" fab small v-model="userOptions">
                    <v-icon>account_circle</v-icon>
                    <v-icon>close</v-icon>
                </v-btn>
                <!-- logout -->
                <v-btn fab dark small color="orange lighten-1" @click="logout">
                    <v-icon>power_settings_new</v-icon>
                </v-btn>
                <!-- account settings -->
                <v-btn fab dark small color="pink lighten-2" @click="goTo('account-settings')">
                    <v-icon>settings</v-icon>
                </v-btn>
                <!-- search history -->
                <v-btn fab dark small color="purple darken-1" @click="goTo('account-history')">
                    <v-icon>history</v-icon>
                </v-btn>
                <!-- bookmarks -->
                <v-btn fab dark small color="deep-purple darken-3" @click="goTo('account-bookmarks')">
                    <v-icon>bookmark</v-icon>
                </v-btn>
                <!-- user greeting -->
                <v-chip color="transparent" text-color="white">
                    <h4 class="subheading font-weight-medium">
                        Hello, {{ user.name }}!
                    </h4>
                </v-chip>
            </v-speed-dial>

            <!-- sign in button if user not logged in -->
            <v-btn v-if="!signedIn" round absolute right v-model="loginDialog" @click.stop="loginDialog = true">
                Sign In
            </v-btn>
        </v-toolbar>

        <!-- login pop up dialog component shows if sign in button pressed -->
        <v-layout row justify-center v-if="!signedIn">
            <v-dialog v-model="loginDialog" max-width="500px" lazy>
                <login-form :login="login" :register="register"></login-form>
            </v-dialog>
        </v-layout>

        <!-- MAIN APP CONTENT -->
        <v-content>
            <!-- search page with input and submit button -->
            <search v-if="page == 'home'" :submit-search="submitSearch" :display-message="displayMessage"></search>
            <!-- results page to display with data once search submitted -->
            <results v-cloak v-if="page == 'results'" :results="results" :is-bookmark="isBookmark" :bookmark-save="updateBookmark" :signed-in="signedIn" :download-j-s-o-n="exportData"></results>
            <!-- compare results page showing two results data sets side-by-side -->
            <compare v-cloak v-if="page == 'compare'" :search-a="toCompare[0]" :search-b="toCompare[1]"></compare>
            <!-- account settings page to view user info if logged in -->
            <account-settings v-if="goToAccountPage" :user="user" :curr-tab="page" :view-bookmark="viewBookmark" :compare-bookmarks="compareResults" :delete-bookmark="deleteBookmark" :delete-all-bookmarks="deleteAllBookmarks" :delete-history-item="deleteHistoryItem" :delete-all-history="deleteAllHistory" :update-profile="updateProfile" :update-password="updatePassword" :delete-account="deleteAccount" :set-page="setPage" :master-history="masterHistory" :delete-guest-history="deleteGuestHistory" :admin="userIsAdmin"></account-settings>
        </v-content>

        <!-- loading dialog displayed while search is submitting -->
        <v-dialog v-model="loading" hide-overlay persistent width="300" lazy>
            <v-card color="purple darken-4" dark>
                <v-card-text>
                    Searching Twitter for #{{ results.query }}...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- FOOTER -->
        <v-footer absolute color="transparent">
            <v-layout justify-space-between align-center row wrap white--text class="px-3">
                <v-flex xs6 sm3 text-xs-center text-sm-left>
                    <!-- information button to bring up about page dialog -->
                    <v-btn dark flat small class="ma-0 caption text-uppercase font-weight-bold spaced-letters" @click="infoDialog = true">
                        What is this about?
                    </v-btn>
                </v-flex>
                <!-- copyright information -->
                <v-flex xs6 sm3 text-xs-center text-sm-right class="caption text-uppercase font-weight-bold spaced-letters">
                    &copy; 2018 Alina Walling
                </v-flex>
            </v-layout>
        </v-footer>

        <!-- about page dialog -->
        <v-dialog v-model="infoDialog" scrollable max-width="700px">
            <info-dialog :close-dialog="closeInfoDialog"></info-dialog>
        </v-dialog>
    </v-app>
</div>
</template>

<script>
// import Vue
import Vue from "vue";

// import Firebase
import {
    firebase,
    auth,
    db
} from "./services/firebase";

// import URL to server backend accessing APIs
import {
    API_URL
} from './config';

// import components
import Search from "./components/Search.vue";
import Results from "./components/Results.vue";
import LoginForm from "./components/LoginForm.vue";
import AccountSettings from "./components/AccountSettings.vue";
import Compare from "./components/Compare.vue";
import InfoDialog from "./components/InfoDialog.vue";

export default {
    name: 'App',
    components: {
        Search,
        Results,
        LoginForm,
        AccountSettings,
        Compare,
        InfoDialog
    },

    firebase: {
        // key of the admin user
        admin: {
            source: db.ref("administrator"),
            asObject: true
        },
        // guest user search history
        guestHistory: db.ref("users/guest/history")
    },

    data() {
        return {
            page: "home", // current page displayed on app
            message: { // message text for displaying errors and notifications to user
                visible: false,
                text: ""
            },
            username: "", // name of the user when registering for an account saved later to Firebase
            signedIn: false, // true when user logged in
            userOptions: false, // true when the user options speed-dial menu is open
            loginDialog: false, // true when user sign in popup dialog is showing
            infoDialog: false, // true when about page popup dialog is showing
            searchQuery: "", // search text typed into search input
            loading: false, // true when search submitted and loading dialog is showing
            results: {}, // stores the results about the search grabbed from the APIs
            isBookmark: false, // true when the results being displayed are bookmarked
            toCompare: [] // two results data sets displayed on compare page
        };
    },

    // run this function upon creation of the app
    created: function () {
        var app = this;

        // check if Firebase user authentication state has changed (user logged in or out)
        auth.onAuthStateChanged(function (user) {
            // if a user is signed in
            if (user) {
                app.signedIn = true;
                // save the information of the user stored in firebase database in the app
                db.ref().once("value").then(function (snapshot) {
                    // if the user is new and does not exist in the firebase database (new user)
                    // save their information from the authentication in the database
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
                // create firebase binding to user in database
                app.$bindAsObject("user", db.ref("users/" + user.uid));
                // create firebase binding to user's bookmarks in database
                app.$bindAsArray("bookmarks", db.ref("users/" + user.uid + "/bookmarks"));
                // create firebase binding to user's search history in database
                app.$bindAsArray("history", db.ref("users/" + user.uid + "/history"));

                // read the current page of the app the user is viewing
                db.ref("users/" + user.uid + "/page").once("value").then(function (snapshot) {
                    // set the app page to that value
                    if (snapshot.val()) {
                        app.page = snapshot.val();
                    } else {
                        // set app page to home if no value
                        app.page = "home";
                    }
                });

                // read the current results the user is viewing (if on a results page)
                db.ref("users/" + user.uid + "/currentResults").once("value").then(function (snapshot) {
                    // set the app results object to the value
                    if (snapshot.val()) {
                        app.results = snapshot.val();
                        app.isBookmark = snapshot.val().isBookmark;
                    } else {
                        // reset the app results if no value
                        app.resetResults();
                    }
                });

                // read the current set of comparing results the user is viewing (if on compare page)
                db.ref("users/" + user.uid + "/currentCompare").once("value").then(function (snapshot) {
                    // set the app compare to the value
                    if (snapshot.val()) {
                        app.toCompare = snapshot.val();
                    } else {
                        // reset the app results if no value
                        app.resetCompare();
                    }
                });

                // if no user is signed in
            } else {
                app.signedIn = false;
                app.username = "";
                // unbind the user information, bookmarks, and search history objects from firebase
                if (app.user && app.bookmarks && app.history) {
                    app.$unbind("user");
                    app.$unbind("bookmarks");
                    app.$unbind("history");
                }
            }
        });
    },

    computed: {

        // check if the results object is completely populated with results information
        // used to test whether or not the search and API requests were completed and data saved
        // before displaying results page
        checkResults() {
            var r = this.results;
            if (r != null) {
                if (r.numTweets && r.numWords && r.query && r.tweets && r.tones && r.personality) {
                    return true;
                }
            }
            return false;
        },

        // check if the page is currently on an account viewing page
        // return true if user is viewing bookmarks, search history, master search history, or settings
        goToAccountPage() {
            if (this.page == "account-bookmarks" || this.page == "account-history" || this.page == "account-master-history" || this.page == "account-settings") {
                return true;
            }
            return false;
        },

        // check if the current logged in user is the admin
        userIsAdmin() {
            if (this.signedIn && this.user != null && this.admin != null) {
                console.log("user key: " + this.user[".key"]);
                console.log("admin object: " + this.admin);
                console.log("admin value: " + this.admin[".value"]);
                if (this.user[".key"] == this.admin[".value"]) {
                    console.log("user is admin");
                    return true;
                }
                console.log("user is NOT admin");
                return false;
            }

        },

        // generates the master search history of all user accounts and guest account
        // list of master search history is viewable by the admin account
        masterHistory() {
            var master = [];

            // check if user is admin
            if (this.userIsAdmin) {
                // grab all the user info from firebase database
                db.ref("users").once("value").then(function (snapshot) {
                    var val = snapshot.val();
                    if (val) {
                        // get the search history of all users and add it to universal array
                        for (var u in val) {
                            if (val[u].hasOwnProperty("history")) {
                                for (var item in val[u].history) {
                                    master.push({
                                        user: val[u].name,
                                        name: val[u].history[item].name,
                                        timestamp: val[u].history[item].timestamp
                                    });
                                }
                            }
                        }
                    }
                });
            }

            // return universal array
            return master;
        }
    },

    watch: {
        // watch for when the results object changes and info is populated or deleted
        results() {
            // if the results are complete and the page is not viewing the results
            if (this.checkResults && this.page != "results") {
                // add the results as a search history item
                this.addHistoryItem(this.results);
                // display results page
                this.displayResults();
            }
        }
    },

    methods: {

        /* ------------------------------
         * WEB NAVIGATION
         * ------------------------------ */

        // run when user makes request to go to a new page
        // check to confirm if a user wants to leave a sensitive info page
        goTo(newPage) {

            // confirm to leave results page
            if (this.page == "results") {
                // warn a signed in user about bookmarking the results
                if (this.signedIn) {
                    if (confirm("Are you sure you want to leave this page? You will lose the results unless you bookmark them.")) {
                        this.setPage(newPage);
                        this.resetResults();
                    }
                } else {
                    if (confirm("Are you sure you want to leave this page?")) {
                        this.setPage(newPage);
                        this.resetResults();
                    }
                }
            }
            // confirm to leave compare page
            else if (this.page == "compare") {
                if (confirm("Are you sure you want to leave this page?")) {
                    this.setPage(newPage);
                    this.resetCompare();
                }
            }
            // if not a sensitive data page just go to new page
            else {
                this.setPage(newPage);
            }
        },

        // set the page of the app to the new page
        setPage(newPage) {
            this.page = newPage;
            // save the new page as the current page in a user's firebase database
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/page").set(this.page);
            }
        },

        // display a temporary message for the user at the top of the page
        // for error messages or general notifications
        displayMessage(text) {
            this.message.text = text;
            this.message.visible = true;
        },

        // hide the about page dialog
        closeInfoDialog() {
            this.infoDialog = false;
        },

        /* ------------------------------
         * MANAGING USERS
         * ------------------------------ */

        // register a new user
        register(name, email, password) {
            this.username = name;
            // save user in firebase authentication
            auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
                alert(error.message);
            });
        },

        // log in an existing user
        login(email, password) {
            // if there's a current user logged in, sign them out 
            // (this would only occur in the case of an error)
            if (auth.currentUser) {
                auth.signOut();
            } else {
                // sign the user in with firebase authentication
                auth.signInWithEmailAndPassword(email, password).catch(function (error) {
                    alert(error.message);
                });
            }
        },

        // log out a signed in user
        logout() {
            // check a user is logged in and confirm the sign out
            if (auth.currentUser && confirm("Are you sure you want to log out?")) {
                this.setPage("home");
                auth.signOut();
            }
        },

        // update a user's profile (name, email) information
        updateProfile(name, email, password) {
            var app = this;

            // update the user name
            if (name != this.user.name) {
                // change the display name in firebase
                auth.currentUser.updateProfile({
                    displayName: name
                }).then(function () {
                    // save name in app username
                    app.username = name;
                    // update the user name in the firebase database
                    var copy = app.user;
                    delete copy[".key"];
                    copy.name = name;
                    app.$firebaseRefs.user.set(copy);
                    // display a confirmation message
                    app.displayMessage("Profile saved.");
                }).catch(function (error) {
                    // display error message
                    app.displayMessage("Unable to save profile changes.");
                    console.log(error);
                });
            }

            // update the user email
            if (email != this.user.email) {
                // if the user also entered their password
                if (password) {
                    // create a credential with the user's entered email and password
                    const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, password);
                    // authenticate the user (to confirm they are themselves requesting info change)
                    auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        // update email in firebase auth
                        auth.currentUser.updateEmail(email).then(function () {
                            // update email in firebase database
                            var copy = app.user;
                            delete copy[".key"];
                            copy.email = email;
                            app.$firebaseRefs.user.set(copy);
                            // display confirmation message
                            app.displayMessage("Profile saved.");
                        }).catch(function (error) {
                            // display error message about saving new email
                            app.displayMessage("Unable to save profile changes.");
                            console.log(error);
                        });
                    }).catch(function (error) {
                        // display error message about reauthenticating user
                        console.log(error);
                        app.displayMessage("Unable to reauthenticate account credentials.");
                        // An error happened.
                    });
                } else {
                    // prompt user to enter password in addition to email for changing email address
                    this.displayMessage("Please enter your password before changing your email address.");
                }
            }
        },

        // update a user's password
        updatePassword(oldPassword, newPassword) {
            var app = this;
            // create a credential with user's email and old password
            const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, oldPassword);
            // reauthenticate the user (to confirm they are themselves requesting info change)
            auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                // update password in firebase auth
                auth.currentUser.updatePassword(newPassword).then(function () {
                    // display confirmation message
                    app.displayMessage("Password successfully updated.");
                }).catch(function (error) {
                    // display error message about saving password
                    console.log(error);
                    app.displayMessage("Unable to update password.");
                });
            }).catch(function (error) {
                // display error message about reauthenticating user
                console.log(error);
                app.displayMessage("Unable to reauthenticate account credentials.");
            });
        },

        // delete a user's account
        deleteAccount(email, password) {
            var app = this;
            var userID = this.user[".key"];

            // confirm with user about deleting account
            if (confirm("Are you sure you want to delete your account? This cannot be undone!")) {
                if (confirm("Are you SUPER SURE you want to delete your account? This is your last chance to change your mind.")) {

                    // create credential with email and password
                    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                    // reauthenticate user credentials
                    auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        // reset app to reflect no user signed in
                        app.setPage("home");
                        app.signedIn = false;
                        app.username = "";
                        if (app.user && app.bookmarks && app.history) {
                            app.$unbind("user");
                            app.$unbind("bookmarks");
                            app.$unbind("history");
                        }
                        // remove user from firebase database
                        db.ref("users/" + userID).remove();
                        // sign out of firebase auth
                        auth.signOut();
                        // delete the user from firebase auth
                        auth.currentUser.delete().then(function () {
                            // display confirmation message about account deletion
                            app.displayMessage("Account successfully deleted.");
                        }).catch(function (error) {
                            // display error message about account deletion
                            console.log(error);
                            app.displayMessage("Unable to delete account.");
                        });
                    }).catch(function (error) {
                        // prompt user to enter email and password before deleting account
                        console.log(error);
                        app.displayMessage("Please make sure you've entered your current email address and password to reauthenticate before deleting.");
                    });
                }
            }
        },

        /* ------------------------------
         * SUBMIT SEARCH
         * ------------------------------ */

        // submit the search query
        // run when "submit" button next to search input is pressed
        submitSearch(q) {
            var app = this;
            // set the search id in the results object to the current time in milliseconds
            Vue.set(app.results, "id", Date.now());
            // set the search query in the results object to the inputted text
            Vue.set(app.results, "query", q);
            // show the loading dialog
            this.loading = true;
            // search for Tweets with the search query via the Twitter API
            this.searchTweets();
        },

        // analyze the Tweets retrieved from search query with Watson AI
        // run Tone Analyzer and Personality Insights
        analyzeSearch() {
            var toneSuccess = false;
            var personalitySuccess = false;

            // verify there are Tweets saved in the results object
            if (this.results.tweets) {

                // create the text passed to Watson Tone Analyzer from the Tweets
                var toneText = this.createToneText();
                // if successfully created text parameter
                if (toneText) {
                    // analyze the tone of the Tweet text
                    this.analyzeTone(toneText);
                    toneSuccess = true;
                } else {
                    // display error message if no text
                    console.log("Unable to make tone text from Tweets.");
                    this.displayMessage("Unable to analyze tone.");
                }

                // create the text passed to Watson Personality Insights from the Tweets
                var personalityText = this.createPersonalityText();
                // if successfully created the text parameter
                if (personalityText.contentItems.length) {
                    // analyze the personality of the Tweet text
                    this.analyzePersonality(personalityText);
                    personalitySuccess = true;
                } else {
                    // display error message if no text
                    console.log("Unable to make personality text from the Tweets.");
                    this.displayMessage("Unable to analyze personality.");
                }
            } else {
                // display error message if no Tweets in results
                console.log("No tweets in results.");
                this.displayMessage("Unable to search Tweets.");
            }
            // if tone and personality analysis failed reset the results
            if (!toneSuccess && !personalitySuccess) {
                this.displayResults("Search failed.");
                this.resetResults();
            }
            // hide loading dialog
            this.loading = false;
        },

        /* ------------------------------
         * DISPLAY RESULTS
         * ------------------------------ */

        // save and display the search results
        displayResults() {
            // if a user is signed in save the current results page in user firebase database
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/currentResults").set(this.results);
                db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
            }
            // set loading dialog to false (should only still be showing in case of an error)
            this.loading = false;
            // set the page to the results
            this.setPage("results");
        },

        // reset the search results
        // run when leaving results page or the search failed
        resetResults() {
            // if a user is signed in remove results from their current results in firebase database
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/currentResults").remove();
            }
            // set the bookmark and results object to empty
            this.isBookmark = false;
            this.results = {};
        },

        // export the results data as JSON data
        exportData() {
            var app = this;
            // open JSON in a new window
            var myWindow = window.open("/data", "Results JSON");
            myWindow.document.write(JSON.stringify(app.results));
        },

        /* ------------------------------
         * DISPLAY BOOKMARKED RESULTS
         * ------------------------------ */

        // view the results of a user's bookmarked search accessed from their account info
        // pass in the bookmarked results information as a parameter
        viewBookmark(item) {
            // set the app results to the bookmarked data
            this.results = item;
            this.isBookmark = true;
            // set the page to the results
            this.setPage("results");

            // save the displaying results to the user's current results in firebase database
            // remove the ".key" attribute from firebase vue bindings to write object to firebase database
            let save = Object.assign({}, this.results);
            delete save[".key"];
            db.ref("users/" + this.user[".key"] + "/currentResults").set(save);
            db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
        },

        /* ------------------------------
         * COMPARE RESULTS
         * ------------------------------ */

        // view two sets of bookmarked results side-by-side in compare view
        // pass in the two bookmarked results information as a parameter
        compareResults(bookmarks) {
            // set the app compare array to the bookmarked data
            this.toCompare = bookmarks;

            // save the displaying results to the user's current compare in firebase database
            // remove the ".key" attribute from firebase vue bindings to write object to firebase database
            if (this.user) {
                let save1 = Object.assign({}, this.toCompare[0]);
                delete save1[".key"];
                let save2 = Object.assign({}, this.toCompare[1]);
                delete save2[".key"];
                var saveCompare = [save1, save2];
                db.ref("users/" + this.user[".key"] + "/currentCompare").set(saveCompare);
            }

            // set the app page to the compare page
            this.setPage("compare");
        },

        // reset the compared results
        // run when leaving the compare page
        resetCompare() {
            // reset user's current compare in firebase database
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/currentCompare").remove();
            }
            // reset app compare array
            this.toCompare = [];
        },

        /* ------------------------------
         * SEARCH TWEETS
         * ------------------------------ */

        // submit the search query to Twitter API and retreive Tweet data
        searchTweets() {
            var app = this;

            // save the search query as a parameter for Twitter API request
            var query = {
                "query": "#" + app.results.query
            };

            //console.log(query);

            // fetch Tweets from server
            fetch(`${API_URL}/tweets`, {
                    method: 'POST',
                    body: JSON.stringify(query),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                // retrieve the JSON of the results from the API
                .then(response => response.json())
                // use the JSON data
                .then(data => {
                    //console.log(data);
                    var tweets = data.results;

                    // set the number of Tweets in results object to number of Tweets retrieved
                    Vue.set(app.results, "numTweets", tweets.length);
                    // set the Tweets array in results object to empty array
                    Vue.set(app.results, "tweets", []);
                    // for each Tweet in the results...
                    for (var i = 0; i < tweets.length; i++) {
                        // parse out only relevant data of each Tweet and save in results object array
                        app.results.tweets.push(app.parseTweetObject(tweets[i]));
                    }

                    //console.log(app.results.tweets);

                    // analyze Tweet data
                    app.analyzeSearch();
                })
                // catch an error with the request
                .catch(error => {
                    // display error message
                    console.log(error);
                    app.displayMessage("Error searching for Tweets.");
                });
        },

        // parse out only necessary data for each Tweet object
        parseTweetObject(tweet) {
            var t = {};
            // save the timestamp, id, and text from each Tweet
            // don't worry about information about the Twitter user, location, etc.
            t.timestamp = tweet.created_at;
            t.id = tweet.id_str;
            t.text = tweet.text;
            // return parsed Tweet object
            return t;
        },

        /* ------------------------------
         * TONE ANALYZER
         * ------------------------------ */

        // format the text passed to Tone Analyzer from the Tweets
        createToneText() {
            var text = "";
            // save the text from each Tweet into a large body of text
            for (var i = 0; i < this.results.tweets.length; i++) {
                text += ". " + this.results.tweets[i].text;
            }
            //console.log(text);

            // return aggregate Tweet text
            return text;
        },

        // analyze the tone using the Watson AI Tone Analyzer API
        analyzeTone(text) {
            var app = this;
            // set the text input parameter to the text created from Tweets
            var tone_input = {
                text: text
            };

            // fetch tone analysis from server
            fetch(`${API_URL}/tones`, {
                    method: 'POST',
                    body: JSON.stringify(tone_input),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                // retrieve the JSON of the API results
                .then(response => response.json())
                // use the JSON data
                .then(data => {
                    //console.log(data);

                    // set the app results object tones to the tones found in the data
                    Vue.set(app.results, "tones", data.document_tone.tones);
                })
                // catch an error in analyzing tone
                .catch(error => {
                    // display error message
                    console.log(error);
                    app.displayMessage("Error in analyzing tone.");
                });
        },

        /* ------------------------------
         * PERSONALITY INSIGHTS
         * ------------------------------ */

        // format the text passed to Personality Insights from the Tweets
        createPersonalityText() {
            var app = this;
            var content = {
                contentItems: []
            };

            // save the text from each Tweet in the required Personality Insights format
            for (var i = 0; i < this.results.tweets.length; i++) {
                var item = {
                    content: app.results.tweets[i].text,
                    contenttype: "text/plain",
                    id: app.results.tweets[i].id,
                    language: "en"
                };
                content.contentItems.push(item);
            }
            //console.log(content);

            // return the formated text object
            return content;
        },

        // analyze the personality using the Watson AI Personality Insights API
        analyzePersonality(content) {
            var app = this;

            // fetch the personality profile from the server
            fetch(`${API_URL}/personality`, {
                    method: 'POST',
                    body: JSON.stringify(content),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                // retrieve the results JSON
                .then(response => response.json())
                // use the JSON data
                .then(data => {
                    //console.log(data);

                    // set the app results object personality to the data
                    Vue.set(app.results, "personality", data);
                    // set the app results object number of words analyzed to word count from data
                    Vue.set(app.results, "numWords", data.word_count);
                })
                // catch an error
                .catch(error => {
                    // display error message
                    console.log(error);
                    app.displayMessage("Error in analyzing personality.");
                });
        },

        /* ------------------------------
         * MANAGE BOOKMARKS
         * ------------------------------ */

        // manage whether to add or delete a bookmark
        updateBookmark(save, bookmark) {
            if (save && bookmark) {
                this.isBookmark = save;
                this.addBookmark(bookmark);
            } else {
                this.deleteBookmark(bookmark);
            }
        },

        // bookmark the results
        addBookmark(item) {
            var num = this.bookmarks.length;
            // add the new results to the user's bookmarks in the firebase database
            this.$firebaseRefs.bookmarks.push(item);
            // set the app results to the bookmarked results
            this.results = this.bookmarks[num];
            // save the current results and bookmark in the user's firebase database
            db.ref("users/" + this.user[".key"] + "/currentResults").set(item);
            db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
        },

        // delete a bookmark
        deleteBookmark(item) {
            // confirm deletion
            if (confirm("Are you sure you want to delete this bookmark?")) {
                // remove bookmark from user's firebase database
                this.$firebaseRefs.bookmarks.child(item['.key']).remove();
                // set bookmark to false
                this.isBookmark = false;
                db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
            }
        },

        // delete all the user's saved bookmarks
        deleteAllBookmarks() {
            // confirm deletion
            if (confirm("Are you sure you want to delete all of your bookmarks?")) {
                // remove the bookmarks from the user's firebase database
                this.$firebaseRefs.bookmarks.remove();
            }
        },

        /* ------------------------------
         * MANAGE SEARCH HISTORY
         * ------------------------------ */

        // add a search to the user's search history
        addHistoryItem() {
            var app = this;
            var date = new Date(this.results.id);
            // if a user is signed in
            if (this.signedIn) {
                // add information about the search to their individual search history
                this.$firebaseRefs.history.push({
                    name: app.results.query,
                    timestamp: date.toLocaleString()
                });
            }
            // if no user signed in...
            else {
                // add information about the search to guest user search history
                this.$firebaseRefs.guestHistory.push({
                    name: app.results.query,
                    timestamp: date.toLocaleString()
                });
            }
        },

        // delete an item from user's search history
        deleteHistoryItem(item) {
            // confirm deletion
            if (confirm("Are you sure you want to delete this search from your history?")) {
                // remove search history item from user's firebase database
                this.$firebaseRefs.history.child(item['.key']).remove();
            }
        },

        // delete all the user's search history
        deleteAllHistory() {
            // confirm deletion
            if (confirm("Are you sure you want to clear your search history?")) {
                // remove user's search history from firebase database
                this.$firebaseRefs.history.remove();
            }
        },

        // delete all the guest user's search history
        // can only be done by admin
        deleteGuestHistory() {
            // confirm deletion
            if (confirm("Are you sure you want to clear the guest search history?")) {
                // remove the guest search history from the firebase database
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

[v-cloak] {
    display: none;
}

a.info {
    text-decoration: none;
    font-weight: 700;
    color: #8E24AA !important;
    transition: 1s;
    background-color: transparent !important;
}

a.info:hover {
    color: #F06292 !important;
}
</style>
