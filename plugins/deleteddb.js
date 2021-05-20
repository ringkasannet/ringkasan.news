import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyDeXC42DgrTo80fx-rKv-Yx1P2g7L8E6bw",
    authDomain: "ringkasan-news.firebaseapp.com",
    projectId: "ringkasan-news",
    storageBucket: "ringkasan-news.appspot.com",
    messagingSenderId: "24259332039",
    appId: "1:24259332039:web:d6aa9ab8f27bc25be2fbe2",
    measurementId: "G-87H175L45W"
}


var db={}

if (!firebase.apps.length) {
    db = firebase
        .initializeApp(config)
        .firestore()
    // if using Firebase JS SDK < 5.8.0
    db.settings({ timestampsInSnapshots: true })
    
}

export default ({ app }, inject) => {
    inject('db', db)
}




