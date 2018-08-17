<template>
    <v-card class="preferences" :class="{ likely: likely }" dark>
        <v-card-title>
            <h3>Users are {{ isLikely }} to...</h3>
        </v-card-title>
        <v-list class="pref-list">
            <!--<v-list-tile v-for="pref in topPrefs" avatar>
                <v-list-tile-avatar color="indigo lighten-5">
                    <v-icon size="20" v-show="likely" color="indigo accent-2">thumb_up</v-icon>
                    <v-icon size="20" v-show="!likely" color="indigo darken-4">thumb_down</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    {{ getName(pref) }}
                </v-list-tile-content>
            </v-list-tile>-->
        </v-list>
    </v-card>
</template>

<script>

    export default {
        name: 'PersonalityPreferenes',
        props: ["likely", "behaviors"],
        data () {
            return {
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
