const mongoose = require('mongoose');

// Mongoose Setup
const URI = process.env.CONNECTIONSTRING;

mongoose.connect(URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console.error, "MongoDB Connection Error! :("))
console.log("Connection to MongoDB succesful");

module.exports = db