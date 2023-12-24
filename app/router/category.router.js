const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const categoryMiddleware = require("../controller/middleware/category.middleware.js");

// register an user account:
router.post('/createCategory', categoryMiddleware.createCategory ); 

// get category list an user account:
router.get('/getCategoryList', categoryMiddleware.getCategoryList ); 

// get category list an user account:
router.get('/getBook', categoryMiddleware.getBook ); 




module.exports = router