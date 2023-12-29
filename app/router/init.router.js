const router = require("express").Router();
const initMiddleware = require("../controller/middleware/init.middleware.js");
const playlistMiddleware = require("../controller/middleware/playlist.middleware.js");

// 
router.post('/initData', initMiddleware.init); 


module.exports = router