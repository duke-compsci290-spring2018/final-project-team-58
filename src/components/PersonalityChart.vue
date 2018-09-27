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
                <v-expansion-panel-content value="infoPanel">
                    <v-card-text class="caption">
                    <p>The personality traits were obtained using <span class="font-weight-bold">IBM Watson's Personality Insights.</span>  
                    <span v-show="chartID == 'personality'">The service analyzes personality traits based on the Big Five personality characteristics, which "represent the most widely used model for generally describing how a person engages with the world." The model includes five primary dimensions: agreeableness, conscientiousness, extraversion, emotional range, and openness. To read more about the Big Five personality characteristics and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/models.html#models" target="_blank">documentation</a>.</span>
                    <span v-show="chartID == 'needs'">The service analyzes the personality needs describing "which aspects of a product resonate with a person." The model includes twelve characteristic needs: excitement, harmony, curiosity, ideal, closeness, self-expression, liberty, love, practicality, stability, challenge, and structure. To read more about the needs and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/needs.html#needs" target="_blank">documentation</a>.</span>
                    <span v-show="chartID == 'values'">The service analyzes the personality values describing "motivating factors that influence a person's decision making." The model includes five values: self-transcendence / helping others, conservation / tradition, hedonism / taking pleasure in life, self-enhancement / achieving success, and open to change / excitement. To read more about the values and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/needs.html#values" target="_blank">documentation</a>.</span>
                    </p>
                </v-card-text>
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
                currTraits: []
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

            this.currTraits = this.traits;
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
