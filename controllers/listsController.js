// Adding new lists should trigger stat updates in UserLog stats
const ProductList = require("../models/ProductList");


exports.getAll = function (req, res) {
  console.log("FETCH all lists");
  ProductList.find()
    .then((lists) => res.status(200).send(lists))
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
  console.log("FETCH ProductList by Id: ", req.params.id);

  ProductList.findById(req.params.id)
    .then((list) => {
      res.status(200).send(list);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = function (req, res) {
  ProductList.findOneAndDelete({ _id: req.params.id })
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
};


exports.create = function(req, res) {
    const {list, date, UserKey} = req.body;
    let {total} = req.body;

    console.log("CREATE List for user with id", UserKey);

    if (!total) {
      // calculate total
      total = calculateTotal(list);
    }
  
    const productList = new ProductList({
      list,
      date,
      total,
      UserKey
    });
  
    productList.save()
      .then(
          () => res.send("Created product list succesfully"))
      .catch(
          (err) => res.status(500).send("Server Error:" + err)
      )
}