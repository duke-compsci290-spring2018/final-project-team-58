<template>
    <v-card id="chart-card" raised>
        <v-toolbar card flat v-if="header">
            <v-toolbar-title>{{ chartTitle }}</v-toolbar-title>
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
    <div class="chart-container">
    <svg :id="chartID"></svg>
  </div>
        </v-container>
</v-card>
</template>

<script>

    import * as d3 from "d3";
    export default {
        name: 'PersonalityChart',
        props: ["traits", "chartID", "header"],

        data () {
            return {
                infoPanel: false,
                currTraits: this.traits
            }
        },

        computed: {
            chartTitle () {
                var title = this.chartID.charAt(0).toUpperCase() + this.chartID.slice(1);
                return title;
            }
        },

        mounted: function() {

            var app = this;

            /*this.currTraits.sort(function (a, b) {
                return a.percentile - b.percentile;
            });*/

            this.currTraits.splice(5);

            var svg = d3.select("#" + app.chartID)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 400");

            var arc = d3.arc();

            svg.selectAll("g")
            .data(app.currTraits)
            .enter()
            .append("g")
            .attr("class", "trait")
            .attr("transform", "translate(200, 200)");

            svg.selectAll(".trait")
            .append("path")
            .attr("class", "trait-arc")
            .attr("d", function (d, i) {
                var end = (d.percentile * 270.0) * (Math.PI / 180.0);
                return arc({
                    innerRadius: i * 20 + 60,
                    outerRadius: (i + 1) * 20 + 55,
                    startAngle: 0,
                    endAngle: end
                });
            })
            .attr("fill", function (d, i) {
                return d3.interpolateMagma(0.9 - i / app.currTraits.length);
            })
            .attr("transform", "rotate(180)");

            svg.selectAll(".trait")
            .append("text")
            .text(function (d) {
                return d.name;
            })
            .attr("class", "trait-label")
            .attr("fill", function (d, i) {
                return d3.interpolateMagma(0.9 - i / app.currTraits.length);
            })
            .attr("transform", function (d, i) {
                var y = (i + 1) * 20 + 55;
                return "translate(6, " + y + ")";
            });

            svg.selectAll(".trait")
            .append("text")
            .text(function (d) {
                return Math.round(d.percentile * 100) + "%";
            })
            .attr("class", "percent-label")
            .attr("transform", function (d, i) {
                var end = (d.percentile * 270.0) * (Math.PI / 180.0);
                var a = (0 + end + 0.06) - Math.PI / 2;
                var r = i * 20 + 62.5;

                return "translate(" + (-(Math.cos(a) * r)) + ", " + (-(Math.sin(a) * r)) + ")"
                + " rotate(" + (180/Math.PI * a - 90) + ")"; 
            });
    },
    
        methods: {
    
    
    
        }
    }
</script>

<style>
.chart-card {
    /*background: hsla(231.4,43.8%,93.7%, 0.35) !important;*/
}

  .chart-container {
    display: inline-block;
    position: relative;
    width: 100%;
    vertical-align: center;
    overflow: hidden;
  }

text {
    font-family: Roboto;
    font-weight: bold;
}

.trait-label {
    font-size: 18px;
    letter-spacing: 0.25px;
}

.percent-label {
    fill: rgba(0,0,0,0.6);
    font-size: 14px;
}   
</style>
