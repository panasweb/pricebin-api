
const { TYPES } = require('../constants'); 
const Product = require('../models/Product');
const { resetVotes } = require('./votesController')
const TYPES_SET = new Set(TYPES);


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

  const { name, brand, type, prices, img } = req.body;
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
    console.error("Validation error", e);
    res.status(400).send("Validation Error:" + e);
  }

  product.save()
    .then(
      (newDoc) => res.send({
        message: "Created succesfully",
        newDoc: newDoc,
      }))
    .catch(
      (err) => {
        console.error("Server error " + err);
        res.status(500).send("Mongoose / MongoDB Error:" + err);
      }
    )
}

/* PRODUCT-PRICE CRUD */

exports.addPrice = async function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Registrar un precio de un producto por ObjectId'
   */
  const { productId, price } = req.body;
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

exports.updatePrice = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Actualizar el precio de un producto en una tienda, dado el nuevo monto y los ObjectId de producto y precio'
   */
  const { productId, priceId, newAmount } = req.body;
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

exports.removePrice = function(req, res) {
  // Needs to be admin authenticated;
  const {productId, priceId} = req.body;
  console.log("DELETE Price")

  Product.findOneAndUpdate(
    { "_id": productId },
    { 
        "$pull": {
          "prices": {"_id": priceId}
        }
    })
    .then(async (oldDoc) => {
      await resetVotes(priceId);
      res.send({
        message: "Deleted price succesfully",
        newDoc: oldDoc, // returns previous doc
      });
    })
    .catch(err => {
      console.log("Something went wrong", err);
      res.status(500).send(err);
    })
}


exports.findProductsByName = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Buscar productos por nombre (regex) y `type` opcional'
   */
  const { name, type } = req.body;

  let query;
  if (type) {
    /*  && TYPES_SET.has(type) */
    query = { name: { $regex: name, $options: 'i' }, type:type }
  } else {
    query = { name: { $regex: name, $options: 'i' } }
  }

  console.log("Query:", query);

  Product.find(query)
    .then(products => {
      res.status(200).send(products);
    })
    .catch(err => {
      console.error("Find By Name Error", err);
      res.status(500).send(err);
    })
}

exports.findProductsByNameAndBrand = function (req, res) {
  /*
   * #swagger.tags = ['Product']
   * #swagger.description = 'Encontrar un producto por nombre y Marca'
   */
  const { productName, brandName } = req.body;

  Product.find({
    name: { $regex: productName, $options: 'i' },
    brand: { $regex: brandName, $options: 'i' }
  })
    .then(products => {
      res.status(200).send(products);
    })
    .catch(err => {
      console.error("Find By Name Error", err);
      res.status(500).send(err);
    })
}

