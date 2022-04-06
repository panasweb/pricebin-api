const User = require('../models/User');

exports.getAll = function (req, res) {
  console.log("FETCH all users");
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
  console.log("FETCH User by Id: ", req.params.id);

  User.findById(req.params.id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = function (req, res) {
  User.findOneAndDelete({ _id: req.params.id })
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
};

exports.findUserByUsername = function (req, res) {
  const { username } = req.body;
  console.log("FIND user by username", req.body);

  User.findOne({ name: username })
    .then(user => res.send(user))
    .catch(err => res.status(500).send("Error:" + err));
}

exports.findUserByEmail = function (req, res) {
  const { email } = req.body;
  console.log("FIND user by email", req.body);

  User.findOne({ email })
    .then(user => res.send(user))
    .catch(err => res.status(500).send("Error:" + err));
}

exports.create = function (req, res) {
  console.log("CREATE User");

  const { username, email } = req.body;

  const user = new User({
    username,
    email  
  })

  user.save()
    .then(
      () => res.send("Created user succesfully"))
    .catch(
      (err) => res.status(500).send("Server Error:" + err)
    )
}


/**
 * List operations
 * - On Add,Delete: update total, update averages
 * - restart date and update averages
 * 
 */