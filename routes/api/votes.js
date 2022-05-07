const express = require("express");
const router = express.Router();
const vote = require("../../controllers/votesController");

/* `/votes/` PREFIX */
router.post("/", vote.create);

router.post("/delete/:id", vote.delete);

router.get("user/:userid/:voteid", vote.findUserVote);

router.get("price/:priceid", vote.getVoteCount);

// router.get("/of/:userId", vote.getVotesOfUser);  // might not be necessary

// router.get("/", vote.getAll);

module.exports = router;
