const User = require('../models/User');
const {ADMIN_RANK} = require('../constants');

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