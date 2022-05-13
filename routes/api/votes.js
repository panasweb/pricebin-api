const express = require("express");
const router = express.Router();
const vote = require("../../controllers/votesController");

/* `/votes/` PREFIX */

router.post("/price/vote", vote.create);

router.post("/delete/vote", vote.delete);

router.get("/user/:userid/:priceid", vote.findUserVote);

// router.post("/delete/:id", vote.delete);


router.post("/price/counts", vote.getVoteCounts);

router.get("/price/:priceid", vote.getVoteCount);


// router.get("/of/:userId", vote.getVotesOfUser);  // might not be necessary

// router.get("/", vote.getAll);

module.exports = router;
