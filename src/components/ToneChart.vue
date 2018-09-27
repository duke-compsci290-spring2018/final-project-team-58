<template>
<v-card :id="chartID" raised>
    <v-toolbar card flat v-if="header">
        <v-toolbar-title>Tones Analysis</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>
    <v-container>
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text class="caption">
                    <p>The tone analysis was obtained using <span class="font-weight-bold">IBM Watson's Tone Analyzer.</span> Seven tones are analyzed: anger, fear, joy, sadness, analytical, confident, and tentative. A tone whose score is less than 0.5 is omitted, indicating that the emotion is unlikely to be perceived in the content. A score greater than 0.75 indicates a high likelihood that the tone is perceived. To read more about the tones and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/tone-analyzer/using-tone.html#using-the-general-purpose-endpoint" target="_blank">documentation</a>.</p>
                </v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
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
        "chartID",
        "tones",
        "header"
    ],

    data() {
        return {
            infoPanel: false,
            currTones: []
        }
    },

    computed: {

        numTones() {
            return this.currTones.length;
        }
    },

    mounted: function () {

        var app = this;
        this.currTones = this.tones;

        var height = this.numTones * 30 + (this.numTones - 1) * 15 + 50;

        var svg = d3.select("#" + app.chartID + "-chart")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + 600 + " " + height);

        var x = d3.scaleLinear()
            .range([120, 520]);

        svg.selectAll(".tone-score")
            .data(app.currTones)
            .enter()
            .append("g")
            .attr("class", "tone-score")
            .append("rect")
            .attr("x", "120")
            .attr("y", function (d, i) {
                return 25 + i * 45;
            })
            .attr("width", function (d) {
                return x(d.score);
            })
            .attr("height", "30")
            .attr("fill", function (d) {
                return app.getToneColor(d["tone_id"]);
            });

        svg.selectAll(".tone-score")
            .append("text")
            .text(function (d) {
                return d["tone_name"];
            })
            .attr("class", "tone-label")
            .attr("text-anchor", "end")
            .attr("transform", function (d, i) {
                var mid = 45 + i * 45;
                return "translate(100, " + mid + ")";
            });

        svg.selectAll(".tone-score")
            .append("text")
            .text(function (d) {
                return Math.round(d.score * 100) / 100;
            })
            .attr("class", "tone-score")
            .attr("text-anchor", "end")
            .attr("transform", function (d, i) {
                var mid = 45 + i * 45;
                return "translate(" + (110 + x(d.score)) + ", " + mid + ")";
            });

    },

    methods: {

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