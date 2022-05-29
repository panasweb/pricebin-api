const User = require('../models/User')
const Token = require('../models/Token')


module.exports.verifyToken = function (req, res) {
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (err) return res.status(500).send({ msg: err.message })

        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No se pudo verificar el token' })

        // Verify user
        User.findOneAndUpdate({ _id: token._userId }, { $set: {"verified": true} }, { new: true }, (err, doc) => {
            // For some reason not updating;
            if (err) return res.status(500).send({ msg: err.message });
            if (!doc) return res.status(200).send("La cuenta no existe");
            console.log("Verifying", doc);
            const msg = `Tu cuenta ${doc.email} ha sido verificada. Gracias, ahora puedes cerrar esta ventana y empezar a usar Pricebin!`
            return res.status(201).send(msg)
        });
    })
}