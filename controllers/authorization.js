const User = require('../models/User');
const {ADMIN_RANK} = require('../constants');
const SUDO_KEY = process.env.SUDO;
if (!SUDO_KEY) {
    console.log("[WARNING]: sudo key is undefined. Any sudo required routes will not work");
}

exports.adminRequired = function(req, res, next) {
    /* Careful to consider error responses in back end */
    const { UserKey } = req.body;

    if (!UserKey) {
        return res.status(401).send("No UserKey in body");
    }

    // Fetch user. Should have Admin Privileges
    User.findById(UserKey)
        .then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }
            else if (user.rank != ADMIN_RANK) {
                return res.status(401).send("Unauthorized. Admini privileges required");
            } 
            else {
                next();
            }
        })
        .catch((err) => {
            console.error("Error on Admin Check", UserKey);
            console.error(err);
            return res.status(500).send("Error [adminRequired route]: " + err)
        });
}


exports.superUserRequired = function(req, res, next) {
    const {sudo} = req.body;
    if (!sudo || sudo !== SUDO_KEY) {
        return res.status(401).send("Superuser permissions required. Use correct value in payload");
    }
    next()
}