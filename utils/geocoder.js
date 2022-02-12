const nodegeocoder = require('node-geocoder');

const options = {
    provider : 'mapquest',
    httpAdapter: 'https',
    apiKey: 'gD3mT0JhmmjkmuaSRXYTJAGKny3PX5Wl',
    formatter: null
}

const geocoder = nodegeocoder(options);

module.exports = geocoder;