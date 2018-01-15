var usersService = require('../services/users'),
    jsonwebtoken = require("jsonwebtoken"),
    config = require('../../config').load(),
    controller = {};

controller.login = function(req, res) {
    usersService.login(req.body, function(err, tokens) {
        if (err) throw err;
        if (tokens) {
            res.cookie(config.token.access.cookie.name, tokens.accessToken, config.token.access.cookie.opts);
            res.cookie(config.token.refresh.cookie.name, tokens.refreshToken, config.token.refresh.cookie.opts);
            res.status(config.httpStatus.noContent).send();
        } else res.status(config.httpStatus.unauthorizedAccess).json({
            error: 'AuthenticationError',
            message: 'Bad credentials',
            reqId: req.uuid
        });
    });
};

controller.logout = function(req, res) {
    if (req.cookies && req.cookies[config.token.access.cookie.name] && req.cookies[config.token.refresh.cookie.name]) {
        jsonwebtoken.verify(req.cookies[config.token.access.cookie.name], config.token.secretKey, function(err, decode) {
            if ((err && err.name === 'TokenExpiredError') || !err) {
                var user = jsonwebtoken.decode(req.cookies[config.token.access.cookie.name]);
                usersService.logout(req.cookies[config.token.refresh.cookie.name], user.login, function(err) {
                    if (err) throw err;
                });
            }
        });
    }
    res.clearCookie(config.token.access.cookie.name);
    res.clearCookie(config.token.refresh.cookie.name);
    res.status(config.httpStatus.noContent).send();
};

controller.refreshToken = function(req, res) {
    if (req.cookies && req.cookies[config.token.access.cookie.name] && req.cookies[config.token.refresh.cookie.name]) {
        jsonwebtoken.verify(req.cookies[config.token.access.cookie.name], config.token.secretKey, function(err, decode) {
            if ((err && err.name === 'TokenExpiredError') || !err) {
                var user = jsonwebtoken.decode(req.cookies[config.token.access.cookie.name]);
                usersService.refreshLogin(req.cookies[config.token.refresh.cookie.name], user.login, function(err, tokens) {
                    if (err) throw err;
                    if (tokens) {
                        res.cookie(config.token.access.cookie.name, tokens.accessToken, config.token.access.cookie.opts);
                        res.status(config.httpStatus.noContent).send();
                    } else res.status(config.httpStatus.unauthorizedAccess).json({
                        error: 'RefreshingAuthenticationError',
                        message: 'No valid refresh token found in cookies',
                        reqId: req.uuid
                    });
                });
            } else res.status(config.httpStatus.unauthorizedAccess).json({
                error: 'RefreshingAuthenticationError',
                message: 'Bad access token in cookies',
                reqId: req.uuid
            });
        });
    } else res.status(config.httpStatus.unauthorizedAccess).json({
        error: 'RefreshingAuthenticationError',
        message: 'No access token to refresh found in cookies',
        reqId: req.uuid
    });
};

module.exports = controller;
