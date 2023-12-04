const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const playlistMiddleware = require("../controller/middleware/playlist.middleware.js");

// 
router.post('/createAssess', userMiddleware.authorizationJWT,); 

// 
router.get('/updateAssess', userMiddleware.authorizationJWT,); 

//
router.post('/removeAssess', userMiddleware.authorizationJWT,);

module.exports = router