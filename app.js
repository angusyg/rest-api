// includes
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    // custom middlewares
    appMiddleware = require('./server/middlewares'),
    // modules routes
    apiRoute = require('./server/routes/api'),
    config = require('./config').load();

var app = express();

// configuration
app.set('config', config);

// middlewares
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(appMiddleware.generateRequestUUID);

// map modules routes
app.use('/api', apiRoute);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

module.exports = app;