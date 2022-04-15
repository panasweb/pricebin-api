const swaggerAutogen = require('swagger-autogen')()

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
console.log('App directory root', appDir);

const outputFile = './swagger_output.json'
const ENDPOINTS_PREFIX = '../routes/api/'
const endpointsFiles = [
    ENDPOINTS_PREFIX + 'lists.js',
    ENDPOINTS_PREFIX + 'products.js',
    ENDPOINTS_PREFIX + 'stores.js',
    ENDPOINTS_PREFIX + 'users.js',
    '../routes/index.js',
]

swaggerAutogen(outputFile, endpointsFiles)