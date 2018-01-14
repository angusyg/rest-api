var bcrypt = require('bcrypt'),
    data = require('../../users.json'),
    config = require('../../config').load(),
    model = {};

model.getByLogin = function(login, callback) {
    callback(null, data.users.find(function(user) {
        return user.login === login;
    }));
};

model.hashPassword = function(password, callback) {
    bcrypt.genSalt(config.token.saltFactor, function(err, salt) {
        if (err) return callback(err);
        // hash the password using our new salt
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) return callback(err);
            callback(null, hash);
        });
    });
};

model.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = model;