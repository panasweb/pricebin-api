require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Product = require('../models/Product')
const Store = require('../models/Store');
const axios = require('axios');


let StoreKey;
let productId;
let priceId;

let BASE_URL = 'http://localhost:3010/products/'

describe('Test Products API endpoints', () => {

    // Single db connection for every test. Dummy store and product
    before(function(done) {
        this.timeout(10000);
        const mongoDB = process.env.TESTDB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', async function(){

            const newStore = await Store.create({
                name: '7 Eleven'
            })

            StoreKey = newStore._id;
            console.log("Store Key", StoreKey);

            const newProduct = await Product.create({
                name: 'Name',
                brand: 'Brand',
                type: 'Despensa',
                prices: [{
                    amount: 108,
                    currency: 'MXN',
                    store: '7 Eleven',
                    StoreKey: StoreKey,  
                }]
            })

            productId = newProduct._id;
            priceId = newProduct.prices[0]._id;
            console.log("Product Id", productId);

            done()
        })
        
    })

    // Close db connection 
    after(async function() {

        await Store.deleteMany();
        await Product.deleteMany();
        const db = mongoose.connection
        db.close()

    })

    // 1. CREATE
    describe('POST /products', ()=>{
        it('should create a a Product Document without error', async ()=>{
            const price = {
                amount: 100,
                currency: 'MXN',
                store: '7 Eleven',
                StoreKey: StoreKey,
            }
            
            const product = {
                name: 'Ejemplo',
                brand: 'Ejemplo',
                type: 'Farmacia',
                prices: [price]
            };

            const {data} = await axios.post(BASE_URL, product);

            assert.ok(data.message);
            assert.ok(data.newDoc);

        })
    });

    // // 2. GET ALL
    describe('GET /products', ()=>{
        it('should a list with one product', async () => {
            
            const {data} = await axios.get(BASE_URL);
            assert.ok(data.length);
        })
    })


    // 3. FIND BY ID
    describe('Find Product by ID', ()=>{
        it('It should find and return the dummy product', async ()=>{

            let url = BASE_URL + productId;

            const {data} = await axios.get(url);

            assert.equal(data.prices.length, 1);
            assert.equal(data.prices[0].store, "7 Eleven");
            assert.ok(data.prices[0].date);
            assert.equal(data.name, "Name");
            assert.equal(data.brand, "Brand");
            assert.equal(data.type, "Despensa");
        })
    })

    // 4. ADD PRICE
    describe('Add new price to dummy product', ()=>{
        it('Should add a new price to dummy product', async ()=>{

            let url = BASE_URL + 'add-price';
            
            const price = {
                amount: 299,
                currency: 'MXN',
                store: '7 Eleven',
                StoreKey: StoreKey,
            }

            const {data} = await axios.post(url, {
                productId,
                price
            });

            assert.ok(data.message);
            assert.ok(data.newDoc);

            assert.equal(data.newDoc.prices.length, 2);
            assert.equal(data.newDoc.prices[1].store, "7 Eleven");
            assert.equal(data.newDoc.prices[1].amount, 299);
        })
    });


    // 5. UPDATE PRICE
    describe('Add new price to dummy product', ()=>{
        it('Should add a new price to dummy product', async () => {

            const url = BASE_URL + 'update-price';
            const newAmount = 80.15;

            assert.ok(priceId);

            const {data} = await axios.post(url, {
                productId,
                priceId,
                newAmount
            });

            assert.ok(data.message);
            assert.ok(data.newDoc);
            
            const newDoc = await Product.findById(productId);
            console.log("Updated doc", newDoc);

            assert.equal(newDoc.prices.length, 2)
            assert.equal(newDoc.prices[0].amount, 80.15)
        })
    });

})