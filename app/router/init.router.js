const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const playlistMiddleware = require("../controller/middleware/playlist.middleware.js");

// 
router.post('/initData', userMiddleware.authorizationJWT,); 


module.exports = router