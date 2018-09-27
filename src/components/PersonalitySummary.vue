<template>
<v-card id="summary" raised>
    <v-toolbar card flat v-if="header">
        <v-toolbar-title>Personality Summary</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>
    <v-container>
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content value="infoPanel">
                <v-card-text class="caption">
                    <p>The personality summary was obtained using <span class="font-weight-bold">IBM Watson's Personality Insights Text Summary.</span> To read more about the text summary generator, check out the <a class="info" href="https://github.com/personality-insights/text-summary" target="_blank">documentation</a>.</p>
                </v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-card-text>
            <p v-for="paragraph in paragraphSummary" :key="paragraph">
                {{ paragraph }}
                </p>
        </v-card-text>
    </v-container>
</v-card>
</template>

<script>
export default {
    name: 'PersonalitySummary',
    props: ["header", "textSummary"],
    data() {
        return {
            infoPanel: false
        }
    },

    computed: {
        paragraphSummary() {
            return this.textSummary.split(/\r?\n/);
        }
    },

    components: {

    },

    methods: {

    }
}
</script>

<style>

</style>
