require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Product = require('../models/Product')
const Store = require('../models/Store');
/*
Crear un producto, 
listar todos los productos, 
añadir producto con 1 precio, 
encontrar producto por id, 
encontrar producto por nombre y marca, 
eliminar producto.
*/

let StoreKey;
let productId;

describe('Test Products Model', () => {

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
    describe('Create new product', ()=>{
        it('should create a a Product Document without error', async ()=>{
            const price = {
                amount: 100,
                currency: 'MXN',
                store: '7 Eleven',
                StoreKey: StoreKey,
            }
            
            const product = await Product.create({
                name: 'Ejemplo',
                brand: 'Ejemplo',
                type: 'Farmacia',
                prices: [price]
            });

            assert.equal(product.prices.length, 1);
            assert.equal(product.prices[0].store, "7 Eleven");
            assert.ok(product.prices[0].date);
            assert.equal(product.name, "Ejemplo");
            assert.equal(product.brand, "Ejemplo");
            assert.equal(product.type, "Farmacia");

            await Product.findByIdAndDelete(product._id);

        })
    });

    // 2. GET ALL
    describe('Get all products', ()=>{
        it('should a list with one product', (done)=>{
            Product.find({}, function(err, results){
                assert.equal(results.length, 1);
                done()
            })
        })
    })


    // 3. FIND BY ID
    describe('Find Product by ID', ()=>{
        it('It should find and return the dummy bike', async ()=>{
            const product = await Product.findById(productId);
            assert.ok(product);
            assert.equal(product.prices[0].amount, 108);
        })
    })

})