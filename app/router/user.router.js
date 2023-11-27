const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");

// register an user account:
router.post('/register', userMiddleware.register); 

router.post('/login', userMiddleware.login); 

router.post('/changeInfo', userMiddleware.authorizationJWT, userMiddleware.changeInfo);

router.get('/getInfo', userMiddleware.authorizationJWT, userMiddleware.getInfo);

router.post('/sendResetCode', userMiddleware.sendResetCode);

router.post('/verifyResetCode', userMiddleware.verifyResetCode);

router.post('/resetPassword', userMiddleware.authorizationJWT, userMiddleware.resetPassword)
module.exports = router