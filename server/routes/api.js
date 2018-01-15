var express = require('express'),
    appMiddleware = require('../middlewares'),
    users = require('../controllers/users'),
    router = express.Router();

router.post('/auth', users.login);
router.get('/refreshToken', users.refreshToken);
router.get('/logout', users.logout);

router.use('/secure/*', appMiddleware.loginRequired);

module.exports = router;
