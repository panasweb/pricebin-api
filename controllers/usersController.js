const User = require('../models/User');
const Vote = require('../models/Vote');
const ProductList = require('../models/ProductList');
const ObjectId = require('mongoose').Types.ObjectId;
const { getPokemonAvatar, favoriteFromArray } = require('../utils/funcs');
const {
  recalculateMonths,
  recalculateWeeks,
} = require('../utils/funcs');
const db = require('../db/db');

exports.getAll = function (req, res) {
  /*
   * #swagger.tags = ['User']
   * #swagger.description = 'Obtener todos los usuarios en Pricebin'
   */
  console.log("FETCH all users");
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.getOne = function (req, res) {
  /*
   * #swagger.tags = ['User']
   * #swagger.description = 'Obtener un usuario por ObjectId'
   */
  console.log("FETCH User by Id: ", req.params.id);

  User.findById(req.params.id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};

exports.findUserByUsername = function (req, res) {
  // #swagger.tags = ['User']
  // #swagger.description = 'Obtner un usuario por su username'

  const { username } = req.body;
  console.log("FIND user by username", req.body);

  User.findOne({ name: username })
    .then(user => res.send(user))
    .catch(err => res.status(500).send("Error:" + err));
}

exports.findUserByEmail = function (req, res) {
  // #swagger.tags = ['User']
  // #swagger.description = 'Obtner un usuario por su email'
  const { email } = req.body;
  console.log("FIND user by email", req.body);

  User.findOne({ email })
    .then(user => res.send(user))
    .catch(err => res.status(500).send("Error:" + err));
}

exports.create = async function (req, res) {
  // #swagger.tags = ['User']
  // #swagger.description = 'Crear un usuario'

  const { username, email } = req.body;

  const avatar = await getPokemonAvatar();
  console.log("New avi", avatar);

  const user = new User({
    username,
    email,
    avatar: avatar || undefined
  })
  
  user.save()
    .then(
      (newUser) => {
        newUser.sendVerificationLink(async (err) => {
          if (err) {
            console.log("Error sending email. Deleting user");
            await User.findByIdAndDelete(newUser._id);
            console.log("User deleted");
            return res.status(500).send("SendGrid error:" + err)
          }
          return res.send({
            message: "Created user succesfully",
            newDoc: newUser,
          })
        })
      })
    .catch(
      async (err) => {
        console.error("error creating user", err);
        return res.status(500).send("Server Error:" + err)
      }
    )
}

exports.delete = function (req, res) {
  /*
   * #swagger.tags = ['User']
   * #swagger.description = 'Borrar un usuario por ObjectId'
   */
  console.log("USER DELETE")
  User.findByIdAndDelete(req.params.id)
    .then(async (deletedUser) => {
      // delete all lists of user
      try {
        await ProductList.deleteMany({ UserKey: req.params.id });
        if (deletedUser) {
          await Vote.deleteMany({ UserKey: deletedUser.email });
        }
        res.status(200).send("Deleted user associated data.");
      }
      catch (e) {
        console.error(e);
        res.status(500).send("Error deleting user associated data:", e);
      }
    })
    .catch((err) => {
      res.status(500).send("Error deleting user:" + err);
    });
};


exports.addProduct = function (req, res) {
  /*
     * #swagger.tags = ['CurrentList']
     * #swagger.description = 'Añadir producto a Lista Actual de usuario'
     */
  var product = req.body.product
  var email = req.body.email
  console.log("producto:")
  console.log(product)
  User.findOneAndUpdate({ email: email }, { $push: { 'currentList.list': product } })
    .then((user) => {
      console.log(user.email)
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send("Error: " + err));
};


exports.deleteProduct = function (req, res) {
  /*
   * #swagger.tags = ['CurrentList']
   * #swagger.description = 'Quitar producto de la Lista Actual'
   */
  var product = req.body.product
  var email = req.body.email
  User.findOneAndUpdate({ email: email }, { $set: { 'currentList.list': { $elemMatch: { productName: product.productName, brandName: product.brandName, storeName: product.brandName } } } })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send("Error: " + err));

  // ENHANCEMENT: la lógica sea por índice en la lista
};


exports.clearCurrentList = function (req, res) {
  /*
   * #swagger.tags = ['CurrentList']
   * #swagger.description = 'Limpiar la Lista Actual de usuario'
   */
  const { email } = req.body; // should work with userid too
  console.log("CLEAR LIST FOR USER", email);

  User.findOneAndUpdate({ email }, { $set: { 'currentList.list': [] } })
    .then(user => {
      res.send({
        message: "Cleared list succesfully",
        newDoc: user,
      })
    })
    .catch(err => {
      console.log("ERROR", err);
      res.status(500)
        .send(err);
    })
}

exports.updateCurrentList = function (req, res) {
  const { email, list } = req.body;
  console.log("UPDATE LIST FOR USER", email);

  User.findOneAndUpdate({ email }, { $set: { 'currentList.list': list } })
    .then(user => {
      res.send({
        message: "Updated list succesfully",
        newDoc: user,
      })
    })
    .catch(err => {
      console.log("ERROR", err);
      res.status(500)
        .send(err);
    })
}


exports.saveCurrentList = async function (req, res, next) {
  /*
   * #swagger.tags = ['CurrentList']
   * #swagger.description = 'Guardar la Lista Actual al historial del usuario'
   */

  const { UserKey } = req.body;

  // 1. get user
  // 2. get currentlist of user. if no list, return
  // 3. send req data to next() : list, date, UserKey

  try {
    const user = await User.findById(UserKey, null, { session });

    if (!user) {
      throw new Error('User not found');
    }

    // Get Current List
    const list = user.currentList?.list;
    if (!list || list.length == 0) {
      throw new Error("There is no current list")
    }

    const date = Date.now();

    req.list = list;
    req.date = date;
    next()
  }
  catch (error) {

    res.status(500).send("Error getting current list: " + error);
  }

}

exports.getCoolStats = async function (req, res) {
  const { UserKey } = req.body;
  // Get favorite store:
  // 1. fetch all product lists and unrap list array, group by storeName, get count, sort, return max
  const userId = ObjectId(UserKey);

  try {
    const storeNameCounts = await ProductList.aggregate([
      { $match: { UserKey: userId } },
      { $unwind: "$list" },
      {
        $group: {
          _id: "$list.storeName",
          count: { $sum: 1 }
        }
      }
    ]).exec();

    // console.log(storeNameCounts);

    const favStore = storeNameCounts.length ? favoriteFromArray(storeNameCounts) : null;  // return _id of item with max count
    console.log("Favorite store", favStore);

    const productNameCounts = await ProductList.aggregate([
      { $match: { UserKey: userId } },
      { $unwind: "$list" },
      {
        $group: {
          _id: "$list.productName",
          count: { $sum: 1 }
        }
      }
    ]).exec();

    // console.log(productNameCounts);

    const favProduct = productNameCounts.length ? favoriteFromArray(productNameCounts) : null;  // return _id of item with max count
    console.log("Favorite product", favProduct);

    return res.status(200).send({
      favStore,
      favProduct
    });

  } catch (e) {
    console.error("getCoolStats error", e);
    return res.status(500).send(e);
  }

}

exports.recalculateUserStats = async function (req, res) {
  /*
   * #swagger.tags = ['User']
   * #swagger.description = 'Hacer el cómputo desde cero de UserLog'
   */

  const { UserKey } = req.body;

  let _user;
  try {
    _user = await User.findById(UserKey);
  }
  catch (e) {
    console.error("Error searching for User", UserKey);
    console.error(e);
    return res.status(500).send(e);
  }

  if (!_user) {
    return res.status(404).send("User not found", UserKey);
  }

  try {
    let nLists, nMonths, nWeeks, monthlyAverage, listAverage, globalTotal;
    nLists = await ProductList.countDocuments({ UserKey });

    console.log("User.UserLog.start", _user.UserLog.start)
    nMonths = recalculateMonths(_user.UserLog.start);
    nWeeks = recalculateWeeks(_user.UserLog.start);

    /* AGGREGATIONS */
    const _UserKey = ObjectId(UserKey);

    const monthAverages = await ProductList.aggregate([
      { $match: { UserKey: _UserKey } },  // months gte to UserLog.start
      {
        $group: {
          _id: { $dateToString: { "date": "$date", "format": "%Y-%m" } },
          average: { $avg: '$total' }
        }
      }
    ]).exec();

    // Average over averages
    console.log(monthAverages);
    let sum = 0
    monthAverages.forEach(o => {
      sum += o.average;
    })

    monthlyAverage = (sum / (monthAverages.length || 1));

    const listAvgQuery = await ProductList.aggregate([
      { $match: { UserKey: _UserKey } },
      { $group: { _id: null, average: { $avg: '$total' } } },
    ]).exec();

    listAverage = listAvgQuery[0].average;

    const globalTotalQuery = await ProductList.aggregate([
      { $match: { UserKey: _UserKey } },
      { $group: { _id: null, sum: { $sum: '$total' } } },
    ]);
    globalTotal = globalTotalQuery[0].sum;

    weeklyAverage = globalTotal / nWeeks;  // from UserLog.start

    const newUserLog = {
      nLists,
      nMonths,
      nWeeks,
      listAverage,
      monthlyAverage,
      globalTotal,
      weeklyAverage,
      start: _user.UserLog.start,
    }

    /* console.log("PREV UserLog")
    console.log(_user.UserLog)
    console.log("NEW UserLog")
    console.log(newUserLog);   */

    _user.UserLog = newUserLog;
    await _user.save();

  }
  catch (e) {
    console.error("Error recalculating UserLog", e);
    return res.status(500).send(e);
  }

  res.status(200).send("Recalculated succesfully");

}


exports.resendMail = async function(req, res) {

  const { UserKey } = req.body;
  if (!UserKey) return res.status(400).send("Missing UserKey in payload");

  // Recipient must exist in Pricebin
  try {
    const _user = await User.findById(UserKey);

    if (_user.verified && _user.verified === true) {
      return res.status(200).send("User is already verified");
    }

    // delete previous token
    await _user.deleteOldToken();

    // resend mail
    await _user.sendVerificationLink(async (err) => {
      if (err) {
        return res.status(500).send("SendGrid error on resend:" + err)
      }
      return res.send({
        message: "Email resent succesfully",
      })
    })
  }
  catch (e) {
    console.error("Error on resendMail controller", e)
    return res.status(500).send(e);
  }

}

