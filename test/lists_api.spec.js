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
            try {
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

            } catch (e) {
                console.error("ERROR", e);
                throw new Error();
            }

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
            
            const user = await User.findById(UserKey);


            assert.ok(user);
            assert.equal(user.username, 'ilovepricebin');
            assert.ok(user.UserLog);
            assert.equal(user.UserLog.nLists, 1);
            assert.equal(user.UserLog.monthlyAverage, 15);
            assert.equal(user.UserLog.weeklyAverage, 15);
            assert.equal(user.UserLog.listAverage, 15);
            assert.equal(user.UserLog.nMonths, 1);
            assert.equal(user.UserLog.nWeeks, 1);
            assert.equal(user.UserLog.globalTotal, 15);

            await ProductList.findByIdAndDelete(data.newDoc._id);   

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

    describe('POST /lists/delete/:id', ()=>{
        it('should deleta a a ProductList and update UserLog', 
        async ()=>{

            const fakeUserLog = {
                nLists: 2,
                monthlyAverage: 600,
                weeklyAverage: 300,
                listAverage: 300,
                nMonths: 1,
                nWeeks: 2,
                start: Date.now(),
                globalTotal: 600
            }

            const user = await User.create({
                email: "other@user.com",
                UserLog: fakeUserLog
            });

            const fakeList = await ProductList.create({
                list: [
                    {
                        productName: 'fake',
                        storeName: 'OXXO',
                        amount: 300,
                        quantity: 1,
                    }
                ],
                total: 300,
                UserKey: user._id, 
            })
            
            const url = BASE_URL + 'delete/' + fakeList._id;
            await axios.post(url);

            const updated = await User.findById(user._id);
            // console.log("NEW USER LOG", updated.UserLog)   
            
            assert.ok(updated);
            assert.equal(updated.email, 'other@user.com');
            assert.ok(updated.UserLog);
            assert.equal(updated.UserLog.nLists, 1);
            assert.equal(updated.UserLog.monthlyAverage, 600-300);
            assert.equal(updated.UserLog.weeklyAverage, 300);
            assert.equal(updated.UserLog.listAverage, 300);
            assert.equal(updated.UserLog.nMonths, 1);
            assert.equal(updated.UserLog.nWeeks, 1);
            assert.equal(updated.UserLog.globalTotal, 600-300);         

        })
    });
})