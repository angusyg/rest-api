// includes
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    cors = require('cors'),
    // custom middlewares
    appMiddleware = require('./server/middlewares'),
    // modules routes
    apiRoute = require('./server/routes/api'),
    config = require('./config').load();

var app = express();

// configuration
app.set('config', config);

// middlewares
app.use(appMiddleware.generateRequestUUID);
app.use(helmet());
app.use(cors(config.crossOrigin));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// map modules routes
app.use('/api', apiRoute);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

module.exports = app;
