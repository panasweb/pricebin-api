// Adding new lists should trigger stat updates in UserLog stats
const { default: mongoose } = require("mongoose");
const ProductList = require("../models/ProductList");
const User = require("../models/User");
const {
  calculateTotal, 
  addToAverage, 
  removeFromAverage,
  recalculateMonths,
  recalculateWeeks,
  roundTwoDecimals
} = require('../utils/funcs');

const db = require('../db/db')

exports.getAll = function (req, res) {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Obtener las listas de productos de todos los usuarios'
   */
  console.log("FETCH all lists");
  ProductList.find()
    .then((lists) => res.status(200).send(lists))
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Obtener una lista de producto por ObjectId'
   */
  console.log("FETCH ProductList by Id: ", req.params.id);

  ProductList.findById(req.params.id)
    .then((list) => {
      res.status(200).send(list);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.delete = async function (req, res) {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Borrar una lista de productos por ObjectId'
   */
  const {id} = req.params;
  console.log("DELETE List");

  const session = await db.startSession();

  let transactionError;
  let updatedUser;

  try {
    session.startTransaction();
    const plist = await ProductList.findById(id);

    if (!plist) {
      throw new Error("No List found");
    }

    // upate stats first, then delete
    const user = await User.findById(plist.UserKey);

    if (user) {
      // update stats of user 
      try {
        updatedUser = await updateUserLogStats(user, plist, session, true);
      }
      catch (e) {
        console.error("ERROR", e);

      }
      
    }
    else {
      console.log("No user to update stats");
    }

    await ProductList.findByIdAndDelete(id);

    await session.commitTransaction();
    console.log("Transaction committed succesfully");

  } 
  catch (e) {
    transactionError = e;
    await session.abortTransaction();
  }

  if (transactionError) {
    res.status(500).send(transactionError);
  } else {
    res.send({
      message: "Deleted product list",
      newDoc: updatedUser
    })
  }

};


exports.create = async (req, res) => {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Crear una lista de producto a nombre de ObjectId de usuario y actualizar sus estadísticas'
   */
  const {list, date, UserKey} = req.body;

  console.log("CREATE List for user with id", UserKey);

  const session = await db.startSession()  // we can use mongoose or db

  let transactionError;
  let resultProductList;

  try {
    session.startTransaction();

    const user = await User.findById(UserKey, null, {session});

    if (!user) {
      throw new Error('User not found');
    }

    console.log("Found user", user.email);

    // create product list for user
    let {total} = req.body;
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
  
    resultProductList = await productList.save({session});
    console.log("Saved product list succesfully");

    let {skipUpdate} = req.body;

    if (!skipUpdate) {
      await updateUserLogStats(user, productList, session, false);
      console.log("Updated user log succesfully");
    } else {
      console.log("Skipping user log update...");
    }

    // lastly, commit operations
    await session.commitTransaction();
    console.log('Transaction commited succesfully');

  } catch (error) {
    transactionError = error;
    await session.abortTransaction();
  }

  session.endSession();

  if (transactionError) {
    res.status(400).send("Error inserting list: " + transactionError);
  } else {
    res.send({
      message:"Inserted product list succesfully",
      newDoc: resultProductList,
    })
  }
}


exports.getListsOfUser = function(req, res) {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Obtener las listas de productos de un usuario por ObjectId'
   */
  const {userId} = req.params;
  // find all lists with UserKey = userId;
  ProductList.find({UserKey:userId}).sort({date: -1})  // newest to oldest
  .then((lists) => res.status(200).send(lists))
  .catch((err) => res.status(500).send("Error: " + err))
}


const updateUserLogStats = async (userInstance, listInstance, session, isDeletion) => {
  /* Adds or Deletes a List from UserLog and updates stats accordingly */
  
  console.log("Updating user log of:", userInstance.email);
  const {UserLog} = userInstance;

  let amount = listInstance.total;

  // update global total and number of lists
  let globalTotal
  let listAverage
  let nLists  

  if (isDeletion) {
    console.log("is deletion");
    globalTotal = UserLog.globalTotal - amount;
    listAverage = removeFromAverage(UserLog.listAverage, UserLog.nLists, amount)
    nLists = UserLog.nLists - 1;
  } 
  else {
    console.log("is addition");
    globalTotal = UserLog.globalTotal + amount;
    listAverage = addToAverage(UserLog.listAverage, UserLog.nLists, amount);
    nLists = UserLog.nLists + 1;
  } 
  

  let startDate = new Date(UserLog.start);

  // Update n of Months and Monthly Average
  let nMonths = recalculateMonths(startDate)
  let monthlyAverage = roundTwoDecimals(globalTotal / nMonths) // truncate to 2 decimals

  // Update n of Weeks and Weekly Average
  let nWeeks = recalculateWeeks(startDate)
  let weeklyAverage = roundTwoDecimals(globalTotal / nWeeks) // truncate to 2 decimals

  const updatedLog = {
    nLists,
    listAverage,
    nMonths,
    monthlyAverage,
    nWeeks,
    weeklyAverage,
    startDate,
    globalTotal
  }
  
  console.log("Updated Log");
  console.dir(updatedLog);

  userInstance.UserLog = updatedLog;

  return userInstance.save({session});
}


