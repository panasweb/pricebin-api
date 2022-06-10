require('dotenv').config()
const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth");

//const serviceAccountKey = process.env.serviceAccountKey;
//const serviceAccountPath =`./${serviceAccountKey}.json`
//const serviceAccount = require("../config").config;

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
        "project_id": process.env.PROJECT_ID,
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_x509_CERT_UTL,
        "client_x509_cert_url": process.env.client_x509_cert_url
  })
});

// console.log("Admin", admin);
exports.admin = admin;
exports.auth = getAuth();