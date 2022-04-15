// Adding new lists should trigger stat updates in UserLog stats
const ProductList = require("../models/ProductList");
const User = require("../models/User");
const {calculateTotal, addToAverage, removeFromAverage} = require('../utils/funcs');

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


exports.create = async function(req, res) {
    const {list, date, UserKey} = req.body;
    let {total} = req.body;

    console.log("CREATE List for user with id", UserKey);

    let user;

    try {
      user = await User.findById(UserKey);
    } catch (error) {
      res.status(500).send("Error: " + error);
    }

    if (!user) {
      res.status(404).send(`User ${UserKey} not found`);
    }

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
    .then(async (result) => {
      console.log("product list save result", result);

      // update user's stats
      await updateUserLogStats(user, productList);

      res.send("Created product list succesfully")
      
    })
    .catch(
        (err) => res.status(500).send("Server Error:" + err)
    )
    
}

exports.getListsOfUser = function(req, res) {
  const {userId} = req.params;
  // find all lists with UserKey = userId;
  ProductList.find({UserKey:userId})
  .then((lists) => res.status(200).send(lists))
  .catch((err) => res.status(500).send("Error: " + err))
}


/**
 * List operations
 * - On Add,Delete: update total, update averages
 * - restart date and update averages
 * 
 */

const updateUserLogStats = async (userInstance, listInstance) => {
  console.log("Update user", userInstance.email);

  const updatedLog = {...userInstance.UserLog};  // copy

  // Update List Average
  let amount = listInstance.total;
  updatedLog.listAverage = addToAverage(updatedLog.listAverage, updatedLog.nLists, amount)
  updatedLog.nLists += 1;

  // Update n of Months and Monthly Average
  

  // Update n of Weeks and Weekly Average
    

}