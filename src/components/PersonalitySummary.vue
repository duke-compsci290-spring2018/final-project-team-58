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
            <v-expansion-panel-content v-model="infoPanel">
                <v-card-text>yooo</v-card-text>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-card-text>
            <p>You are helpful and analytical.</p>
<p>You are emotionally aware: you are aware of your feelings and how to express them. You are empathetic: you feel what others feel and are compassionate towards them. And you are altruistic: you feel fulfilled when helping others, and will go out of your way to do so.</p>
<p>Your choices are driven by a desire for well-being.</p>
<p>You consider both tradition and independence to guide a large part of what you do. You highly respect the groups you belong to and follow their guidance. And you like to set your own goals to decide how to best achieve them.</p>
        </v-card-text>
    </v-container>
</v-card>
</template>

<script>

    export default {
        name: 'PersonalitySummary',
        props: ["header"],
        data () {
            return {
                infoPanel: false
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
