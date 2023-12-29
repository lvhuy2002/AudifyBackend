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
router.get('/getBook/:bookId', bookMiddleware.getBook)

// get full book
router.get('/getFullBook/:bookId', userMiddleware.authorizationJWT, bookMiddleware.getFullBook);

// update book
router.post('/updateBook', bookMiddleware.updateBook); 

// delete account
router.post('/deleteBook', bookMiddleware.deleteBook); 


// find at mót 3 books with similar results
router.get('/searchBook', bookMiddleware.searchBook);

//getRecentBook
router.get('/getRecentBook', userMiddleware.authorizationJWT, bookMiddleware.getRecentBook);

// get bookList
router.get('/getTopBookRate', bookMiddleware.getTopBookRate); 

// get bookList
router.get('/getRecommendBook', userMiddleware.authorizationJWT, bookMiddleware.getRecommendBook); 

// get bookList
router.get('/getNewestBook', bookMiddleware.getNewestBook); 

// get bookList
router.get('/getBestSellerBook', bookMiddleware.getBestSellerBook);

// get bookList
router.get('/getTrendingBook', bookMiddleware.getTrendingBook);

module.exports = router