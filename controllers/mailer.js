// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SG_API_KEY);


module.exports.testMail = function(req, res) {
    const msg = {
      to: 'ericjardon@hotmail.com', // Change to your recipient
      from: 'geebproject@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        return res.status(200).send("Mail sent");
      })
      .catch((error) => {
        console.error(error)
        return res.status(500).send("Error", error);
      })
    
}

