<template>
<v-container class="mb-4">
    <v-layout align-start justify-center>
        <v-flex xs12>
            <v-card>
                <v-toolbar card dense color="purple darken-4">
                    <v-toolbar-title class="white--text">Hello, {{ user.name }}!</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-tabs color="transparent" slider-color="cyan" v-model="accountTabs">
                            <v-tab href="#account-bookmarks">
                                <v-icon dark>bookmark</v-icon>
                            </v-tab>
                            <v-tab href="#account-history">
                                <v-icon dark>history</v-icon>
                            </v-tab>
                            <v-tab href="#account-master-history" v-if="user['.key'] == admin">
                                <v-icon dark>supervised_user_circle</v-icon>
                            </v-tab>
                            <v-tab href="#account-settings">
                                <v-icon dark>settings</v-icon>
                            </v-tab>
                        </v-tabs>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container>
                    <v-tabs-items v-model="accountTabs" class="px-3">

                        <v-tab-item id="account-bookmarks">
                            <v-card-title primary-title>
                                <h5 class="title mb-0 mt-2">Bookmarks</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="bookmarkSearch" append-icon="search" label="Search Bookmarks" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="headers" :items="bookmarks" :search="bookmarkSearch" class="my-3" v-model="selected">
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.item.hashtag }}</td>
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <td class="d-flex">
                                        <v-checkbox v-model="props.selected" hide-details color="cyan" class="align-center justify-center" :disabled="disableCheckbox(props.item)"></v-checkbox>
                                        <v-icon class="mr-4" @click="viewBookmark(props.item)">
                                            visibility
                                        </v-icon>
                                        <v-icon @click="deleteBookmark(props.item)">
                                            delete
                                        </v-icon>
                                    </td>
                                </template>
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ bookmarkSearch }}" found no results.
                                </v-alert>

                            </v-data-table>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" depressed @click="deleteAllBookmarks" :disabled="bookmarks.length == 0">Clear Bookmarks</v-btn>
                                <v-btn depressed color="cyan" @click="compareBookmarks(selected)" :disabled="!numSelected" class="white--text">Compare Selected</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <v-tab-item id="account-history">
                            <v-card-title>
                                <h5 class="title mb-0 mt-2">History</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="historySearch" append-icon="search" label="Search History" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="headers" :items="history" :search="historySearch" class="my-3">

                                <template slot="items" slot-scope="props">
                                    <td>{{ props.item.name }}</td>
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <td>
                                        <v-icon @click="deleteHistoryItem(props.item)">
                                            delete
                                        </v-icon>
                                    </td>
                                </template>
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ historySearch }}" found no results.
                                </v-alert>
                            </v-data-table>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" depressed @click="deleteAllHistory" :disabled="history.length == 0">Clear History</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <v-tab-item id="account-master-history" v-if="user['.key'] == admin">
                            <v-card-title>
                                <h5 class="title mb-0 mt-2">Master History</h5>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="masterHistorySearch" append-icon="search" label="Search Master History" single-line hide-details color="cyan"></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="masterHistoryHeaders" :items="allHistory" :search="masterHistorySearch" class="my-3">

                                <template slot="items" slot-scope="props">
                                    <td>{{ props.item.name }}</td>
                                    <td class="text-xs">{{ props.item.timestamp }}</td>
                                    <td class="text-xs">{{ props.item.user }}</td>
                                </template>
                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ masterHistorySearch }}" found no results.
                                </v-alert>
                            </v-data-table>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" depressed @click="deleteGuestHistory" :disabled="!isGuestHistory">Clear Guest History</v-btn>
                            </v-card-actions>
                        </v-tab-item>

                        <v-tab-item id="account-settings">
                            <v-card-title>
                                <h5 class="title">Profile</h5>
                                <v-spacer></v-spacer>
                                <h5 class="body-2 grey--text text-uppercase" v-if="user['.key'] == admin">Administrator</h5>
                            </v-card-title>
                            <v-form>
                                <v-text-field v-model="editUser.name" prepend-icon="face" name="name" label="Name" type="text" color="cyan" :rules="rules.name"></v-text-field>
                                <v-text-field v-model="editUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email"></v-text-field>
                            </v-form>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-grey darken-2" dark flat @click="resetProfile">Cancel</v-btn>
                                <v-btn color="cyan" dark depressed @click="updateProfile(editUser.name, editUser.email, editUser.oldPassword)">Save Profile</v-btn>
                            </v-card-actions>
                            <v-divider class="my-4"></v-divider>
                            <v-card-title>
                                <h5 class="title">Password</h5>
                            </v-card-title>
                            <v-form class="mb-3">
                                <v-text-field v-model="editUser.oldPassword" prepend-icon="lock" name="oldPassword" label="Old Password" type="password" color="cyan" :rules="rules.password"></v-text-field>
                                <v-text-field v-model="editUser.newPassword" prepend-icon="lock" name="newPassword" label="New Password" type="password" color="cyan" :rules="rules.password"></v-text-field>
                            </v-form>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-grey darken-2" dark flat @click="resetPassword">Cancel</v-btn>
                                <v-btn color="cyan" dark depressed @click="updatePassword(editUser.oldPassword, editUser.newPassword)">Change Password</v-btn>
                            </v-card-actions>
                            <v-divider class="my-4"></v-divider>
                            <v-card-title>
                                <h5 class="title">Delete Account</h5>
                            </v-card-title>
                            <v-card-text>
                                You may delete your account, but you will lose all of your bookmarked searches as well as your search history. Please think carefully before deciding to delete your account. <strong>You cannot undo this action.</strong>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
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
        "user",
        "admin",
        "currTab",
        "setPage",
        "viewBookmark",
        "compareBookmarks",
        "deleteBookmark",
        "deleteAllBookmarks",
        "deleteHistoryItem",
        "deleteAllHistory",
        "masterHistory",
        "deleteGuestHistory",
        "updateProfile",
        "updatePassword",
        "deleteAccount"
    ],

    data() {
        return {
            accountTabs: this.currTab,
            selected: [],
            headers: [{
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
            masterHistoryHeaders: [{
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
            bookmarks: this.getBookmarks(),
            bookmarkSearch: "",
            history: this.getHistory(),
            historySearch: "",
            allHistory: this.masterHistory,
            masterHistorySearch: "",
            editUser: {
                name: this.user.name,
                email: this.user.email,
                oldPassword: "",
                newPassword: ""
            },
            rules: {
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
        numSelected() {
            if (this.selected.length >= 2) {
                return true;
            }
            return false;
        },

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
        accountTabs: function () {
            this.setPage(this.accountTabs);
        },

        user: function () {
            this.bookmarks = this.getBookmarks();
            this.history = this.getHistory();
        },

        masterHistory: function () {
            this.allHistory = this.masterHistory;
        }
    },

    methods: {
        getBookmarks() {
            var b = [];
            for (var bookmark in this.user.bookmarks) {
                var add = this.user.bookmarks[bookmark];
                add[".key"] = bookmark;
                b.push(add);
            }
            return b;
        },

        getHistory() {
            var h = [];
            for (var item in this.user.history) {
                var add = this.user.history[item];
                add[".key"] = item;
                h.push(add);
            }
            return h;
        },

        resetProfile() {
            this.editUser.name = this.user.name;
            this.editUser.email = this.user.email;
        },

        resetPassword() {
            this.editUser.oldPassword = "";
            this.editUser.newPassword = "";
        },

        disableCheckbox(item) {
            if (!this.numSelected || this.selected.includes(item)) {
                return false;
            }
            return true;
        }
    }
};
</script>

<style>

</style>
