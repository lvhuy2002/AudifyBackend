const db = require("../../model/index.js");
const util = require("../util.js")

const User = db.user;
const Book = db.book;
const Category = db.category;
const History = db.history;
const Chapter = db.chapter;
const Playlist = db.playlist;
const BookOfPlaylist = db.bookOfPlaylist;
const commonExecute = require("../executeDB/common.execute.js");
const specifiedExecute = require("../executeDB/specified.execute.js")


exports.createPlaylist = async (req, res) => {
    let {name, book} = req.body;
    if (name === undefined || name === "") {
        return res.status(400).send({ message:  "Missing field!" })
    }

    let valuePlaylist = {
        userId: req.dataAccount.userId,
        name: name
    }

    let dataPlaylist = await commonExecute.createData(Playlist, valuePlaylist);
    if (dataPlaylist.code === -2) {
        return res.status(500).send({ message: "Error occurred when create playlist", err: dataPlaylist.err})
    }
    
    
    // if (book && book.length) {
    //     let valueBookOfPlaylist = []
    //     for (let i = 0; i < book.length; i++) {
    //         valueBookOfPlaylist.push({
    //             bookId: req.dataAccount.bookId,
    //             playlistId: dataPlaylist.playlistId
    //         })
    //     }
    //     let dataBookOfPlaylist = await commonExecute.createManyData(BookOfPlaylist, valueBookOfPlaylist) 
    //     if (dataBookOfPlaylist.code === -2) {
    //         return res.status(500).send({ message: "Error occurred when create book of playlist", err: dataBookOfPlaylist.err})
    //     }
        
    // }

    return res.status(200).send(dataPlaylist)
}

exports.getPlaylistList = async (req, res) => {
    let conditionPlaylist = {
        userId: req.dataAccount.userId
    }    

    let dataPlaylist = await commonExecute.findManyData(Playlist, conditionPlaylist)
    if (dataPlaylist.code === -2) {
        return res.status(500).send({ message: "Error occurred when get playlist list", err: dataPlaylist.err})
    } 
    return res.status(200).send(dataPlaylist)
}

exports.checkPlaylistBelongToUser = async (req, res, next) => {
    let playlistId = req.body.playlistId
    if (playlistId === undefined) {
        playlistId = req.params.playlistId
    }
    
    if (playlistId === "" || playlistId === undefined) {
        return res.status(400).send({ message:  "Missing field!" })
    }
    
    let condition = {
        playlistId: playlistId
    }
    let dataPlaylist = await commonExecute.findOneData(Playlist, condition);
    if (dataPlaylist === -1) {
        return res.status(400).send({ message: "Playlist isn't exist"})
    } 
    if (dataPlaylist === -2) {
        return res.status(500).send({ message: "Error occurred when find playlist", err: dataPlaylist.err})
    } 
    if (dataPlaylist.userId !== req.dataAccount.userId) {
        return res.status(400).send({ message: "Playlist don't belong to user", err: dataPlaylist.err})
    }
    req.dataPlaylist = dataPlaylist;
    next();
}

exports.removePlaylist = async (req, res) => {
    let {playlistId} = req.body
    let condition = {
        playlistId: playlistId
    }

    let result1 = await commonExecute.deleteData(BookOfPlaylist, condition);
    if (result1 === -2) {
        return res.status(500).send({ message: "Error occurred when remove book from playlist", err: result1.err})
    } 
    let result2 = await commonExecute.deleteData(Playlist, condition)
    if (result2 === -2) {
        return res.status(500).send({ message: "Error occurred when remove playlist", err: result2.err})
    } 
    return res.status(200).send({message: "Remove playlist successfully"})
}
exports.addBook = async (req, res, next) => {
    let {bookId, playlistId} = req.body
    
    let value = {
        bookId: bookId,
        playlistId: playlistId
    }

    let dataBook = await commonExecute.createData(BookOfPlaylist, value)
    if (dataBook === -2) {
        return res.status(500).send({ message: "Error occurred when add book to playlist", err: dataBook.err})
    } 
    next()
}

exports.removeBook = async (req, res, next) => {
    let {bookId, playlistId} = req.body
    let condition = {
        bookId: bookId,
        playlistId: playlistId
    }

    let result = await commonExecute.deleteData(BookOfPlaylist, condition)
    if (result === -2) {
        return res.status(500).send({ message: "Error occurred when remove book from playlist", err: result.err})
    } 
    next()
}

exports.getBooks = async (req, res) => {
    let playlistId = req.body.playlistId
    if (playlistId === undefined) {
        playlistId = req.params.playlistId
    }
    let condition = {
        playlistId: playlistId
    }

    let result = await specifiedExecute.getBookFromPlaylist(Playlist, Book, condition)
    if (result === -2) {
        return res.status(500).send({ message: "Error occurred when remove book from playlist", err: result.err})
    } 
    return res.status(200).send(result)
}
