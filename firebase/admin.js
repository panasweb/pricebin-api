require('dotenv').config()
const admin = require("firebase-admin");

const serviceAccountKey = process.env.serviceAccountKey;
const serviceAccountPath =`./${serviceAccountKey}.json`
const serviceAccount = require(serviceAccountPath);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// console.log("Admin", admin);
module.exports = admin;