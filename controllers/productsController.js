
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

/* PRODUCT-PRICE CRUD */

exports.addPrice = async function(req, res) {
  const {productId, price} = req.body;
  try {
    const product = await Product.findById(productId);
    console.log("Add price to product:");
    console.log(product);

    product.prices.push(price);

    product.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.error("Error adding price:", err);
      res.status(500).send(err);
    })

  } catch (error) {
    console.error("Error finding product with id", productId);
    res.status(500).send(error);
  }
}

exports.updatePrice = function(req, res) {
  // Receive product ID, price ID, new amount
  const {productId, priceId, newAmount} = req.body;
  console.log("UPDATE Price", newAmount)
  
  Product.findOneAndUpdate(
    { "_id": productId, "prices._id": priceId },
    { 
        "$set": {
            "prices.$.amount": newAmount
        }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}
/*
Example request to updatePrice
{
  "productId":"624a298c8e3e8109ab1754b1",
  "priceId":"624a298c8e3e8109ab1754b2",
  "newAmount": 150
}
*/

