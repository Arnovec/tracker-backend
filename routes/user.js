const Router = require('express');
const router = new Router();
const userController = require('../controller/user')

router.get(
    '/list',
    userController.getList
);
router.get(
    '/:id',
    userController.getUser
);
router.get(
    '/:id/trainings',
    userController.getTrainings
);

module.exports = router;