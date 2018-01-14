var express = require('express'),
    appMiddleware = require('../middlewares'),
    users = require('../controllers/users'),
    router = express.Router();

router.post('/auth', users.login);
router.get('/refreshToken', users.refreshToken);

router.use('/secure/*', appMiddleware.loginRequired);

//router.post('/secure/add', appMiddleware.requireRole(['ADMIN']), users.login);

module.exports = router;