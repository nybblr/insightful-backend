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

// pdfStatsRef.once('value', console.log);

let userId = 1;

pdfStatsRef.orderByChild("userId")
    .startAt(userId)
    .endAt(userId)
    .once("value", function(data) {
        latestTimestamp = 0;
        latestItem = { pageLabel: NaN }
        data.forEach(function (entry) {
            item = entry.val()
            timestamp = item.startedAt;
            console.log(timestamp + ': page ' + item.pageNumber + ', page ' + item.pageLabel);
            if (timestamp > latestTimestamp) {
                latestItem = item;
            } 
        });
        console.log('Latest page is ' + latestItem.pageLabel);
    });

pdfStatsRef.on("child_added", function(entry) {
    let item = entry.val()
    let timestamp = item.startedAt;
    let userId = item.userId;
    console.log(timestamp + ': user=' + userId + ', page=' + item.pageNumber + ', page=' + item.pageLabel);
    let userPdfStatRef = db.ref('users/' + userId + '/pdfStat');
    userPdfStatRef.set(item);
});


