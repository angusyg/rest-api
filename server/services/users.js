var jwt = require('jsonwebtoken'),
    userModel = require('../models/users'),
    config = require('../../config').load(),
    uuidv4 = require('uuid/v4'),
    refreshTokens = new Map(),
    service = {};

service.login = function(infos, callback) {
    userModel.getByLogin(infos.login, function(err, user) {
        if (err) return callback(err);
        if (!user) return callback(null, null);
        userModel.comparePassword(infos.password, user.hash, function(err, isMatch) {
            if (err) return callback(err);
            var refreshToken = uuidv4();
            refreshTokens.set(refreshToken, user.login);
            callback(null, {
                refreshToken: refreshToken,
                accessToken: jwt.sign({
                    login: user.login,
                    role: user.role,
                    exp: Math.floor(Date.now() / 1000) + config.token.access.expirationTime,
                }, config.token.secretKey)
            });
        });
    });
};

service.logout = function(refreshToken, login, callback) {
    if (refreshTokens.get(refreshToken) === login) refreshTokens.delete(refreshToken);
    callback(null);
};

service.refreshLogin = function(refreshToken, login, callback) {
    if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == login)) {
        userModel.getByLogin(login, function(err, user) {
            if (err) return callback(err);
            if (!user) return callback(null, null);
            callback(null, {
                accessToken: jwt.sign({
                    login: user.login,
                    role: user.role,
                    exp: Math.floor(Date.now() / 1000) + config.token.access.expirationTime,
                }, config.token.secretKey)
            });
        });
    } else callback(null, null);
};

module.exports = service;
