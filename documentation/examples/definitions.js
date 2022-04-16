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