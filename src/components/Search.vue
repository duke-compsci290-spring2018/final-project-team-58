<template>
    <v-jumbotron height="100vh" dark>
        <v-container fill-height>
            <v-layout row wrap justify-center align-content-center>
                <v-flex xs12>
                    <h1 class="mb-4 display-2 text-xs-center">how does the world feel about...</h1>
                </v-flex>
                <v-flex xs8>
                    <v-form @submit.prevent>
                        <v-layout>
                            <v-text-field v-model="searchQuery" name="q" type="search" color="deep-purple darken-4" class="mr-2" required></v-text-field>
                            <v-btn fab small color="deep-purple darken-4" :click="submitSearch(searchQuery)">
                                <v-icon dark>arrow_forward</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-jumbotron>
</template>

<script>
    export default {
        name: 'Search',
        props: ["submitSearch"],
        components: {
    
        },
        data () {
            return {
                searchQuery: "",
                valid: false

            }
        }
    }
</script>

<style>
    
</style>
