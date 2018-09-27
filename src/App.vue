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
            <results v-cloak v-if="page == 'results'" :results="results" :is-bookmark="isBookmark" :bookmark-save="updateBookmark" :signed-in="signedIn" :download-j-s-o-n="exportData"></results>
            <compare v-cloak v-if="page == 'compare'" :search-a="toCompare[0]" :search-b="toCompare[1]"></compare>
            <account-settings v-if="goToAccountPage" :user="user" :curr-tab="page" :view-bookmark="viewBookmark" :compare-bookmarks="compareResults" :delete-bookmark="deleteBookmark" :delete-all-bookmarks="deleteAllBookmarks" :delete-history-item="deleteHistoryItem" :delete-all-history="deleteAllHistory" :update-profile="updateProfile" :update-password="updatePassword" :delete-account="deleteAccount" :set-page="setPage" :master-history="masterHistory" :delete-guest-history="deleteGuestHistory" :admin="admin['.value']"></account-settings>
        </v-content>
        <v-dialog v-model="loading" hide-overlay persistent width="300" lazy>
            <v-card color="purple darken-4" dark>
                <v-card-text>
                    Searching Twitter for #{{ results.query }}...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
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
        <v-footer absolute color="transparent">
            <v-layout justify-space-between align-center row wrap white--text class="px-3">
                <v-flex xs6 sm3 text-xs-center text-sm-left>
                    <v-btn dark flat small class="ma-0 caption text-uppercase font-weight-bold spaced-letters" @click="infoDialog = true">What is this about?</v-btn>
                </v-flex>
                <v-flex xs6 sm3 text-xs-center text-sm-right class="caption text-uppercase font-weight-bold spaced-letters">
                    &copy; 2018 Alina Walling</v-flex>
            </v-layout>
        </v-footer>
        <v-dialog v-model="infoDialog" scrollable max-width="700px">
            <info-dialog :close-dialog="closeInfoDialog"></info-dialog>
        </v-dialog>
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
/*
import {
    request,
    twitterSearchAuth,
    twitterSearchConfig
} from "./services/yeet"*/

import Search from "./components/Search.vue"
import Results from "./components/Results.vue"
import LoginForm from "./components/LoginForm.vue"
import AccountSettings from "./components/AccountSettings.vue"
import Compare from "./components/Compare.vue"
import InfoDialog from "./components/InfoDialog.vue"

import t1 from "./assets/data/tone-test-1.json"
import t2 from "./assets/data/tone-test-2.json"
import t3 from "./assets/data/tone-test-3.json"
import t4 from "./assets/data/tone-test-4.json"

import p1 from "./assets/data/personality-test-1.json"
import p2 from "./assets/data/personality-test-2.json"
import p3 from "./assets/data/personality-test-3.json"
import p4 from "./assets/data/personality-test-4.json"

import tweets from "./assets/data/tweets"

import {
    API_URL
} from './config'

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

    data() {
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
            infoDialog: false,
            searchQuery: "",
            loading: false,
            results: {},
            foundTweets: false,
            isBookmark: false,
            toCompare: [],
            toneTests: [t1, t2, t3, t4],
            personalityTests: [p1, p2, p3, p4],
            testingTweets: [{
                "timestamp": "Fri Sep 14 23:27:12 +0000 2018",
                "id": "1040743798471569410",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 23:27:07 +0000 2018",
                "id": "1040743778523312128",
                "text": "RT @KarenJDon: You didn't get a rose....says the APS to the majority of psychologists and our clients  https://t.co/85Sy5YhJym ….  HELP US…"
            }, {
                "timestamp": "Fri Sep 14 23:24:02 +0000 2018",
                "id": "1040743001310416896",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 23:19:24 +0000 2018",
                "id": "1040741835017211904",
                "text": "Jordan for Bachelor!!!!! #thebachelor #BachelorInParadise"
            }, {
                "timestamp": "Fri Sep 14 23:12:34 +0000 2018",
                "id": "1040740116178853888",
                "text": "'The Bachelor' Host Chris Harrison Admits Colton Underwood Was Picked As ABC's Leading Man For 'The Best TV'.… https://t.co/DHrRc4KGOR"
            }, {
                "timestamp": "Fri Sep 14 23:03:18 +0000 2018",
                "id": "1040737784145891328",
                "text": "We let out a sigh of relief when it was announced #TheBachelor isn’t airing until January 7th, but don’t worry… https://t.co/G93a1n37xU"
            }, {
                "timestamp": "Fri Sep 14 22:50:00 +0000 2018",
                "id": "1040734438416502785",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 22:48:45 +0000 2018",
                "id": "1040734124212936704",
                "text": "I despise Football and Country music &amp; not fond of dogs..I think I'll pass on auditioning for this seasons Bachelor… https://t.co/jIkZfoEEXm"
            }, {
                "timestamp": "Fri Sep 14 22:45:23 +0000 2018",
                "id": "1040733274862243840",
                "text": "RT @BachelorABC: Vote for #TheBachelor for #TheCompetitionShow of 2018 at the #PCAs by retweeting this post! @peopleschoice https://t.co/7B…"
            }, {
                "timestamp": "Fri Sep 14 22:42:12 +0000 2018",
                "id": "1040732474727383040",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 22:38:38 +0000 2018",
                "id": "1040731575476875264",
                "text": "I take back all of my positive Kamil posts!!! He is the WORST. #bye #bacheloreinparadise #teamAnnaliese #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 22:38:05 +0000 2018",
                "id": "1040731437064970240",
                "text": "The women of #TheBachelor scrubbing their social media before filming starts. https://t.co/xGb3ytLH8x"
            }, {
                "timestamp": "Fri Sep 14 22:32:09 +0000 2018",
                "id": "1040729944584683520",
                "text": "😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡😡  #TheBachelor https://t.co/Ggd24kxQmi"
            }, {
                "timestamp": "Fri Sep 14 22:27:20 +0000 2018",
                "id": "1040728731340496896",
                "text": "It's Friiiiii-yay! #Y100rewind\n\n1) Alllllll #TheBachelor news this week including @AmabileJoe on #DWTS!\n2) Our Bra… https://t.co/JF1uMTR6PP"
            }, {
                "timestamp": "Fri Sep 14 22:24:14 +0000 2018",
                "id": "1040727951992606721",
                "text": "@balockaye_h Both of you guys were class acts throughout #TheBachelorette. Hope we see more of you at some point in… https://t.co/WRl57qHpaT"
            }, {
                "timestamp": "Fri Sep 14 22:14:46 +0000 2018",
                "id": "1040725572421386240",
                "text": "@fleissmeister Everyone CHILL. I didn’t want it to be Colton either but you know they won’t change it. I’ve accepte… https://t.co/kOavzITrhR"
            }, {
                "timestamp": "Fri Sep 14 22:13:52 +0000 2018",
                "id": "1040725344263782400",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 22:13:44 +0000 2018",
                "id": "1040725310050844672",
                "text": "RT @astrid_loch: The prince of paradise has become a king. Congratulations @Colt3FIVE 👑🌹#BachelorInParadise #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 22:13:09 +0000 2018",
                "id": "1040725162486849541",
                "text": "RT @bachbrack: If Tia so much as sets a foot on #TheBachelor set, so help me god...."
            }, {
                "timestamp": "Fri Sep 14 22:12:12 +0000 2018",
                "id": "1040724927047970816",
                "text": "RT @kevin_c_wendt: @Colt3FIVE will be an amazing bachelor 🌹 he’s kind, vulnerable and compassionate.. and he looks great in a suit. Let’s a…"
            }, {
                "timestamp": "Fri Sep 14 22:11:09 +0000 2018",
                "id": "1040724659623342080",
                "text": "RT @carolynbdavis: Colton was pressured the second he went on #BachelorInParadise to date Tia, got sent home by Becca because of Tia, &amp; the…"
            }, {
                "timestamp": "Fri Sep 14 22:10:23 +0000 2018",
                "id": "1040724466215669761",
                "text": "RT @Bachelor_Nation: Who was totally rooting for Tia &amp; Colton this season... but is also REALLY EXCITED to watch coltonunderwood as our nex…"
            }, {
                "timestamp": "Fri Sep 14 22:04:17 +0000 2018",
                "id": "1040722932840972288",
                "text": "RT @JustinaCoronel: Tia coming out of the limo on the first night now that Colton is #TheBachelor https://t.co/rkyc92G3Ew"
            }, {
                "timestamp": "Fri Sep 14 22:02:10 +0000 2018",
                "id": "1040722398654488576",
                "text": "Still convinced the whole Colton thing is a hoax and @Jason_Tartick is going to come out as #TheBachelor during the… https://t.co/WYQYYHCkZH"
            }, {
                "timestamp": "Fri Sep 14 22:01:46 +0000 2018",
                "id": "1040722300629331969",
                "text": "Is it too soon to get excited for #BachelorWinterGames ?? @chrisbharrison @Millsy11374 @fleissmeister… https://t.co/6xdQIF7eoN"
            }, {
                "timestamp": "Fri Sep 14 22:00:40 +0000 2018",
                "id": "1040722022832074752",
                "text": "My prediction for this season: Colton WILL get engaged... for 7 years before he actually marries her. #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 21:54:38 +0000 2018",
                "id": "1040720504146063360",
                "text": "This is Jason Tartick when he was 9 years old! He is with his dog, Mindy. \n(Photo is from his Instagram page.)… https://t.co/6rxTX89e1u"
            }, {
                "timestamp": "Fri Sep 14 21:51:39 +0000 2018",
                "id": "1040719755177426944",
                "text": "Im not sure how I feel about Colton being the new bachelor 🤔 #thebachelor"
            }, {
                "timestamp": "Fri Sep 14 21:44:45 +0000 2018",
                "id": "1040718017464885248",
                "text": "RT @alybarnaba: ABC: who do you want to be the next bachelor?\nus: JASON! BLAKE! JOE!\nABC: guess who’s back! Colton!\nus:\n#TheBachelor https:…"
            }, {
                "timestamp": "Fri Sep 14 21:44:42 +0000 2018",
                "id": "1040718004168712192",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 21:25:02 +0000 2018",
                "id": "1040713054348967936",
                "text": "@Peino Big Brother wouldn’t be the same without her. For the sake of the houseguests, I hope she stays! Or maybe it… https://t.co/Z6TfOYZpmz"
            }, {
                "timestamp": "Fri Sep 14 21:04:05 +0000 2018",
                "id": "1040707781647491072",
                "text": "#TheBachelor Colton Underwood reportedly willing &amp; \"very likely\" to lose his virginity on @BachelorABC: Colton Unde… https://t.co/uZcRQWfYJj"
            }, {
                "timestamp": "Fri Sep 14 20:56:57 +0000 2018",
                "id": "1040705987106222082",
                "text": "I can’t believe Amy - @RHAPRecapper said that #BachelorInParadise didn’t need two bartenders. Umm, did anything tha… https://t.co/q4yUlticT0"
            }, {
                "timestamp": "Fri Sep 14 20:56:32 +0000 2018",
                "id": "1040705881342500865",
                "text": "RT @KarenJDon: You didn't get a rose....says the APS to the majority of psychologists and our clients  https://t.co/85Sy5YhJym ….  HELP US…"
            }, {
                "timestamp": "Fri Sep 14 20:51:11 +0000 2018",
                "id": "1040704538032799744",
                "text": "@CObrochta33 @BachelorABC @colton Oh it's confirmed! My dog is wearing this night one 🌹#firstimpressionrose… https://t.co/ftU4p8jJuP"
            }, {
                "timestamp": "Fri Sep 14 20:49:00 +0000 2018",
                "id": "1040703987140501506",
                "text": "#TheBachelor Colton Underwood reportedly willing &amp; \"very likely\" to lose his virginity on @BachelorABC https://t.co/lWF2U1jJJ4"
            }, {
                "timestamp": "Fri Sep 14 20:48:01 +0000 2018",
                "id": "1040703737638150150",
                "text": "@fleissmeister wouldn't be surprised if Colton came out on after the final rose #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 20:38:29 +0000 2018",
                "id": "1040701340270374912",
                "text": "Chris is on damage control...this season is gonna be dumb. If Tia shows up then I swear...I'm gonna lose my FREAKIN… https://t.co/s7M9tclPy1"
            }, {
                "timestamp": "Fri Sep 14 20:38:05 +0000 2018",
                "id": "1040701239149912064",
                "text": "RT @isabelchandoit: #justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/ubpromhWf1"
            }, {
                "timestamp": "Fri Sep 14 20:34:47 +0000 2018",
                "id": "1040700409961213952",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 20:28:00 +0000 2018",
                "id": "1040698700706795522",
                "text": "I don’t know about yall, but I’d rather have someone we are confident wants these things *before* choosing them to… https://t.co/0HXy7YJD6L"
            }, {
                "timestamp": "Fri Sep 14 20:19:52 +0000 2018",
                "id": "1040696655543197701",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 20:17:39 +0000 2018",
                "id": "1040696099495976962",
                "text": "RT @fleissmeister: So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 20:17:28 +0000 2018",
                "id": "1040696051533983744",
                "text": "So excited for next week!!! Let the journey begin... #TheBachelor"
            }, {
                "timestamp": "Fri Sep 14 20:09:32 +0000 2018",
                "id": "1040694054193848321",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 20:08:17 +0000 2018",
                "id": "1040693741273661440",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 19:58:27 +0000 2018",
                "id": "1040691264327507970",
                "text": "Can someone plz tell me how this whole Colton being a virgin and Bachelor is going to work come fantasy suite time.… https://t.co/B3j74VHx7Y"
            }, {
                "timestamp": "Fri Sep 14 19:57:58 +0000 2018",
                "id": "1040691142294036480",
                "text": "Excited is an understatement 😍🤤🔥🌹 #TheBachelor @colton @BachelorABC https://t.co/Gvlakfs4xF"
            }, {
                "timestamp": "Fri Sep 14 19:27:39 +0000 2018",
                "id": "1040683514956529669",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 19:21:00 +0000 2018",
                "id": "1040681842528210949",
                "text": "How are those background checks coming for the ladies of the Haus of Underwood? #TheBachelor #BachelorNation https://t.co/SLoAhKnKdG"
            }, {
                "timestamp": "Fri Sep 14 19:07:00 +0000 2018",
                "id": "1040678319488819200",
                "text": "#TheBachelor Colton is down to lose his virginity on TV. \n\nhttps://t.co/BHQ8ZiiUot https://t.co/ENkaXne01B"
            }, {
                "timestamp": "Fri Sep 14 19:03:33 +0000 2018",
                "id": "1040677450391400448",
                "text": "RT @isabelchandoit: #justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/YD4uLAYPIM"
            }, {
                "timestamp": "Fri Sep 14 19:02:56 +0000 2018",
                "id": "1040677293830615040",
                "text": "RT @RealityRose_: TO ALL THE BOYS I LOVED BEFORE AND WANTED FOR #TheBachelor https://t.co/9NWt87SK2N"
            }, {
                "timestamp": "Fri Sep 14 18:47:35 +0000 2018",
                "id": "1040673432130740224",
                "text": "RT @SmithBruerAdv: Still think that TV can't be educational? Our marketing intern, Katie is here to prove you otherwise and justify your #T…"
            }, {
                "timestamp": "Fri Sep 14 18:46:15 +0000 2018",
                "id": "1040673095265267712",
                "text": "RT @SmithBruerAdv: Still think that TV can't be educational? Our marketing intern, Katie is here to prove you otherwise and justify your #T…"
            }, {
                "timestamp": "Fri Sep 14 18:44:22 +0000 2018",
                "id": "1040672621468295168",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 18:44:16 +0000 2018",
                "id": "1040672596428288000",
                "text": "Is Co-Bachelor’s a thing? #thebachelor"
            }, {
                "timestamp": "Fri Sep 14 18:44:15 +0000 2018",
                "id": "1040672594326740992",
                "text": "RT @danidONAT0: So I guess I won’t be watching #TheBachelor either... https://t.co/PVarq5mNtn"
            }, {
                "timestamp": "Fri Sep 14 18:41:14 +0000 2018",
                "id": "1040671833899585536",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 18:36:01 +0000 2018",
                "id": "1040670519912226816",
                "text": "RT @Bachelor__Bob: This is truly spectacular. Thanks @ravengates!! #TheBachelorette #TheBachelor #BachelorNation @balockaye_h @Jason_Tartic…"
            }, {
                "timestamp": "Fri Sep 14 18:34:00 +0000 2018",
                "id": "1040670013038854144",
                "text": "RT @bachelorburnbk: IF 👏  GROCERY 👏 STORE 👏 JOE 👏 IS 👏 SINGLE 👏 WHY 👏 ISN'T 👏 HE 👏 #TheBachelor 👏 #BachelorInParadise"
            }, {
                "timestamp": "Fri Sep 14 18:33:08 +0000 2018",
                "id": "1040669796373807105",
                "text": "RT @15mefarber: Last year: Give us Peter. \n\nBachelor franchise: Okay! How about some guy you dont even remember?\n\nThis year: Give us Wills,…"
            }, {
                "timestamp": "Fri Sep 14 18:11:17 +0000 2018",
                "id": "1040664296303325185",
                "text": "RT @BachelorABC: Vote for #TheBachelor for #TheCompetitionShow of 2018 at the #PCAs by retweeting this post! @peopleschoice https://t.co/7B…"
            }, {
                "timestamp": "Fri Sep 14 18:05:39 +0000 2018",
                "id": "1040662879614234624",
                "text": "RT @memes_bachelor: U know public reaction is bad when @fleissmeister and @Millsy11374 have to get Jason and Blake to reassure us #THEBACHE…"
            }, {
                "timestamp": "Fri Sep 14 17:55:24 +0000 2018",
                "id": "1040660297038553088",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 17:54:42 +0000 2018",
                "id": "1040660124082360320",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 17:52:45 +0000 2018",
                "id": "1040659632455221249",
                "text": "Alright reality tv show fans, it’s been a wild week. What was the craziest tv related moment of the week?… https://t.co/K97FsxuIMO"
            }, {
                "timestamp": "Fri Sep 14 17:41:13 +0000 2018",
                "id": "1040656730789748736",
                "text": "RT @isabelchandoit: #justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/ubpromhWf1"
            }, {
                "timestamp": "Fri Sep 14 17:22:01 +0000 2018",
                "id": "1040651899731673089",
                "text": "RT @TrashTV_Junkie: After Nick and Arie, we deserved one of them! #BachelorNation #TheBachelor 😭😭 https://t.co/YE8OEkhVzD"
            }, {
                "timestamp": "Fri Sep 14 17:14:52 +0000 2018",
                "id": "1040650100270194688",
                "text": "U know public reaction is bad when @fleissmeister and @Millsy11374 have to get Jason and Blake to reassure us… https://t.co/twuYK12M9o"
            }, {
                "timestamp": "Fri Sep 14 17:11:35 +0000 2018",
                "id": "1040649273787015168",
                "text": "After Nick and Arie, we deserved one of them! #BachelorNation #TheBachelor 😭😭 https://t.co/YE8OEkhVzD"
            }, {
                "timestamp": "Fri Sep 14 17:04:19 +0000 2018",
                "id": "1040647445192028160",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/0KwStI8jMA"
            }, {
                "timestamp": "Fri Sep 14 17:04:14 +0000 2018",
                "id": "1040647422421151751",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/1UaSDOdfQO"
            }, {
                "timestamp": "Fri Sep 14 17:04:08 +0000 2018",
                "id": "1040647397259534337",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/XoeJ7NYXJA"
            }, {
                "timestamp": "Fri Sep 14 17:04:03 +0000 2018",
                "id": "1040647374958460928",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/VcCLoA4HbK"
            }, {
                "timestamp": "Fri Sep 14 17:03:57 +0000 2018",
                "id": "1040647352758022145",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/ubpromhWf1"
            }, {
                "timestamp": "Fri Sep 14 17:03:52 +0000 2018",
                "id": "1040647331442565121",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/2XW7QKJLmq"
            }, {
                "timestamp": "Fri Sep 14 17:03:46 +0000 2018",
                "id": "1040647305794334721",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/BnsdcZMHew"
            }, {
                "timestamp": "Fri Sep 14 17:03:42 +0000 2018",
                "id": "1040647288731955201",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/StUAqHjDkF"
            }, {
                "timestamp": "Fri Sep 14 17:03:37 +0000 2018",
                "id": "1040647267286491136",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/2hM9qvXJOV"
            }, {
                "timestamp": "Fri Sep 14 17:03:31 +0000 2018",
                "id": "1040647241718030342",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/9LVITCfdet"
            }, {
                "timestamp": "Fri Sep 14 17:02:24 +0000 2018",
                "id": "1040646961605566464",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/vGzfas0q9N"
            }, {
                "timestamp": "Fri Sep 14 17:02:16 +0000 2018",
                "id": "1040646928638390272",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/0UaKBAuH2s"
            }, {
                "timestamp": "Fri Sep 14 17:02:11 +0000 2018",
                "id": "1040646907423596545",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/zBxZx9a09k"
            }, {
                "timestamp": "Fri Sep 14 17:02:04 +0000 2018",
                "id": "1040646875462950912",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor #jordanforbachelor https://t.co/8LYeQdYz3C"
            }, {
                "timestamp": "Fri Sep 14 17:01:37 +0000 2018",
                "id": "1040646765886795781",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/vGzfas0q9N"
            }, {
                "timestamp": "Fri Sep 14 17:01:32 +0000 2018",
                "id": "1040646742881038342",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/3FtgUAubFF"
            }, {
                "timestamp": "Fri Sep 14 17:01:28 +0000 2018",
                "id": "1040646725306855424",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/YD4uLAYPIM"
            }, {
                "timestamp": "Fri Sep 14 17:01:21 +0000 2018",
                "id": "1040646698660454400",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/9vNxITA6sH"
            }, {
                "timestamp": "Fri Sep 14 17:01:14 +0000 2018",
                "id": "1040646665806532609",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/jvU1WQQqIb"
            }, {
                "timestamp": "Fri Sep 14 16:59:45 +0000 2018",
                "id": "1040646294207901696",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/1UaSDOdfQO"
            }, {
                "timestamp": "Fri Sep 14 16:59:38 +0000 2018",
                "id": "1040646265292369920",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/XoeJ7NYXJA"
            }, {
                "timestamp": "Fri Sep 14 16:59:33 +0000 2018",
                "id": "1040646242227970048",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/VcCLoA4HbK"
            }, {
                "timestamp": "Fri Sep 14 16:59:27 +0000 2018",
                "id": "1040646219654221824",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/ubpromhWf1"
            }, {
                "timestamp": "Fri Sep 14 16:59:21 +0000 2018",
                "id": "1040646193091620864",
                "text": "#justiceforjordan #bip #BachelorNation #BACHELORINPARADISE #TheBachelor https://t.co/2XW7QKJLmq"
            }, {
                "timestamp": "Fri Sep 14 16:53:09 +0000 2018",
                "id": "1040644634073092097",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 16:33:21 +0000 2018",
                "id": "1040639649625124864",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }, {
                "timestamp": "Fri Sep 14 16:27:26 +0000 2018",
                "id": "1040638161381220352",
                "text": "RT @pornoacademie: #College #chick @ShonaRiver #threeway with #principal @RickAngelPorn #PorndoePremium #PornoAcademie @PorndoePremium http…"
            }, {
                "timestamp": "Fri Sep 14 16:15:26 +0000 2018",
                "id": "1040635139728891904",
                "text": "I love going on @WendyWilliams she truly never holds back like today when I shared that I was a 27 yr old virgin an… https://t.co/1vsTAx7oCE"
            }, {
                "timestamp": "Fri Sep 14 16:08:36 +0000 2018",
                "id": "1040633422652137477",
                "text": "RT @CObrochta33: Starting to think  @BachelorABC is casting puppies for @colton instead of women 🤔🤔 ... spoiler alert??#TheBachelor #abc"
            }],
            profileInput: {},
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

        checkResults() {
            console.log("checking results");
            var r = this.results;
            if (r.numTweets > 0 && r.numWords > 0 && r.query && r.tweets.length > 0 && r.tones.length > 0 && r.personality != null) {
                console.log("results good");
                return true;
            }
            console.log("resuls good");
            return false;
        },

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

    watch: {
        checkResults() {
            if (this.checkResults && this.page != "results") {
                console.log("results were checked");
                this.addHistoryItem(this.results);
                this.displayResults();
            }
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

            var app = this;

            this.results.id = Date.now(),
                this.results.query = q;
                this.loading = true;
            /*
                        var submittingSearch = new Promise(function(resolve, reject) {
                            resolve();
                        });
                        
                        submittingSearch
                        .then(app.searchTweets)
                        .then(app.createToneText)
                        .then(toneText => app.analyzeTone(toneText))
                        .then(app.createPersonalityText)
                        .then(personalityText => app.analyzePersonality(personalityText))
                        .then(app.checkResults)
                        .then (function () {
                            this.addHistoryItem(this.results);
                            this.displayResults();
                            return;
                        }).catch(error => {
                            console.log(error);
                            //app.resetResults();
                        });
                        
            */
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

            //this.results.tweets = this.testingTweets;

            //this.searchTweets();
            /*if (this.results.tweets) {
                var toneText = this.createToneText();
                if (toneText) {
                    this.analyzeTone(toneText);
                    if (this.results.tones) {
                        var personalityText = this.createPersonalityText();
                        if (personalityText.contentItems.length) {
                            this.analyzePersonality(personalityText);
                            if (this.results.personality) {
                                this.addHistoryItem(this.results);
                                this.displayResults();
                                return;
                            } else {
                                console.log("no personality profile");
                                this.displayMessage("Unable to analyze personality.");
                            }
                        } else {
                            console.log("couldn't make personality content");
                            this.displayMessage("Unable to analyze personality.");
                        }
                    } else {
                        console.log("no tones");
                        this.displayMessage("Unable to analyze tone.");
                    }
                } else {
                    console.log("couldn't make tone text");
                    this.displayMessage("Unable to analyze tone.");
                }

            } else {
                console.log("no tweets in results");
                this.displayMessage("Unable to search Tweets.");
            }*/

            //this.resetResults();
        },

        analyzeSearch() {
            if (this.results.tweets) {
                var toneText = this.createToneText();
                if (toneText) {
                    this.analyzeTone(toneText);
                    if (this.results.tones) {
                        var personalityText = this.createPersonalityText();
                        if (personalityText.contentItems.length) {
                            this.analyzePersonality(personalityText);
                            if (this.results.personality) {
                                console.log("everything worked");
                                /*if (this.checkResults) {
                                    console.log("results were checked");
                                    this.addHistoryItem(this.results);
                                    this.displayResults();
                                    return;
                                }*/
                                return;
                            } else {
                                console.log("no personality profile");
                                this.displayMessage("Unable to analyze personality.");
                            }
                        } else {
                            console.log("couldn't make personality content");
                            this.displayMessage("Unable to analyze personality.");
                        }
                    } else {
                        console.log("no tones");
                        this.displayMessage("Unable to analyze tone.");
                    }
                } else {
                    console.log("couldn't make tone text");
                    this.displayMessage("Unable to analyze tone.");
                }

            } else {
                console.log("no tweets in results");
                this.displayMessage("Unable to search Tweets.");
            }

            this.loading = false;
        },

        /* ------------------------------
         * DISPLAY RESULTS
         * ------------------------------ */

        displayResults() {
            if (this.user) {
                db.ref("users/" + this.user[".key"] + "/currentResults").set(this.results);
                db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
            }
            this.loading = false;
            this.setPage("results");
        },

        resetResults() {
            if (this.user) {

                db.ref("users/" + this.user[".key"] + "/currentResults").remove();
            }
            this.isBookmark = false;

            this.results = {
                id: null,
                query: "",
                numTweets: 0,
                numWords: 0,
                tweets: [],
                tones: [],
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
            this.setPage("results");

            let save = Object.assign({}, this.results);
            delete save[".key"];

            db.ref("users/" + this.user[".key"] + "/currentResults").set(save);
            db.ref("users/" + this.user[".key"] + "/currentResults/isBookmark").set(this.isBookmark);
        },

        compareResults(bookmarks) {
            this.toCompare = bookmarks;

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

            console.log("searching tweets");

            var app = this;

            var query = {
                "query": "#" + app.results.query
            }

            console.log(query);

            fetch(`${API_URL}/tweets`, {
                    method: 'POST',
                    body: JSON.stringify(query),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(response => response.json())
                .then(data => {
                    console.log(data);

                    var tweets = data.results;
                    app.results.numTweets = tweets.length;

                    for (var i = 0; i < tweets.length; i++) {
                        app.results.tweets.push(app.parseTweetObject(tweets[i]));
                    };

                    console.log(app.results.tweets);
                    app.analyzeSearch();

                })

                /*.then(function() {
                    return Promise.resolve(app.results.tweets);
                })*/
                .catch(error => {
                    console.log(error);
                    //return Promise.reject(error);
                });
            /*
                        var query = {
                            "query": "#" + app.results.query
                        }

                        var key = "v88r6lWdrpiiYFrcYVZtwN4gx";
                        var secret = "nvbKZnwuOpBajOKjGIJtBKfhtGOpdlp8GLNO46HoqIFIWvLCT7";
                        var cat = key + ":" + secret;
                        var credentials = new Buffer(cat).toString('base64');

                        request({
                            url: "${ API_URL }" + 'https://api.twitter.com/oauth2/token',
                            method: 'POST',
                            headers: {
                                "Authorization": "Basic " + credentials,
                                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                            },
                            body: "grant_type=client_credentials"

                        }, function (err, resp, body) {

                            if (err) {
                                console.log(err);
                                return;
                            }

                            console.dir(body); //the bearer token...
                            var tokenData = JSON.parse(body);
                            var token = tokenData.access_token;

                            request.post({
                                url: "${ API_URL }" + "https://" + twitterSearchConfig["url"] + twitterSearchConfig["env"] + ".json",
                                headers: {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": 'application/json'
                                },
                                body: query,
                                json: true
                            }, function (e, r, body) {
                                if (e) {
                                    console.log(e);
                                    return false;
                                }
                                console.log(body);

                                var tweets = body.results;

                                app.results.numTweets = tweets.length;

                                for (var i = 0; i < tweets.length; i++) {
                                    app.results.tweets.push(app.parseTweetObject(tweets[i]));
                                };
                            })

                        });*/
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

            console.log("creating tone text");
            var text = "";

            for (var i = 0; i < this.results.tweets.length; i++) {
                text += ". " + this.results.tweets[i].text;
            }

            console.log(text);
            return text;
            /*if (text) {
                return Promise.resolve(text);
            } else {
                return Promise.reject("Could not create tone text.")
            }*/

        },

        analyzeTone(text) {

            console.log("analyzing tone");

            var app = this;

            var tone_input = {
                text: text
            };

            fetch(`${API_URL}/tones`, {
                    method: 'POST',
                    body: JSON.stringify(tone_input),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.results.tones = data.document_tone.tones;
                    /*app.results.tones = [];

                    for (var i = 0; i < data.document_tone.tone_categories.length; i++) {
                        for (var j = 0; j < data.document_tone.tone_categories[i].tones.length; j++) {
                            app.results.tones.push(data.document_tone.tone_categories[i].tones[j])
                        }
                    }*/

                })
                /*.then(function() {return Promise.resolve(app.results.tones);})*/
                .catch(error => {
                    console.log(error);
                    //return Promise.reject(error)
                });

            /*
                        var toneParams = {
                            tone_input: {
                                text: text
                            },
                            content_type: "application/json",
                            sentences: false
                        };

                        toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
                            if (error) {
                                console.log(error);
                                return;
                            } else {
                                console.log(toneAnalysis);
                                app.results.tones = [];

                                for (var i = 0; i < toneAnalysis.document_tone.tone_categories.length; i++) {
                                    for (var j = 0; j < toneAnalysis.document_tone.tone_categories[i].tones.length; j++) {
                                        app.results.tones.push(toneAnalysis.document_tone.tone_categories[i].tones[j])
                                    }
                                }
                            }
                        });

                        if (this.results.tones) {
                            return true;
                        } else {
                            return false;
                        }*/
        },

        /* ------------------------------
         * PERSONALITY INSIGHTS
         * ------------------------------ */

        createPersonalityText() {

            console.log("creating personality text");

            var app = this;

            var content = {
                contentItems: []
            };

            for (var i = 0; i < this.results.tweets.length; i++) {

                var item = {
                    content: app.results.tweets[i].text,
                    contenttype: "text/plain",
                    id: app.results.tweets[i].id,
                    language: "en"
                };

                content.contentItems.push(item);
            }
            this.profileInput = content;
            console.log(content);
            return content;

            /* if (content) {
                 return Promise.resolve(content);
             } else {
                 return Promise.reject("Could not create personality text.")
             }*/

        },

        analyzePersonality(content) {

            console.log("analyzing personality");
            var app = this;
            /*
                        var personalityParams = {
                            content: content,
                            content_type: "application/json",
                            consumption_preferences: true
                        };

                        personalityInsights.profile(
                            
                                personalityParams
                            ,
                            function (error, profile) {
                                if (error) {
                                    console.log(error);
                                    
                                } 
                                    console.log("yeet");
                                    console.log(profile);
                                    app.results.personality = profile;
                                
                            });
            */

            fetch(`${API_URL}/personality`, {
                    method: 'POST',
                    body: JSON.stringify(content),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.results.personality = data;
                    app.results.numWords = data.word_count;

                })

                /*.then(function() {
                    return Promise.resolve(app.results.personality);
                })*/
                .catch(error => {
                    console.log(error);
                    //return Promise.reject(error);
                });

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
        },

        closeInfoDialog() {
            this.infoDialog = false;
        },

        exportData() {
            var app = this;
             var myWindow = window.open("/data" , "Results JSON");
             myWindow.document.write(JSON.stringify(app.results));
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
}

a.info:hover {
    color: #F06292 !important;
}
</style>
