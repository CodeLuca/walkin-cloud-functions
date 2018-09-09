const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore(),
  customersRef = db.collection("customers");

  db.settings({
    timestampsInSnapshots: true
  });

exports.checkCustomers = functions.https.onRequest((request, response) => {
  // Get all customers
  customersRef
    .get()
    .then(snapshot => {
      // Loop through customers
      snapshot.forEach(doc => {

        let data = doc.data();

        console.log(Date.now(), +data.endTime);

        // If ready, remove customer
        if(Date.now() > +data.endTime) {
          customersRef.doc(doc.id).delete();
          console.log("customer with id: " + doc.id + " removed.")
        }
      });

      response.send("complete");
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});
