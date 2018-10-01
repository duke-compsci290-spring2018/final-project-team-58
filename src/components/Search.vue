<!-- Search Homepage -->
<template>
<v-responsive height="85vh">
    <v-container fill-height>
        <v-layout row wrap justify-center align-content-center>
            <v-flex xs12 mb-3>
                <!-- text title -->
                <h1 class="mb-4 display-3 font-weight-light text-xs-center white--text">
                    How does the world feel about...
                </h1>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center">
                <!-- search query text field -->
                <v-text-field v-model="searchQuery" solo type="text" prefix="#" color="purple darken-4" label="Hashtag Search">
                    <!-- submit search button -->
                    <v-btn slot="append-outer" style="top: -12px" fab small dark color="purple darken-4" @click="check">
                        <v-icon>arrow_forward</v-icon>
                    </v-btn>
                </v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</v-responsive>
</template>

<script>
export default {
    name: 'Search',

    props: ["submitSearch", "displayMessage"],

    data() {
        return {
            searchQuery: ""
        }
    },

    methods: {

        // check if entered search query is valid before submitting
        check () {
            this.searchQuery = this.searchQuery.trim();
            // check if search query is a valid Twitter hashtag
            if (this.searchQuery && this.searchQuery.length <= 140 && /^\D\w*$/g.test(this.searchQuery)) {
                // submit the search if valid
                this.submitSearch(this.searchQuery);
            } else {
                // display error message
                this.displayMessage("Please enter a valid Twitter hashtag.")
            }
        }
    }
}
</script>