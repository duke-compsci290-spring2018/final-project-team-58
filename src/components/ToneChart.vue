<template>
<v-card id="tones-chart">
    <v-card-title>
        <h3>Tones</h3>
    </v-card-title>
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
#tones-chart {
    background: rgba(255, 255, 255, 0.9);
}

.tone-label {
    font-size: 14px;
    letter-spacing: 0.25px;
    fill: rgba(0,0,0,0.8);
}
    
</style>
