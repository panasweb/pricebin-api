const swaggerAutogen = require('swagger-autogen')()
const {
    USER_GET,
    CREATE_USER,
    PRODUCT_PRICE_UPDATE,
    RATE_REQUEST,
} = require('./examples/definitions')
// const { dirname } = require('path');
// const appDir = dirname(require.main.filename);
// console.log('This file path', appDir);

const outputFile = './documentation/swagger_output.json'
const ENDPOINTS_PREFIX = 'routes/api/'
const endpointsFiles = [
    // ENDPOINTS_PREFIX + 'lists.js',
    // ENDPOINTS_PREFIX + 'products.js',
    // ENDPOINTS_PREFIX + 'stores.js',
    // ENDPOINTS_PREFIX + 'users.js',
    // 'routes/index.js',
    'app.js'
]


const doc = {
    info: {
        version: "1.0.0",
        title: "PriceBin API",
        description: "API desarrollada por el equipo de <b>panasweb</b>. Documentación generada con Swagger.js"
    },
    host: "localhost:3010",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        },
        {
            "name": "ProductList",
            "description": "Endpoints"
        },
        {
            "name": "Store",
            "description": "Endpoints"
        },
        {
            "name": "Product",
            "description": "Endpoints"
        },
        {
            "name": "Conversion",
            "description": "Endpoints"
        },
        {
            "name": "Votes",
            "description": "Endpoints"
        },
        {
            "name": "CurrentList",
            "description": "Endpoints"
        },
    ],
    definitions: {
        User: USER_GET,
        CreateUser: CREATE_USER,
        UpdatePrice: PRODUCT_PRICE_UPDATE,
        GetConversionRate: RATE_REQUEST,
    }
}


// Single-time use
// swaggerAutogen(outputFile, endpointsFiles)


//If you want docs to re-generate every time you start the project: 
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../bin/www')  // project entrypoint
})
