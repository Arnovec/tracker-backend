const Router = require('express');
const router = new Router();
const profileController = require('../controller/profile');
const multer = require('multer');
const {
    checkAccessToken
} = require('../controller/index');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/image/')
    },
    filename: function (req, file, cb) {
        const fileSplit = file.originalname.split('.')
        const type = fileSplit[fileSplit.length - 1];
        cb(null, Date.now() + `.${type}`)
    }
})

var upload = multer({ storage: storage });

router.post(
    '/change/avatar',
    checkAccessToken,
    upload.single('avatar'),
    profileController.loadImage
)
router.post(
    '/change/name',
    checkAccessToken,
    profileController.changeName
)
router.post(
    '/change/password',
    checkAccessToken,
    profileController.changePassword
)
router.post(
    '/:id/subscribe',
    checkAccessToken,
    profileController.subscribe
)
router.post(
    '/:id/unsubscribe',
    checkAccessToken,
    profileController.unsubscribe
)

module.exports = router;