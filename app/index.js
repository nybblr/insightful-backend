let firebase = require('firebase');

let config = {
  apiKey: "AIzaSyD9mjz3baEAtuezAJyPJuk1zUU2BagHTUQ",
  authDomain: "insightful-e5084.firebaseapp.com",
  databaseURL: "https://insightful-e5084.firebaseio.com",
  projectId: "insightful-e5084",
  storageBucket: "insightful-e5084.appspot.com",
};

firebase.initializeApp(config);
let db = firebase.database();

let pdfStatsRef = db.ref('pdfStats');

pdfStatsRef.once('value', console.log);
