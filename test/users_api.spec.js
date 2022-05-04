require('dotenv').config()
const mongoose = require('mongoose')
const assert = require('assert');
const User = require('../models/User')
const axios = require('axios');

let userId;

let BASE_URL = 'http://localhost:3010/users/'

describe('Test Users API endpoints', () => {

    before(function(done) {
        this.timeout(10000);
        const mongoDB = process.env.TESTDB_CONNECTION
        mongoose.connect(mongoDB, {useNewUrlParser: true})
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', async function(){

            const newUser = await User.create({
                email: 'user@user.com'
            })

            userId = newUser._id;

            done()
        })
    })

    // Close db connection 
    after(async function() {
        await User.deleteMany();
        const db = mongoose.connection
        db.close()
    })

    // 1. CREATE
    describe('POST /users', ()=>{
        it('should create a a User Document without error', async ()=>{
            const {data} = await axios.post(BASE_URL, {
                username: 'jarch',
                email: 'e@chao.mx'
            });

            assert.ok(data.message);
            assert.ok(data.newDoc);
            assert.ok(data.newDoc.UserLog);
            assert.equal(data.newDoc.username, 'jarch');
            assert.equal(data.newDoc.email, 'e@chao.mx');

        })
    });

    // // 2. GET ALL
    describe('GET /users', ()=>{
        it('should a list with users', async () => {
            
            const {data} = await axios.get(BASE_URL);
            assert.ok(data.length);
        })
    })


    // 3. FIND BY ID
    describe('Find User by ID', ()=>{
        it('It should find and return the dummy user', async ()=>{
            let url = BASE_URL + userId;

            const {data} = await axios.get(url);

            assert.equal(data.rank, 0);
            assert.equal(data.points, 0);
            assert.equal(data.email, "user@user.com");
    })})
    
    // 4. FIND BY EMAIL
    describe('Find User by email', ()=>{
        it('It should find and return the dummy user', async ()=>{
            
            let url = BASE_URL + 'by-email';

            const {data} = await axios.post(url, {
                email: 'user@user.com'
            });

            assert.ok(data);
            assert.equal(data.rank, 0);
            assert.equal(data.points, 0);
            assert.equal(data.email, "user@user.com");
    })})


})