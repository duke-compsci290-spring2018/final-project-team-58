<!-- Personality Chart with Circle Graphs -->
<template>
<v-card id="chart-card" raised>

    <!-- TOOLBAR -->
    <v-toolbar card flat v-if="header">
        <!-- title -->
        <v-toolbar-title>{{ chartTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- show info panel -->
        <v-btn icon>
            <v-icon @click="infoPanel = !infoPanel">info_outline</v-icon>
        </v-btn>
    </v-toolbar>

    <!-- CONTENT -->
    <v-container>
        <!-- info panel with details about Watson Personality Insights -->
        <v-expansion-panel class="info-panel">
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text class="caption">
                    <p>The personality traits were obtained using <span class="font-weight-bold">IBM Watson's Personality Insights.</span>
                        <span v-show="chartID == 'personality'">The service analyzes personality traits based on the Big Five personality characteristics, which "represent the most widely used model for generally describing how a person engages with the world." The model includes five primary dimensions: agreeableness, conscientiousness, extraversion, emotional range, and openness. To read more about the Big Five personality characteristics and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/models.html#models" target="_blank">documentation</a>.</span>
                        <span v-show="chartID == 'needs'">The service analyzes the personality needs describing "which aspects of a product resonate with a person." The model includes twelve characteristic needs: excitement, harmony, curiosity, ideal, closeness, self-expression, liberty, love, practicality, stability, challenge, and structure. To read more about the needs and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/needs.html#needs" target="_blank">documentation</a>.</span>
                        <span v-show="chartID == 'values'">The service analyzes the personality values describing "motivating factors that influence a person's decision making." The model includes five values: self-transcendence / helping others, conservation / tradition, hedonism / taking pleasure in life, self-enhancement / achieving success, and open to change / excitement. To read more about the values and what they mean, check out the <a class="info" href="https://console.bluemix.net/docs/services/personality-insights/needs.html#values" target="_blank">documentation</a>.</span>
                    </p>
                </v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- graph created with D3 -->
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
    props: [
        "traits",       // data of traits, needs, or values
        "chartID",      // ID of chart for D3 mounting
        "header"        // true if header to be displayed (false on compare page)
    ],

    data() {
        return {
            infoPanel: false,   // show/hide the info expansion panel
            currTraits: []      // traits in chart
        }
    },

    computed: {

        // compute chart title based on chart ID
        chartTitle() {
            var title = this.chartID.charAt(0).toUpperCase() + this.chartID.slice(1);
            return title;
        }
    },

    mounted: function () {

        var app = this;

        // splice traits limited to 5
        this.currTraits = this.traits;
        this.currTraits.splice(5);

        // select the chart ID where to mount to graph
        var svg = d3.select("#" + app.chartID)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 400");

        // create a D3 arc
        var arc = d3.arc();

        // create a <g> element for every trait in the currTraits data
        svg.selectAll("g")
            .data(app.currTraits)
            .enter()
            .append("g")
            .attr("class", "trait")  // add the trait class
            .attr("transform", "translate(200, 200)");

        // select all with the trait class
        svg.selectAll(".trait")
            .append("path") // append a path
            .attr("class", "trait-arc") // add the trait-arc class
            .attr("d", function (d, i) {    // create the arc based on the data
                var end = (d.percentile * 270.0) * (Math.PI / 180.0);
                return arc({
                    innerRadius: i * 20 + 60,
                    outerRadius: (i + 1) * 20 + 55,
                    startAngle: 0,
                    endAngle: end
                });
            })
            .attr("fill", function (d, i) {     // color the arc based on order it is graphed
                return d3.interpolateMagma(0.9 - i / app.currTraits.length);
            })
            .attr("transform", "rotate(180)");

        // select all with the trait class
        svg.selectAll(".trait")
            .append("text")     // append text
            .text(function (d) {    // fill in text based on name of trait
                return d.name;
            })
            .attr("class", "trait-label")   // add trait-label class
            .attr("fill", function (d, i) {     // color trait-label based on order it is graphed
                return d3.interpolateMagma(0.9 - i / app.currTraits.length);
            })
            .attr("transform", function (d, i) {        // move text to appropriate location
                var y = (i + 1) * 20 + 55;
                return "translate(6, " + y + ")";
            });

        // select all with trait class
        svg.selectAll(".trait")
            .append("text")     // append text
            .text(function (d) {        // fill in text based on percentage of trait
                return Math.round(d.percentile * 100) + "%";
            })
            .attr("class", "percent-label")     // add percent-label class
            .attr("transform", function (d, i) {        // move text to appropriate location
                var end = (d.percentile * 270.0) * (Math.PI / 180.0);
                var a = (0 + end + 0.06) - Math.PI / 2;
                var r = i * 20 + 62.5;

                return "translate(" + (-(Math.cos(a) * r)) + ", " + (-(Math.sin(a) * r)) + ")" +
                    " rotate(" + (180 / Math.PI * a - 90) + ")";
            });
    }
}
</script>

<style>
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
    fill: rgba(0, 0, 0, 0.6);
    font-size: 14px;
}
</style>
