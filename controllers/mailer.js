// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const VERIFIED_SENDER = 'geebproject@gmail.com';

const MAIL_BODY = (username, verifyLink) => (`
Estimado ${username},

¡Te saludamos por parte del equipo Pricebin!
Por favor has click en el siguiente link para verificar tu cuenta:

${verifyLink}

¡Bienvenido al barrio!
Atte.
Pricebin 🍜
`);

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

exports.send2FAMail = async function(req, res) {
  let {UserKey, email} = req.body;

  if (!email) {
    if (!UserKey) {
      return res.status(401).send("Missing UserKey and email parameters")
    }
    const user = await User.findById(UserKey);
    email = user.email;
  }

  const msg = {
    to: email, // recipient
    from: VERIFIED_SENDER, // verified sender
    subject: 'Verifica tu cuenta en Pricebin',
    text: MAIL_TEXT,
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
