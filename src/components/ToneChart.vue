<template>
    <v-card id="tones-chart">
        <v-toolbar card flat>
            <v-toolbar-title>Tones</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>info</v-icon>
            </v-btn>

        </v-toolbar>
        <!--<v-card-title primary-title>
            <h3 class="headline">Tones</h3>
            <div>Subtitle</div>
        </v-card-title>-->
    <div class="chart-container">
    <svg id="tones"></svg>
  </div>
</v-card>
</template>

<script>
import * as d3 from "d3";

    export default {
        name: 'ToneChart',
        props: [
            "tones"
        ],
        
        data () {
            return {

            }
        },

        computed: {
            
            numTones () {
                return this.tones.length;
            }
        },

        mounted: function () {

            var app = this;
            var height = this.numTones * 30 + (this.numTones - 1) * 15 + 50;

            var svg = d3.select("#tones")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + 600 + " " + height);

            var x = d3.scaleLinear()
            .range([120, 520]);

            svg.selectAll(".tone-score")
            .data(app.tones)
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

            getToneColor (toneID) {
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
    fill: rgba(0,0,0,0.8);
}

.tone-score {
    font-size: 12px;
    letter-spacing: 0.5;
    fill: white;
}
    
</style>
