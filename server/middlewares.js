var jsonwebtoken = require("jsonwebtoken"),
    logger = require('./helpers/logger').server,
    uuidv4 = require('uuid/v4'),
    config = require('../config').load(),
    middlewares = {};

// extract user from JWT Token sent in cookie
middlewares.loginRequired = function(req, res, next) {
    if (req.cookies && req.cookies[config.token.access.cookie.name]) {
        jsonwebtoken.verify(req.cookies[config.token.access.cookie.name], config.token.secretKey, function(err, decode) {
            if (err) res.status(config.httpStatus.unauthorizedAccess).json({
                message: err.name + ' - ' + err.message,
                reqId: req.uuid
            });
            else {
                req.user = decode;
                next();
            }
        });
    } else res.status(config.httpStatus.unauthorizedAccess).json({
        message: 'No access token found',
        reqId: req.uuid
    });
};

// check role from user to grant access
middlewares.requireRole = function(roles) {
    return function(req, res, next) {
        if (req.user && roles.some(function(role) {
                return role === req.user.role;
            })) next();
        else res.status(config.httpStatus.unauthorizedOperation).json({
            message: 'Unauthorized operation',
            reqId: req.uuid
        });
    };
};

// generates an unique ID to identify the request
middlewares.generateRequestUUID = function(req, res, next) {
    req.uuid = uuidv4();
    logger.debug('[Request:' + req.uuid + '][IP:' + req.ip + '] - ' + req.method + ' "' + req.originalUrl + '"');
    next();
};

// catch all non mapped request for error
middlewares.errorMapper = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = config.httpStatus.notFound;
    logger.error('[Request:' + req.uuid + '][IP:' + req.ip + '] - Access to undefined path ' + req.method + ' "' + req.originalUrl + '"');
    next(err);
};

// error handler
middlewares.errorHandler = function(err, req, res, next) {
    if (res.headersSent) return next(err);

    // send the error
    if (err.status) res.status(err.status);
    else {
        res.status(config.httpStatus.serverError);
        if (req.uuid) logger.error('[Request:' + req.uuid + '][IP:' + req.ip + '] - Internal error: "' + err.stack + '" => 500 sent');
        else logger.error('Internal error: "' + err.stack + '" => ' + config.httpStatus.serverError + ' sent');
    }
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        reqId: req.uuid
    });
};

module.exports = middlewares;