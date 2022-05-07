const Vote = require('../models/Vote')
const User = require('../models/User')

const db = require('../db/db');


exports.create = async function (req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.description = 'Crear un voto a favor de un precio'
    */

    const {UserKey, PriceKey} = req.body;

    const vote = new Vote({
        UserKey,
        PriceKey
    });

    try {
        const newDoc = await vote.save();
        return res.status(200).send({
            message: "Vote added",
            newDoc,
        })

    } catch (e) {
        return res.status(500).send(e);
    }

}
exports.delete = function (req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.description = 'Borrar un voto a favor de un precio'
    */
    const {UserKey, PriceKey} = req.body;

    Vote.findOneAndDelete({UserKey, PriceKey})
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
}


exports.findUserVote = function (req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.description = 'Encontrar si usuario votó a favor de un precio'
    */
    const {userId, priceId} = req.body;

    Vote.findOne({userId, priceId})
    .then(doc => {
        // Test if no doc returns null
        res.send({
            doc: doc
        })

    })
    .catch(err => {
        res.status(500).send("Error: " + err);
    })
}

exports.getVoteCount = function (req, res) {
    /*
    #swagger.tags = ['Vote']
    #swagger.description = 'Devolver la cuenta de votos'
    */

    const {priceId} = req.params;
    
    Vote.countDocuments({PriceKey: priceId})
    .then(count => {
        res.send({
            PriceKey: priceId,
            count: count
        })
    })
    .catch(err => {
        res.status(500).send(err);
    })

}

exports.getVotesOfUser = function (req, res) {
    // TODO
}
exports.getAll = function (req, res) {
    // TODO
}
