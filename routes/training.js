const Router = require('express');
const router = new Router();
const trainingController = require('../controller/training');
const { body } = require('express-validator');

router.post(
    '/add',
    body("training.points").isArray(2),
    trainingController.add
);
router.get(
    '/list',
    trainingController.getList
);


module.exports = router;