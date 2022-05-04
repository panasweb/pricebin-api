const Store = require('../models/Store');

exports.getAll = function (req, res) {
  /*
   * #swagger.tags = ['Store']
   * #swagger.description = 'Obtener la lista de todas las tiendas en Pricebin'
   */
  console.log("FETCH all stores");
  Store.find()
    .then((stores) => res.status(200).send(stores))
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
  /*
   * #swagger.tags = ['Store']
   * #swagger.description = 'Obtener una tienda por ObjectId'
   */
  console.log("FETCH Store by Id: ", req.params.id);

  Store.findById(req.params.id)
    .then((store) => {
      res.status(200).send(store);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.findStoreByName = function (req, res) {
  // #swagger.tags = ['Store']
  // #swagger.description = 'Obtener una tienda por su nombre omitiendo mayus y minus'
  const { name } = req.body;
  console.log("FIND store by name", req.body);
  let nameRe = new RegExp(name, 'i');  // case insensitive

  Store.find({ name: nameRe })
    .then(stores => res.send(stores))
    .catch(err => res.status(500).send("Error:" + err));
}


exports.create = function (req, res) {
  // #swagger.tags = ['Store']
  // #swagger.description = 'Crear una tienda, con mínimo proporcionar el nombre'

  const { name, location, branch, logo } = req.body;

  const store = new Store({
    name, location, branch, logo
  })

  store.save()
    .then(
      (newDoc) => res.send({
        message: "Created store succesfully",
        newDoc: newDoc,
      }))
    .catch(
      (err) => res.status(500).send("Server Error:" + err)
    )
}

exports.delete = function (req, res) {
  /*
   * #swagger.tags = ['Store']
   * #swagger.description = 'Borrar una tienda por ObjectId'
   */

  Store.findOneAndDelete({ _id: req.params.id })
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
};



