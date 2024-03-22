const firebase = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

var serviceAccount = require("./keys.json");


// const firebaseConfig = {
//   apiKey: "AIzaSyCNnLrMU5PzQyFloDUd6OcoNibenxUf2BI",
//   authDomain: "panchami-associates.firebaseapp.com",
//   projectId: "panchami-associates",
//   storageBucket: "panchami-associates.appspot.com",
//   messagingSenderId: "457702218897",
//   appId: "1:457702218897:web:103523a4347f76c3b17330",
//   measurementId: "G-1C7LL6GWRT"
// };
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})


const db = getFirestore();
const Users=db.collection("users").doc()

// this is for changing the name of the doc
// const User=db.collection("Users").doc('alovelace');

module.exports=Users;