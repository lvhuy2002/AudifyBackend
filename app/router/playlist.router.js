const router = require("express").Router();
const userMiddleware = require("../controller/middleware/user.middleware.js");
const playlistMiddleware = require("../controller/middleware/playlist.middleware.js");

// 
router.post('/createPlaylist', userMiddleware.authorizationJWT, playlistMiddleware.createPlaylist); 

//
router.get('/getPlaylistList', userMiddleware.authorizationJWT, playlistMiddleware.getPlaylistList)

// 
router.post('/removePlaylist', userMiddleware.authorizationJWT, playlistMiddleware.checkPlaylistBelongToUser, playlistMiddleware.removePlaylist);

//
router.post('/addBook', userMiddleware.authorizationJWT, playlistMiddleware.checkPlaylistBelongToUser, playlistMiddleware.addBook, playlistMiddleware.getBooks);

//
router.post('/removeBook', userMiddleware.authorizationJWT, playlistMiddleware.checkPlaylistBelongToUser, playlistMiddleware.removeBook, playlistMiddleware.getBooks);

// 
router.get('/getBooks/:playlistId', userMiddleware.authorizationJWT, playlistMiddleware.checkPlaylistBelongToUser, playlistMiddleware.getBooks); 





module.exports = router