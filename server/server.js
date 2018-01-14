var app = require('../app'),
    debug = require('debug')('DemoApp:server'),
    http = require('http'),
    logger = require('./helpers/logger').server,
    config = app.get('config');

// port from environment
var port = normalizePort(config.server.port);

// // https secure server
// var https = require('https');
// var fs = require('fs');
// var options = {
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem')
// };
// var securePort = 443;
// var secureServer = https.createServer(options, app);
// secureServer.listen(securePort);
//
// // http server redirecting to secure https server
// var server = http.createServer(function (req, res) {
//     res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
//     res.send('Redirecting to secure server');
// }).listen(port);

// http server
var server = http.createServer(app);

// startup server to listen request, error
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// check if port or named pipe
function normalizePort(val) {
    var port = parseInt(val, 10);
    // named pipe ?
    if (isNaN(port)) return val;
    // port number ?
    if (port >= 0) return port;
    return false;
}

// error event
function onError(error) {
    if (error.syscall !== 'listen') throw error;

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// listening event
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

process.on('uncaughtException', function(err) {
    logger.error('Server internal error: "' + err.stack + '"');
    process.exit(1);
});