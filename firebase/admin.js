require('dotenv').config()
const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth");

const serviceAccountKey = process.env.serviceAccountKey;
const serviceAccountPath =`./${serviceAccountKey}.json`
const serviceAccount = require(serviceAccountPath);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// console.log("Admin", admin);
exports.admin = admin;
exports.auth = getAuth();