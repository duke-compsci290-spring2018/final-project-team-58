<template>
<v-card raised>

    <!-- TOOLBAR -->
    <v-toolbar card flat v-if="header">
        <!-- title -->
        <v-toolbar-title>Users are {{ isLikely }} to...</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- show information panel -->
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>

    <!-- CONTENT -->
    <v-container>
        <!-- information panel -->
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text class="caption">
                    <p>The personality traits were obtained using <span class="font-weight-bold">IBM Watson's Personality Insights.</span>
                        "The service groups the more than 40 consumption preferences into eight high-level categories. The preferences indicate the author's likelihood to prefer different products, services, and activities."
                        <span v-show="likely">This list compiles the consumptions preferences deemed likely based on the personality analysis.</span>
                        <span v-show="!likely">This list compiles the consumptions preferences deemed unlikely based on the personality analysis.</span>
                        To read more about the consumption preferences and what they mean, you can read the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/preferences.html#preferences" target="_blank">documentation.</a>
                    </p>
                </v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- list of preferences -->
        <v-list class="pref-list" two-line>
            <v-list-tile v-for="(pref, index) in topPrefs" :key="index" avatar>
                <v-list-tile-avatar color="pink lighten-5">
                    <v-icon size="20" v-show="likely" color="pink">thumb_up</v-icon>
                    <v-icon size="20" v-show="!likely" color="pink darken-4">thumb_down</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    {{ getName(pref) }}
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>
</v-card>
</template>

<script>
export default {
    name: 'PersonalityPreferenes',
    props: [
        "likely",       // true if preferences are likely
        "behaviors",    // list of preferences
        "header"        // show/hide the header
    ],
    data() {
        return {
            infoPanel: false,           // show/hide the information expansion panel
            topPrefs: this.behaviors    // the top 3 preferences
        }
    },

    created: function () {
        // pick out 3 random preferences
        this.topPrefs.sort(function (a, b) {
            return 0.5 - Math.random();
        })
        this.topPrefs.splice(3);
    },

    computed: {

        // returns a string based on the likely boolean
        isLikely() {
            if (this.likely) {
                return "likely";
            }
            return "unlikely";
        }
    },

    methods: {

        // gets the name of the preference
        getName(pref) {
            var behavior = pref.name.substring(9, pref.name.length);
            return behavior;
        }

    }
}
</script>

<style>
.preferences {
    background: hsla(232.7, 57.2%, 36.7%, 0.4) !important;
}

.preferences.likely {
    background: hsla(230.9, 98.8%, 66.1%, 0.4) !important;
}

.pref-list {
    background-color: transparent !important;
}
</style>