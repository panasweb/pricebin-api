const Vote = require('../models/Vote')
const User = require('../models/User')

const db = require('../db/db');


exports.create = async function (req, res) {
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
    const {id} = req.params;

    Vote.findByIdAndDelete(id)
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
}


exports.findUserVote = function (req, res) {
    const {userId} = req.params;

    Vote.findOne({UserKey: userId})
    .then(doc => {
        // The if-else may be unnecessary
        if (!doc) {
            res.send({
                doc: null
            });
        }
        else {
            res.send({
                doc,
            })
        }

    })
    .catch(err => {
        res.status(500).send("Error: " + err);
    })
}

exports.getPriceVotes = function (req, res) {
    const {priceId} = req.params;
    // TODO

}

exports.getVotesOfUser = function (req, res) {
    // TODO
}
exports.getAll = function (req, res) {
    // TODO
}
