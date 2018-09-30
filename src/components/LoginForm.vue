<!-- Account Sign In or Register Dialog -->
<template>
<v-card class="elevation-12">

    <!-- TOOLBAR -->
    <v-toolbar dense dark card color="purple darken-4">
        <!-- tabs to switch between login or register -->
        <v-tabs grow v-model="tabs" color="transparent" slider-color="cyan">
            <v-tab>
                Login
            </v-tab>
            <v-tab>
                Register
            </v-tab>
        </v-tabs>
    </v-toolbar>

    <!-- CONTENT -->
    <v-container>
        <v-tabs-items v-model="tabs">

            <!-- LOGIN -->
            <v-tab-item>
                <v-card-text>
                    <!-- form to enter email and password -->
                    <v-form v-model="returningUser.valid">
                        <v-text-field v-model="returningUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email" required></v-text-field>
                        <v-text-field v-model="returningUser.password" prepend-icon="lock" name="password" label="Password" type="password" color="cyan" :rules="rules.password" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- submit login button -->
                    <v-btn color="cyan" dark depressed @click="submitLogin(false)">Login</v-btn>
                </v-card-actions>
            </v-tab-item>

            <!-- REGISTER -->
            <v-tab-item>
                <v-card-text>
                    <!-- form to enter name, email, and password -->
                    <v-form v-model="newUser.valid">
                        <v-text-field v-model="newUser.name" prepend-icon="face" name="name" label="Name" type="text" color="cyan" :rules="rules.name" required>Name</v-text-field>
                        <v-text-field v-model="newUser.email" prepend-icon="mail_outline" name="email" label="Email" type="email" color="cyan" :rules="rules.email" required></v-text-field>
                        <v-text-field v-model="newUser.password" prepend-icon="lock" name="password" label="Password" type="password" color="cyan" :rules="rules.password" hint="Password must be at least 6 characters" persistent-hint required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- submit registration button -->
                    <v-btn color="cyan" dark depressed @click="submitLogin(true)">Register</v-btn>
                </v-card-actions>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
</v-card>
</template>

<script>
export default {
    name: 'LoginForm',

    props: ["login", "register"],

    data() {
        return {
            tabs: null,         // tab currently shown (login or register)
            rules: {            // rules for valid name, email, and password
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
            returningUser: {    // entered text for user logging in
                valid: false,
                email: "",
                password: ""
            },
            newUser: {          // entered text for user registering
                valid: false,
                name: "",
                email: "",
                password: ""
            }
        }
    },

    methods: {
        
        // submit the login or registration
        submitLogin(newAccount) {
            // check if a new user is registering and if their information is valid
            if (newAccount && this.newUser.valid) {
                // submit registration
                this.register(this.newUser.name, this.newUser.email, this.newUser.password);
            } 
            // check if a returning user is logging in and if their information is valid
            else if (!newAccount && this.returningUser.valid) {
                // submit login
                this.login(this.returningUser.email, this.returningUser.password);
            }
        }
    }
}
</script>