// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const VERIFIED_SENDER = 'geebproject@gmail.com';

const SERVER_URL = "http://localhost:3010"

const VERIFY_LINK_TEMPLATE = (tokenString) => `${SERVER_URL}/token/verify/${tokenString}`;

const MAIL_BODY_TEXT = (display_name, verify_link) => (`
Estimadx ${display_name},

¡Te saludamos por parte del equipo Pricebin!
Por favor ingresa este URL en tu navegador para verificar tu cuenta (expira en 12 horas):

${verify_link}

¡Bienvenido al barrio!
Atentamente,
Pricebin 🍜
`);

const MAIL_BODY_HTML = (display_name, verify_link) => (`
<h3>Estimadx ${display_name},</h3>

¡Te saludamos por parte del equipo <bold>Pricebin</bold>!
Por favor has click en el siguiente link para verificar tu cuenta (expira en 12 horas):

<a href="${verify_link}">Verificar mi Cuenta<a>


¡Bienvenido al barrio!
Atentamente,
<bold>Pricebin</bold> 🍜
`);

exports.RESEND_LIMIT = 3;

// Return the verification message structure for SendGrid API
exports.get2FAMail = function(email, displayName, tokenString) {
  displayName = displayName || "usuarix";
  
  const verifyLink = VERIFY_LINK_TEMPLATE(tokenString);
  const text = MAIL_BODY_TEXT(displayName, verifyLink);
  const html = MAIL_BODY_HTML(displayName, verifyLink)


  const msg = {
    to: email, // recipient
    from: VERIFIED_SENDER, // verified sender
    subject: 'Verifica tu cuenta en Pricebin',
    text:text,
    html:html,
  }

  return msg;
}


// Route for API testing
exports.testMail = function(req, res) {
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

