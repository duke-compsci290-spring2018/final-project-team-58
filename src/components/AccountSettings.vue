<!-- Account Settings Page -->
<template>
<v-container class="mb-4">
    <v-layout align-start justify-center>
        <v-flex xs12>
            <v-card>

                <!-- TOOLBAR -->
                <v-toolbar card dense color="purple darken-4">
                    
                    <!-- user greeting -->
                    <v-toolbar-title class="white--text">Hello, {{ user.name }}!</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <!-- tabs between pages -->
                    <v-toolbar-items>
                        <v-tabs color="transparent" slider-color="cyan" v-model="accountTabs">
                            <!-- bookmarks -->
                            <v-tab href="#account-bookmarks">
                                <v-icon dark>bookmark</v-icon>
                            </v-tab>
                            <!-- search history -->
                            <v-tab href="#account-history">
                                <v-icon dark>history</v-icon>
                            </v-tab>
                            <!-- master search history -->
                            <!-- displayed if user is the admin -->
                            <v-tab href="#account-master-history" v-if="admin">
                                <v-icon dark>supervised_user_circle</v-icon>
                            </v-tab>
                            <!-- settings -->
                            <v-tab href="#account-settings">
                                <v-icon dark>settings</v-icon>
                            </v-tab>
                        </v-tabs>
                    </v-toolbar-items>
                </v-toolbar>

                <!-- CONTENT -->
                <v-container>
                    <v-tabs-items v-model="accountTabs" class="px-3">

                        <!-- BOOKMARKS TAB -->
                        <v-tab-item id="account-bookmarks">

                            <!-- title and search bookmarks -->
                            <v-card-title primary-title>
                                <h5 class="title mb-0 mt-2">Bookmarks</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="bookmarkSearch" append-icon="search" label="Search Bookmarks" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <!-- data table of all bookmarks -->
                            <v-data-table :headers="headers" :items="bookmarks" :search="bookmarkSearch" class="my-3" v-model="selected">
                                <template slot="items" slot-scope="props">
                                    <!-- hashtag -->
                                    <td>{{ props.item.hashtag }}</td>
                                    <!-- date searched -->
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <!-- actions -->
                                    <td class="d-flex">
                                        <!-- checkbox for compare selection -->
                                        <v-checkbox v-model="props.selected" hide-details color="cyan" class="align-center justify-center" :disabled="disableCheckbox(props.item)"></v-checkbox>
                                        <!-- view bookmark -->
                                        <v-icon class="mr-4" @click="viewBookmark(props.item)">
                                            visibility
                                        </v-icon>
                                        <!-- delete bookmark -->
                                        <v-icon @click="deleteBookmark(props.item)">
                                            delete
                                        </v-icon>
                                    </td>
                                </template>
                                <!-- alert if no bookmarks match search query -->
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ bookmarkSearch }}" found no results.
                                </v-alert>
                            </v-data-table>

                            <!-- options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- delete all bookmarks -->
                                <v-btn color="error" depressed @click="deleteAllBookmarks" :disabled="bookmarks.length == 0">Clear Bookmarks</v-btn>
                                <!-- compare selected bookmarks -->
                                <v-btn depressed color="cyan" @click="compareBookmarks(selected)" :disabled="!numSelected" class="white--text">Compare Selected</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <!-- SEARCH HISTORY TAB -->
                        <v-tab-item id="account-history">
                            <!-- title and search the search history -->
                            <v-card-title>
                                <h5 class="title mb-0 mt-2">History</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="historySearch" append-icon="search" label="Search History" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <!-- data table of search history -->
                            <v-data-table :headers="headers" :items="history" :search="historySearch" class="my-3">
                                <template slot="items" slot-scope="props">
                                    <!-- search query -->
                                    <td>{{ props.item.name }}</td>
                                    <!-- date searched -->
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <td>
                                        <!-- delete search history item -->
                                        <v-icon @click="deleteHistoryItem(props.item)">
                                            delete
                                        </v-icon>
                                    </td>
                                </template>
                                <!-- alert if no search history items match search query -->
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ historySearch }}" found no results.
                                </v-alert>
                            </v-data-table>
                            <!-- options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- delete all search history -->
                                <v-btn color="error" depressed @click="deleteAllHistory" :disabled="history.length == 0">Clear History</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <!-- MASTER SEARCH HISTORY TAB -->
                        <!-- displayed only if user is admin -->
                        <v-tab-item id="account-master-history" v-if="admin">
                            <!-- title and search master history -->
                            <v-card-title>
                                <h5 class="title mb-0 mt-2">Master History</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="masterHistorySearch" append-icon="search" label="Search Master History" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <!-- data table of history items -->
                            <v-data-table :headers="masterHistoryHeaders" :items="allHistory" :search="masterHistorySearch" class="my-3">
                                <template slot="items" slot-scope="props">
                                    <!-- search query -->
                                    <td>{{ props.item.name }}</td>
                                    <!-- date searched -->
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <!-- name of user who searched -->
                                    <td class="text-xs">{{ props.item.user }}</td>
                                </template>
                                <!-- alert if no search history items match search query -->
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ masterHistorySearch }}" found no results.
                                </v-alert>
                            </v-data-table>
                            <!-- options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- clear the guest search history -->
                                <v-btn color="error" depressed @click="deleteGuestHistory" :disabled="!isGuestHistory">Clear Guest History</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <!-- ACCOUNT SETTINGS -->
                        <v-tab-item id="account-settings">
                            <!-- profile section title and administrator label if user is admin -->
                            <v-card-title>
                                <h5 class="title">Profile</h5>
                                <v-spacer></v-spacer>
                                <h5 class="body-2 grey--text text-uppercase" v-if="admin">Administrator</h5>
                            </v-card-title>
                            <!-- edit profile -->
                            <v-form>
                                <!-- user name -->
                                <v-text-field v-model="editUser.name" prepend-icon="face" name="name" label="Name" type="text" color="cyan" :rules="rules.name"></v-text-field>
                                <!-- user email -->
                                <v-text-field v-model="editUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email"></v-text-field>
                            </v-form>
                            <!-- profile section options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- reset profile data / cancel changes -->
                                <v-btn color="blue-grey darken-2" dark flat @click="resetProfile">Cancel</v-btn>
                                <!-- save profile changes -->
                                <v-btn color="cyan" dark depressed @click="updateProfile(editUser.name, editUser.email, editUser.oldPassword)">Save Profile</v-btn>
                            </v-card-actions>
                            <v-divider class="my-4"></v-divider>
                            <!-- password section title -->
                            <v-card-title>
                                <h5 class="title">Password</h5>
                            </v-card-title>
                            <!-- edit password -->
                            <v-form class="mb-3">
                                <!-- old password -->
                                <v-text-field v-model="editUser.oldPassword" prepend-icon="lock" name="oldPassword" label="Old Password" type="password" color="cyan" :rules="rules.password"></v-text-field>
                                <!-- new password -->
                                <v-text-field v-model="editUser.newPassword" prepend-icon="lock" name="newPassword" label="New Password" type="password" color="cyan" :rules="rules.password"></v-text-field>
                            </v-form>
                            <!-- password section options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- reset password data / cancel changes -->
                                <v-btn color="blue-grey darken-2" dark flat @click="resetPassword">Cancel</v-btn>
                                <!-- save new password -->
                                <v-btn color="cyan" dark depressed @click="updatePassword(editUser.oldPassword, editUser.newPassword)">Change Password</v-btn>
                            </v-card-actions>
                            <v-divider class="my-4"></v-divider>
                            <!-- delete account section title -->
                            <v-card-title>
                                <h5 class="title">Delete Account</h5>
                            </v-card-title>
                            <!-- informational text -->
                            <v-card-text>
                                You may delete your account, but you will lose all of your bookmarked searches as well as your search history. Please think carefully before deciding to delete your account. <strong>You cannot undo this action.</strong>
                            </v-card-text>
                            <!-- delete account options -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- delete account button -->
                                <v-btn color="error" depressed @click="deleteAccount(editUser.email, editUser.oldPassword)">Delete Account</v-btn>
                            </v-card-actions>
                        </v-tab-item>
                    </v-tabs-items>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
export default {
    name: "AccountSettings",
    
    props: [
        "user",                 // user object who is logged in
        "admin",                // true if user is admin
        "currTab",              // current tab viewing on the account settings tabs
        "setPage",              // set page function to new page
        "viewBookmark",         // view a bookmark
        "compareBookmarks",     // compare two bookmarks
        "deleteBookmark",       // delete a bookmark
        "deleteAllBookmarks",   // delete all bookmarks
        "deleteHistoryItem",    // delete search history item
        "deleteAllHistory",     // delete all search history
        "masterHistory",        // list of master search history
        "deleteGuestHistory",   // delete guest search history
        "updateProfile",        // update user profile
        "updatePassword",       // update user password
        "deleteAccount"         // delete user account
    ],

    data() {
        return {
            accountTabs: this.currTab,      // tab currently displayed
            selected: [],                   // bookmarks selected
            headers: [{                     // headers for bookmark and history data table
                    text: "Hashtag",
                    align: "left",
                    sortable: true,
                    value: "name"
                },
                {
                    text: "Date Searched",
                    align: "left",
                    sortable: true,
                    value: "timestamp"
                },
                {
                    text: "Actions",
                    align: "left",
                    sortable: false
                }
            ],
            masterHistoryHeaders: [{        // headers for master search history data table
                    text: "Hashtag",
                    align: "left",
                    sortable: true,
                    value: "name"
                },
                {
                    text: "Date Searched",
                    align: "left",
                    sortable: true,
                    value: "timestamp"
                },
                {
                    text: "User",
                    align: "left",
                    sortable: true,
                    value: "user"
                }
            ],
            bookmarks: this.getBookmarks(), // bookmarks displayed in table
            bookmarkSearch: "",             // search query in bookmarks table
            history: this.getHistory(),     // search history displayed in table
            historySearch: "",              // search query in history table
            allHistory: this.masterHistory, // master search history
            masterHistorySearch: "",        // search query in master search history table
            editUser: {                     // user profile info edited in account settings form
                name: this.user.name,
                email: this.user.email,
                oldPassword: "",
                newPassword: ""
            },
            rules: {                        // rules for updating a valid name, email, and password
                name: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 30) || 'Name must be less than 30 characters'
                ],
                email: [
                    v => !!v || 'Email address is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email address is not valid'
                ],
                password: [
                    v => (v && v.length >= 6) || 'Password must be at least 6 characters'
                ]
            }
        }
    },

    computed: {

        // number of bookmarks selected in data table
        // when enough selected they can be compared
        numSelected() {
            // return true if 2 are selected
            if (this.selected.length >= 2) {
                return true;
            }
            return false;
        },

        // check if an item in master search history belongs to guest user
        isGuestHistory() {
            if (this.allHistory) {
                for (var i = 0; i < this.allHistory.length; i++) {
                    if (this.allHistory[i].user == "Guest") {
                        return true;
                    }
                }
            }
            return false;

        }
    },

    watch: {
        // update page in main app when switching to different tab
        accountTabs: function () {
            this.setPage(this.accountTabs);
        },
        // update bookmarks and search history when user property changes
        user: function () {
            this.bookmarks = this.getBookmarks();
            this.history = this.getHistory();
        },
        // update all history when master history property changes
        masterHistory: function () {
            this.allHistory = this.masterHistory;
        }
    },

    methods: {

        // parse the user bookmarks to display in data table
        getBookmarks() {
            var b = [];
            for (var bookmark in this.user.bookmarks) {
                var add = this.user.bookmarks[bookmark];
                add[".key"] = bookmark;
                b.push(add);
            }
            return b;
        },

        // parse the user search history to display in data table
        getHistory() {
            var h = [];
            for (var item in this.user.history) {
                var add = this.user.history[item];
                add[".key"] = item;
                h.push(add);
            }
            return h;
        },

        // clear the changes in the user profile settings
        resetProfile() {
            this.editUser.name = this.user.name;
            this.editUser.email = this.user.email;
        },

        // clear the changes in the password settings
        resetPassword() {
            this.editUser.oldPassword = "";
            this.editUser.newPassword = "";
        },

        // disable a bookmark select checkbox based on how many are selected
        disableCheckbox(item) {
            if (!this.numSelected || this.selected.includes(item)) {
                return false;
            }
            return true;
        }
    }
};
</script>