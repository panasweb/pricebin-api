const mongoose = require('mongoose');

// Mongoose Setup
const URI = process.env.TEST ? 
    process.env.TESTDB_CONNECTION 
    : process.env.CONNECTIONSTRING;

mongoose.connect(URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console.error, "MongoDB Connection Error! :("))
console.log("Succesful Connection to MongoDB:", URI);

module.exports = db