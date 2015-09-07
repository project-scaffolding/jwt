var port = process.env.PORT || 3000;
var environment = process.env.NODE_ENV || 'development';

var config = {
    port: port,
    environment: environment,
    tokenSecret: 'zaqwsxcderfvbgt',
    mongodb: 'mongodb://admin:123456@ds041623.mongolab.com:41623/jwt'
};

module.exports = config;