var express = require('express');
var app = require('./config/express');
var config = require('./config/config');
require('./config/mongoose')();

var User = require('./models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
var auth = require('./auth');

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.post('/api/login', function(req, res, next) {
    User.findOne({email: req.body.email, password: req.body.password})
        .exec()
        .then(function(user) {

            if (!user) {
                return res.send(401, { message: 'Not authorized' });
            }

            var tokenSecret = config.tokenSecret;
            var expires = moment().add('minutes', 1).valueOf();
            var payload = {
                iss: req.hostname,
                sub: user._id,
                exp: expires
            };

            var token = jwt.encode(payload, tokenSecret);

            res.send({
                email: user.email,
                token: token,
                expires: expires
            });
        }, function() {
            return res.send(401, { message: 'Not authorized' });
        });
});

app.post('/api/registration', function(req, res) {

});

app.get('/api/users', [auth], function(req, res, next) {
    User.find().exec().then(function(users) {
        res.send(users);
    }, function(error) {
        res.send(error);
    });
});

app.get('/api/users/:id', function(req, res, next) {
    User.findById(req.params.id).exec().then(function(user) {
        res.send(user);
    }, function(error) {
        res.status(404).send(error);
    });
});

app.post('/api/users/', function(req, res, next) {
    var model = new User(req.body);
    model.save().then(function(user) {
        res.send(user);
    }, function(error) {
        res.send(error);
    });
});

app.put('/api/users/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body).exec().then(function(user) {
        res.send(user);
    }, function(error) {
        res.send(error);
    });
});

app.delete('/api/users/:id', function(req, res, next) {
    User.remove({_id: req.params.id}).exec().then(function(user) {
        res.send(user);
    }, function(error) {
        res.send(error);
    });
});

// // error handlers
// // development error handler
// // will print stacktrace
// if (config.environment === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


app.listen(config.port, function() {
    console.log('Express server listening on port ' + config.port);
    console.log('env = ' + config.environment +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});