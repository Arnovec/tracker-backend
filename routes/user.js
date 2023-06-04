const Router = require('express');
const router = new Router();
const userController = require('../controller/user');
const { checkAccessToken } = require('../controller');

router.get(
    '/list',
    userController.getList
);
router.get(
    '/:id',
    userController.getUserById
);
router.get(
    '/:id/issubscribe',
    checkAccessToken,
    userController.isSubscribe
);
router.get(
    '/:id/trainings',
    userController.getTrainings
);
router.get(
    '/:id/feed',
    userController.getFeed
);

module.exports = router;