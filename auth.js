var User = require('./models/user');
var config = require('./config/config');
var jwt = require('jwt-simple');

module.exports = function(req, res, next) {

    var token = req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, config.tokenSecret);

            if (decoded.exp <= Date.now()) {
                return res.send(400, { message: 'Access token has expired' });
            }

            User.findById(decoded.sub)
                .exec()
                .then(function(user) {
                    if (!user) {
                        return res.send(404, { message: 'User not found' });
                    }
                    req.user = user;
                    next();
                }, function() {
                    return res.send(500, { message: 'Internal Servert Error' });
                });
        } catch (err) {
            return res.send(401, { message: 'Not authorized' });
        }
    } else {
        return res.send(401, { message: 'Not authorized' });
    }
};
