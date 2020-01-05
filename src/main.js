import Vue from 'vue'
import firebase from 'firebase'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

let app = ''

firebase.initializeApp({
    "projectId": "sports-challenge",
    "appId": "1:961864914058:web:575533d99853caf806c973",
    "databaseURL": "https://sports-challenge.firebaseio.com",
    "storageBucket": "sports-challenge.appspot.com",
    "locationId": "europe-west",
    "apiKey": "AIzaSyAtcwX-6UZGe1FYRdGK-uFma6Ibqvkixps",
    "authDomain": "sports-challenge.firebaseapp.com",
    "messagingSenderId": "961864914058"
});

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
          router,
          render: h => h(App)
        }).$mount('#app')
    }
})

