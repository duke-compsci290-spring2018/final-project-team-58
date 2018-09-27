<template>
<v-responsive height="85vh">
    <v-container fill-height>
        <v-layout row wrap justify-center align-content-center>
            <v-flex xs12 mb-3>
                <h1 class="mb-4 display-3 font-weight-light text-xs-center white--text">
                    How does the world feel about...
                </h1>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center">
                <v-text-field v-model="searchQuery" solo type="text" prefix="#" color="purple darken-4" label="Hashtag Search">
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
        check () {
            this.searchQuery = this.searchQuery.trim();
            if (this.searchQuery && this.searchQuery.length <= 140 && /^\D\w*$/g.test(this.searchQuery)) {
                this.submitSearch(this.searchQuery);
            } else {
                this.displayMessage("Please enter a valid Twitter hashtag.")
            }
        }
    }
}
</script>
