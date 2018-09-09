<template>
    <v-card raised>
    <v-toolbar card flat v-if="header">
        <v-toolbar-title>Users are {{ isLikely }} to...</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>
    <v-container>
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text>yooo</v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-list class="pref-list" two-line>
            <v-list-tile v-for="pref in topPrefs" avatar>
                <v-list-tile-avatar color="indigo lighten-5">
                    <v-icon size="20" v-show="likely" color="indigo accent-2">thumb_up</v-icon>
                    <v-icon size="20" v-show="!likely" color="indigo darken-4">thumb_down</v-icon>
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
        props: ["likely", "behaviors", "header"],
        data () {
            return {
                infoPanel: false,
                topPrefs: this.behaviors
            }
        },

        created: function () {

            
            this.topPrefs.sort(function (a, b) {
                return 0.5 - Math.random();
            })

            this.topPrefs.splice(3);

        },

        computed: {
            isLikely () {
                if (this.likely) {
                    return "likely";
                }
                return "unlikely";
            }
        },
    
        methods: {


            getName (pref) {
                var behavior = pref.name.substring(9, pref.name.length);
                return behavior;
            }

        }
    }
</script>

<style>
.preferences {
    background: hsla(232.7,57.2%,36.7%, 0.4) !important;
}

.preferences.likely {
    background: hsla(230.9,98.8%,66.1%, 0.4) !important;
}

.pref-list {
    background-color: transparent !important;
}
</style>
