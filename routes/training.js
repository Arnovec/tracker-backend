const Router = require('express');
const router = new Router();
const trainingController = require('../controller/training');
const { body } = require('express-validator');

router.post(
    '/add',
    body("points").isArray(2),
    trainingController.add
);
router.get(
    '/list',
    trainingController.getList
);
router.get(
    '/:id',
    trainingController.getTrainingById
);
router.get(
    '/:id/analysis',
    trainingController.getTrainingAnalysisById
);


module.exports = router;