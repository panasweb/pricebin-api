require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const ProductList = require('../models/ProductList')
const User = require('../models/User');
const axios = require('axios');

const record1 = {
    productName: 'Peanuts',
    brandName: 'Sunny',
    storeName: '7 Eleven',
    amount: 1.25,
    quantity: 2
}

const record2 = {
    productName: 'Coke Zero',
    brandName: 'Coca-Cola',
    storeName: '7 Eleven',
    amount: 12.5,
    quantity: 1
}

const LIST = [
    record1,
    record2,
]

let UserKey;
let productListId;

let BASE_URL = 'http://localhost:3010/lists/'

describe('Test ProductLists API endpoints', () => {

    // Single db connection for every test. Dummy store and product
    before(function(done) {
        this.timeout(10000);
        const mongoDB = process.env.TESTDB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', async function(){

            const newUser = await User.create({
                email: 'user@user.com',
                username: 'ilovepricebin'
            })


            UserKey = newUser._id;

            const newProductList = await ProductList.create({
                list: LIST,
                total: 15.00,
                UserKey: UserKey
            })


            productListId = newProductList._id;

            done()
        })
        
    })

    // Close db connection 
    after(async function() {

        await User.deleteMany();
        await ProductList.deleteMany();
        const db = mongoose.connection
        db.close()

    })

    // 1. CREATE AND UPDATE USERLOG
    describe('POST /lists', ()=>{
        it('should create a a ProductList Document without error and update UserLog', 
        async ()=>{
            const body = {
                list: LIST,
                date: new Date('1999-07-02'),
                UserKey: UserKey,
            }

            const {data} = await axios.post(BASE_URL, body);

            assert.ok(data.message);
            assert.ok(data.newDoc);
            assert.equal(data.newDoc.total, 15);
            assert.equal(data.newDoc.date, (new Date('1999-07-02')).toISOString());
            

            await ProductList.findByIdAndDelete(data.newDoc._id);
            // User validation next
        })
    });

    // // 2. GET ALL
    describe('GET /lists', ()=>{
        it('should return a list with one plist', async () => {
            
            const {data} = await axios.get(BASE_URL);
            assert.equal(data.length, 1);
        })
    })


    // 3. FIND BY USER ID
    describe('Find ProductList of a User', ()=>{
        it('It should find and return a single plist', async ()=>{

            let url = BASE_URL + 'of/' + UserKey;

            const {data} = await axios.get(url);

            assert.equal(data.length, 1);


        })
    })

    // 4. DELETE A LIST AND UPDATE USERLOG

    // TODO
})