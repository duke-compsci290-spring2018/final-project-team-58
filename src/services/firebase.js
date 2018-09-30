// use Firebase as our database
import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// configure and connect to database
var config = {
    apiKey: "AIzaSyAmXKBk0QKz0uUyLQrvUMvaq0e3Jzu71Wk",
    authDomain: "compsci-final-project.firebaseapp.com",
    databaseURL: "https://compsci-final-project.firebaseio.com",
    projectId: "compsci-final-project",
    storageBucket: "compsci-final-project.appspot.com",
    messagingSenderId: "427147065491"
}

// initialize firebase
var app = Firebase.initializeApp(config);

// export firebase, auth, and database
export const firebase = Firebase;
export const auth = app.auth();
export const db = app.database();