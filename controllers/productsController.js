
const Product = require('../models/Product');
const {resetVotes} = require('./votesController')

exports.getAll = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Obtener todos los productos enlistados en Pricebin'
   */
  console.log("Fetch all products");
  Product.find()
    .then((products) => res.status(200).send(products))
    .catch((err) => res.status(500).send("Error: " + err));
};


exports.getOne = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Obtener un producto por ObjectId'
   */
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Borrar un producto por ObjectId'
   */
  Product.findOneAndDelete({ _id: req.params.id })
    .then(async (deletedDoc) => {
      await resetVotes(req.params.id);
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
};

exports.create = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Registrar un nuevo producto con o sin lista de precios'
   */
  console.log("CREATE Product");

  const {name, brand, type, prices, img} = req.body;
  let product;

  try {
    product = new Product({
      name,
      brand,
      type,
      prices,
      img
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  product.save()
    .then(
        (newDoc) => res.send({
          message: "Created succesfully",
          newDoc: newDoc,
        }))
    .catch(
        (err) => {
          console.error(err);
          res.status(500).send("Server Error:" + err);
        }
    )
}

/* PRODUCT-PRICE CRUD */

exports.addPrice = async function(req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Registrar un precio de un producto por ObjectId'
   */
  const {productId, price} = req.body;
  try {
    const product = await Product.findById(productId);
    console.log("Add price to product:");
    console.log(product);

    product.prices.push(price);

    product.save()
    .then(newDoc => {
      res.send({
        message: "Added new price succesfully",
        newDoc: newDoc
      });
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
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Actualizar el precio de un producto en una tienda, dado el nuevo monto y los ObjectId de producto y precio'
   */
  const {productId, priceId, newAmount} = req.body;
  console.log("UPDATE Price", newAmount)
  
  Product.findOneAndUpdate(
    { "_id": productId, "prices._id": priceId },
    { 
        "$set": {
            "prices.$.amount": newAmount
        }
    })
    .then(async (oldDoc) => {
      await resetVotes(priceId);
      console.log("Updated doc prices", oldDoc.prices);
      res.send({
        message: "Updated price succesfully",
        newDoc: oldDoc, // returns previous doc
      });
    })
    .catch(err => {
      res.status(500).send(err);
    })
}


exports.findProductsByName = function(req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Buscar productos por nombre (regex)'
   */
  const {name} = req.body;

  Product.find({name: {$regex: name, $options: 'i'}})
  .then(products => {
    res.status(200).send(products);
  })
  .catch(err => {
    console.error("Find By Name Error", err);
    res.status(500).send(err);
  })
}

