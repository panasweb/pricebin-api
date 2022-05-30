const express = require("express");
const router = express.Router();
const vote = require("../../controllers/votesController");

/* `/votes/` PREFIX */
router.post("/", vote.create);  // vote for a price

router.post("/delete/", vote.delete);

router.get("/user/:userid/:priceid", vote.findUserVote);

router.post("/price/counts", vote.getVoteCounts);

router.get("/price/:priceid", vote.getVoteCount);


// router.get("/of/:userId", vote.getVotesOfUser);  // might not be necessary

// router.get("/", vote.getAll);

module.exports = router;
