const Router = require('express');
const router = new Router();
const userController = require('../controller/user');

router.get(
    '/list',
    userController.getList
);
router.get(
    '/:id',
    userController.getUserById
);
router.get(
    '/:id/isSubscribe',
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
// router.post(
//     '/:id/subscribe',
//     userController.subscribe
// )
// router.post(
//     '/:id/unsubscribe',
//     userController.unsubscribe
// )

module.exports = router;