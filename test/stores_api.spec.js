require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const Store = require('../models/Store')
const axios = require('axios');

let storeId;

let BASE_URL = 'http://localhost:3010/stores/'

describe('Test Stores API endpoints', () => {

    before(function(done) {
        this.timeout(10000);
        const mongoDB = process.env.TESTDB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', async function(){

            const newStore = await Store.create({
                name: 'Miniso'
            })

            storeId = newStore._id;

            done()
        })
    })

    // Close db connection 
    after(async function() {
        await Store.deleteMany();
        const db = mongoose.connection
        db.close()
    })

    // 1. CREATE
    describe('POST /stores', ()=>{
        it('should create a a Store Document without error', async ()=>{
            const {data} = await axios.post(BASE_URL, {
                name: "Best Buy",
                location: [19.16, 19.16],
                branch: 'Mundo E',
                logo: 'https://www.freepnglogos.com/uploads/best-buy-png-logo/best-buy-png-logo-vector-0.png'
            });

            assert.ok(data.message);
            assert.ok(data.newDoc);
            assert.ok(data.newDoc.logo);
            assert.equal(data.newDoc.branch, 'Mundo E');
            assert.equal(data.newDoc.name, 'Best Buy');
            assert.ok(data.newDoc.location.length === 2);

        })
    });

    // // 2. GET ALL
    describe('GET /stores', ()=>{
        it('should a list with stores', async () => {
            
            const {data} = await axios.get(BASE_URL);
            assert.ok(data.length);
            assert.ok(data[0].name);
        })
    })


    // 3. FIND BY ID
    describe('Find Store by ID', ()=>{
        it('It should find and return the dummy store', async ()=>{
            let url = BASE_URL + storeId;

            const {data} = await axios.get(url);

            assert.ok(!('branch' in data));
            assert.ok(!('location' in data));
            assert.equal(data.name, 'Miniso');
    })})
    
    // 4. FIND BY NAME
    describe('Find Store by name', ()=>{
        it('It should find and return the dummy store', async ()=>{
            
            let url = BASE_URL + 'by-name';

            const {data} = await axios.post(url, {
                name: 'mini'
            });

            console.log("Results", data);

            assert.equal(data.length, 1);
            assert.equal(data[0].name, "Miniso")
    })})


})