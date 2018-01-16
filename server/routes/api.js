var express = require('express'),
    appMiddleware = require('../middlewares'),
    users = require('../controllers/users'),
    api = require('../controllers/api'),
    router = express.Router();

router.post('/auth', users.login);
router.get('/refreshToken', users.refreshToken);
router.get('/logout', users.logout);
router.get('/list', api.list);

router.use('/secure/*', appMiddleware.loginRequired);

module.exports = router;
