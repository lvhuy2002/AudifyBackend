const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const assessMiddleware = require("../controller/middleware/assess.middleware.js");

// 
router.post('/createAssess', userMiddleware.authorizationJWT, assessMiddleware.createAssess); 

// 
router.get('/getAssess/:bookId', userMiddleware.authorizationJWT, assessMiddleware.getAssess); 

// 
router.post('/updateAssess', userMiddleware.authorizationJWT,  assessMiddleware.updateAssess); 

//
router.post('/removeAssess', userMiddleware.authorizationJWT, assessMiddleware.removeAssess);

module.exports = router