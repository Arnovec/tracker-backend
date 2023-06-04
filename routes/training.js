const Router = require('express');
const router = new Router();
const trainingController = require('../controller/training');
const { body } = require('express-validator');
const {
    checkAccessToken
} = require('../controller/index');

router.post(
    '/add',
    checkAccessToken,
    body("points").isArray(2),
    trainingController.add
);
router.get(
    '/:id',
    trainingController.getTrainingById
);


module.exports = router;