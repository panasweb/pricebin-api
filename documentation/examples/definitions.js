// Examples used by swagger.js

exports.USER_GET = {
    _id: "6259bda3de3c1b216355cdd2",
    email: "example@gmail.com",
    username: "exampleguy123",
    rank: 1,
    points: 1180,
    UserLog: {
        start: "2022-04-15T22:53:47.244Z",
        nLists: 4,
        monthlyAverage: 500,
        weeklyAverage: 500,
        listAverage: 125,
        nMonths: 1,
        nWeeks: 1,
        globalTotal: 500
    }
}

exports.CREATE_USER = {
    $email: "example@gmail.com",
    username: "exampleguy123"
}

exports.PRODUCT_PRICE_UPDATE = {
    $productId:"624a298c8e3e8109ab1754b1",
    $priceId:"624a298c8e3e8109ab1754b2",
    $newAmount: 150
  }

exports.RATE_REQUEST = {
    $toCurrency:"USD",
    $fromCurrency:"MXN",
    amount:200
}

exports.CREATE_LIST = {
    $list: [
      {
        "productName":"A",
        "storeName":"store A",
        "brandName":"X",
        "amount":11,
        "quantity":10
      },
      {
        "productName":"B",
        "storeName":"store A",
        "brandName":"X",
        "amount":2,
        "quantity":170
      }
    ],
    date: "2020-03-21",
    $UserKey: "627e6a8c06b95c1fdbec8a0d",
    $total: "450"
  }