<!-- Tone Analysis Chart -->
<template>
<v-card :id="chartID" raised>
    
    <!-- TOOLBAR -->
    <v-toolbar card flat v-if="header">
        <!-- title -->
        <v-toolbar-title>Tones Analysis</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- show/hide information panel button -->
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>

    <!-- CONTENT -->
    <v-container>
        <!-- information expansion panel -->
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text class="caption">
                    <p>The tone analysis was obtained using <span class="font-weight-bold">IBM Watson's Tone Analyzer.</span> Seven tones are analyzed: anger, fear, joy, sadness, analytical, confident, and tentative. A tone whose score is less than 0.5 is omitted, indicating that the emotion is unlikely to be perceived in the content. A score greater than 0.75 indicates a high likelihood that the tone is perceived. To read more about the tones and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/tone-analyzer/using-tone.html#using-the-general-purpose-endpoint" target="_blank">documentation</a>.</p>
                </v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- tone bar chart -->
        <div class="chart-container">
            <svg :id="chartID + '-chart'"></svg>
        </div>
    </v-container>
</v-card>
</template>

<script>
import * as d3 from "d3";

export default {
    name: 'ToneChart',
    props: [
        "chartID",  // ID for mounting chart
        "tones",    // tone analysis data
        "header"    // show / hide the header
    ],

    data() {
        return {
            infoPanel: false,   // show/hide the info panel
            currTones: []       // current tones from tone analysis data
        }
    },

    computed: {

        // number of tones in tones array
        numTones() {
            return this.currTones.length;
        }
    },

    // create the tones graph
    mounted: function () {
        var app = this;
        this.currTones = this.tones;

        // set the height of the graph based on number of tones
        var height = this.numTones * 30 + (this.numTones - 1) * 15 + 50;

        // mount chart to template
        var svg = d3.select("#" + app.chartID + "-chart")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + 600 + " " + height);

        // define a linear scale
        var x = d3.scaleLinear()
            .range([120, 520]);

        // select all with the tone-score class
        svg.selectAll(".tone-score")
            .data(app.currTones)            // bind the tones data
            .enter()
            .append("g")                    // append <g> for every tone in tone data
            .attr("class", "tone-score")    // add tone-score class
            .append("rect")                 // append a rectangle for the bar
            .attr("x", "120")
            .attr("y", function (d, i) {
                return 25 + i * 45;
            })
            .attr("width", function (d) {   // set the width of the bar based on tone score
                return x(d.score);
            })
            .attr("height", "30")
            .attr("fill", function (d) {    // set the color of the bar based on tone
                return app.getToneColor(d["tone_id"]);
            });

        // select all with tone-score class
        svg.selectAll(".tone-score")
            .append("text")                 // append text
            .text(function (d) {            // fill text based on name of tone
                return d["tone_name"];
            })
            .attr("class", "tone-label")    // apply tone-label class
            .attr("text-anchor", "end")
            .attr("transform", function (d, i) {    // transform text based on location of bar
                var mid = 45 + i * 45;
                return "translate(100, " + mid + ")";
            });

        // select all with tone-score class
        svg.selectAll(".tone-score")
            .append("text")                 // append text
            .text(function (d) {            // fill text based on tone score value
                return Math.round(d.score * 100) / 100;
            })
            .attr("class", "tone-score")    // apply tone-score class
            .attr("text-anchor", "end")
            .attr("transform", function (d, i) {    // transform text based on location of bar
                var mid = 45 + i * 45;
                return "translate(" + (110 + x(d.score)) + ", " + mid + ")";
            });
    },

    methods: {

        // get the color of the tone bar based on the tone ID
        getToneColor(toneID) {
            switch (toneID) {
                case "anger":
                    return d3.schemeCategory10[3];
                case "fear":
                    return d3.schemeCategory10[4];
                case "joy":
                    return d3.schemeSet2[5];
                case "sadness":
                    return d3.schemeAccent[4];
                case "analytical":
                    return d3.schemeDark2[4];
                case "confident":
                    return d3.schemeCategory10[1];
                case "tentative":
                    return d3.schemeCategory10[7];
                default:
                    return d3.schemeCategory10[7];
            }
        }
    }
}
</script>

<style>
.tone-label {
    font-size: 14px;
    letter-spacing: 0.25px;
    fill: rgba(0, 0, 0, 0.8);
}

.tone-score {
    font-size: 12px;
    letter-spacing: 0.5;
    fill: white;
}

.info-panel {
    background-color: transparent;
    box-shadow: none;
}
</style>