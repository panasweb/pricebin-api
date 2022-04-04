const Store = require('../models/Store');

exports.getAll = function (req, res) {
    console.log("FETCH all stores");
    Store.find()
      .then((stores) => res.status(200).send(stores))
      .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
    console.log("FETCH Store by Id: ", req.params.id);

    Store.findById(req.params.id)
      .then((store) => {
        res.status(200).send(store);
      })
      .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = function (req, res) {
    Store.findOneAndDelete({ _id: req.params.id })
      .then((deletedDoc) => {
        res.send("Deleted succesfully: " + deletedDoc);
      })
      .catch((err) => {
        res.status(500).send("Error:" + err);
      });
  };


exports.findStoreByName = function (req, res) {
  const {name} = req.body;
  console.log("FIND store by name", req.body);
  let nameRe = new RegExp(name, 'i');  // case insensitive

  Store.findOne({name: nameRe})
  .then(store => res.send(store))
  .catch(err => res.status(500).send("Error:" + err));
}


exports.create = function (req, res) {
    console.log("CREATE Store");

    const {name, location, branch, logo} = req.body;

    const store = new Store({
      name, location, branch, logo
    })

    store.save()
    .then(
        () => res.send("Created succesfully"))
    .catch(
        (err) => res.status(500).send("Server Error:" + err)
    )
}
