const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const bookMiddleware = require("../controller/middleware/book.middleware.js");
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "img/coverBook");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
  });

const upload = multer({ storage })
// register an user account:
router.post('/createBook', upload.single("image"), bookMiddleware.createBook ); 

// get book
router.get('/getBook', bookMiddleware.getBook)

router.get('/getFullBook', userMiddleware.authorizationJWT, bookMiddleware.getFullBook);

// update book
router.post('/updateBook', bookMiddleware.updateBook); 

// delete account
router.post('/deleteBook', bookMiddleware.deleteBook); 



//TODO: tìm book theo các tiêu chí

module.exports = router