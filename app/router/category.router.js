const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const categoryMiddleware = require("../controller/middleware/category.middleware.js");

// register an user account:
router.post('/createCategory', categoryMiddleware.createCategory ); 


//TODO: tìm book theo các tiêu chí

module.exports = router