let firebase = require('firebase');
let _s = require('underscore.string');

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
let handRaisesRef = db.ref('handRaises');

pdfStatsRef.on("child_added", function(entry) {
    let item = entry.val()
    let timestamp = item.startedAt;
    let userId = item.userId;
    console.log(timestamp + ': user=' + userId + ', page=' + item.pageNumber + ', page=' + item.pageLabel);
    let userPdfStatRef = db.ref('users/' + userId + '/pdfStat');
    userPdfStatRef.set(item);
});


handRaisesRef.on("child_added", function(entry) {
    let item = entry.val()
    let userId = item.userId;
    let userHandRaiseRef = db.ref('users/' + userId + '/handRaiseCount');
    userHandRaiseRef.once('value').then(function(snapshot) {
      var count = snapshot.val();
      count = count || 0;
      userHandRaiseRef.set(count + 1);
    });

    let userPdfStatRef = db.ref('users/' + userId + '/pdfStat');
    userPdfStatRef.once('value').then(snapshot => {
      var stat = snapshot.val();
      console.log(stat)

      let { sections } = stat;

      sections = sections
        .slice(0, 3)
        .map(s => s
          .replace(/^Chapter\s+([\w]+)([\:\s\.].*)?$/, 'Ch. $1')
          .replace(/^Part\s+(\w+)([\:\s\.].*)?$/, 'Pt. $1')
        )

      let section = sections.join(', ')
      let sectionID = _s.slugify(section);
      console.log(sectionID)

      let hrbsCount = db.ref(`handRaisesBySection/${sectionID}/count`)
      let hrbsSection = db.ref(`handRaisesBySection/${sectionID}/section`)
      hrbsCount.once('value').then(function(snapshot) {
        var count = snapshot.val();
        count = count || 0;
        hrbsCount.set(count + 1);
        hrbsSection.set(section);
      });
    });
});
