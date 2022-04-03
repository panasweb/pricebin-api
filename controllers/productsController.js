
const Product = require('../models/Product');


exports.getAll = function (req, res) {
  console.log("Fetch all products");
  Product.find()
    .then((products) => res.status(200).send(products))
    .catch((err) => res.status(500).send("Error: " + err));
};


exports.getOne = function (req, res) {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = function (req, res) {
  Product.findOneAndDelete({ _id: req.params.id })
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
};

exports.create = function (req, res) {
  console.log("CREATE Product");

  const {name, brand, type, img, prices} = req.body;

  const product = new Product({
    name,
    brand,
    type,
    prices,
    img
  });

  product.save()
    .then(
        () => res.send("Created succesfully"))
    .catch(
        (err) => res.status(500).send("Server Error:" + err)
    )
}

