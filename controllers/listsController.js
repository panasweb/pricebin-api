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

exports.delete = function (req, res) {
  /*
   * #swagger.tags = ['ProductList']
   * #swagger.description = 'Borrar una lista de productos por ObjectId'
   */
  ProductList.findOneAndDelete({ _id: req.params.id })
    .then((deletedDoc) => {
      res.send("Deleted succesfully: " + deletedDoc);
    })
    .catch((err) => {
      res.status(500).send("Error:" + err);
    });
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
  
    await productList.save({session});
    console.log("Saved product list succesfully");

    let {skipUpdate} = req.body;

    if (!skipUpdate) {
      await updateUserLogStats(user, productList, session);
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
    res.send("Inserted product list succesfully")
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


/*
 * List operations
 * - On Add,Delete: update total, update averages
 * - restart date and update averages
 * 
 */


const updateUserLogStats = async (userInstance, listInstance, session) => {
  // Use direct assignment and .save()
  console.log("Updating user log of:", userInstance.email);
  const {UserLog} = userInstance;

  let amount = listInstance.total;

  let globalTotal = UserLog.globalTotal + amount;
  // Update List Average
  let listAverage = addToAverage(UserLog.listAverage, UserLog.nLists, amount)
  let nLists  = UserLog.nLists + 1;

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

// ========= DEPRECATED

const createDEPRECATED = async function(req, res) {
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
    let response = await updateUserLogStats(user, productList);
    if (response.ok){
      res.send("Created product list succesfully")
    } else {
      res.status(401).send("Error updating log:" +  response.error);
    }
    
  })  // NOTE: we could instead do a double-chained then()
  .catch(
      (err) => res.status(500).send("Server Error:" + err)
  )
  
}
