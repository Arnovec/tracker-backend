const Router = require('express');
const router = new Router();
const authController = require('../controller/auth');
const { body } = require('express-validator');

router.post(
    '/register',
    body("name").notEmpty(),
    body("login").notEmpty(),
    body("surname").notEmpty(),
    body("password").notEmpty(),
    authController.register
);
router.post(
    '/login',
    body("login").notEmpty(),
    body("password").notEmpty(),
    authController.login
);
router.post(
    '/refresh',
    authController.refresh
)


module.exports = router;