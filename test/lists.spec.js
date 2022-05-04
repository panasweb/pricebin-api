require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const ProductList = require('../models/ProductList')
const User = require('../models/User');

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
    quantity: 2
}

const LIST = [
    record1,
    record2,
]


let UserKey;
let ProductListId;

describe('Test ProductLists Model', () => {

    // Single db connection for every test. Dummy store and ProductList
    before(function(done) {
        this.timeout(20000);
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

            console.log("creating list...")
            const newProductList = await ProductList.create({
                list: LIST,
                total: 15.00,
                UserKey: UserKey
            })


            ProductListId = newProductList._id;

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

    // 1. CREATE
    describe('Create new ProductList', ()=>{
        it('should create a a ProductList Document without error', async ()=>{
            
            const plist = await ProductList.create({
                list: [{
                    productName: 'Milk',
                    storeName: 'Walmart',
                    amount: 100,
                    quantity: 5
                }],
                total: 500,
                UserKey:UserKey,
            });

            assert.ok(plist.date);
            assert.equal(plist.list.length, 1);
            assert.equal(plist.list[0].amount * plist.list[0].quantity, plist.total);

            await ProductList.findByIdAndDelete(plist._id);

        })
    });

    // 2. GET ALL
    describe('Get all ProductLists', ()=>{
        it('should a list with one ProductList', (done)=>{
            ProductList.find({}, function(err, results){
                assert.equal(results.length, 1);
                done()
            })
        })
    })


    // 3. VALIDATION OK
    describe('Test product list non-empty validation', ()=>{
        it('It should not allow empty plist creation', async ()=>{
            try {
                const plist = await ProductList.create({
                    list: [],
                    total: 500,
                    UserKey:UserKey,
                });  

                assert.ok(false);

            } catch (e) {
                console.log("Error did throw");
                assert.ok(e);
            }
          
        })
    })

})