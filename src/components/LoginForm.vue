<template>
    <v-card class="elevation-12">
        <v-toolbar tabs dark color="purple darken-4">
            <v-tabs grow v-model="tabs" color="purple darken-4" slider-color="cyan">
                <v-tab>
                    Sign In
                </v-tab>
                <v-tab>
                    Sign Up
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="tabs">
            <v-tab-item>
                <v-card-text>
                    <v-form v-model="returningUser.valid">
                        <v-text-field v-model="returningUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email" required></v-text-field>
                        <v-text-field v-model="returningUser.password" prepend-icon="lock" name="password" label="Password" type="password" color="cyan" :rules="rules.password" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey darken-2" dark flat>Forgot Password</v-btn>
                    <v-btn color="cyan" dark depressed @click="submitLogin(false)">Sign In</v-btn>
                </v-card-actions>
            </v-tab-item>
            <v-tab-item>
                <v-card-text>
                    <v-form v-model="newUser.valid">
                        <v-text-field v-model="newUser.name" prepend-icon="face" name="name" label="Name" type="text" color="cyan" :rules="rules.name" required>Name</v-text-field>
                        <v-text-field v-model="newUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email" required></v-text-field>
                        <v-text-field v-model="newUser.password" prepend-icon="lock" name="password" label="Password" type="password" color="cyan" :rules="rules.password" hint="Password must be at least 6 characters" persistent-hint required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="cyan" dark depressed @click="submitLogin(true)">Sign Up</v-btn>
                </v-card-actions>
    
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
    export default {
        name: 'LoginForm',
    
        props: ["signIn", "signUp"],
    
        components: {
    
    
        },
    
        data() {
            return {
                tabs: null,
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
                },
                returningUser: {
                    valid: false,
                    email: "",
                    password: ""
                },
                newUser: {
                    valid: false,
                    name: "",
                    email: "",
                    password: ""
                }
            }
        },
    
        created: function() {
    
        },
    
        computed: {
    
    
    
        },
    
        methods: {
            submitLogin (newAccount) {
                if (newAccount && this.newUser.valid) {
                    this.signUp(this.newUser.name, this.newUser.email, this.newUser.password);
                } else if (!newAccount && this.returningUser.valid) {
                    this.signIn(this.returningUser.email, this.returningUser.password);
                }
            }
    
        }
    }
</script>

<style>
    
</style>
