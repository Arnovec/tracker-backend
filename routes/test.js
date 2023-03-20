const Router = require('express');
const router = new Router();
const testController = require('../controller/test')

router.get(
    '/add',
    testController.add
);
router.get(
    '/getall',
    testController.get
);


module.exports = router;