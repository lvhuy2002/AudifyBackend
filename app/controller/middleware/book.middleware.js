const db = require("../../model/index.js");
const util = require("../util.js")
const Fuse = require('fuse.js');
const { Op, literal } = require('sequelize')

const User = db.user;
const Book = db.book;
const Assess = db.assess;
const Category = db.category;
const History = db.history;
const Chapter = db.chapter;
const commonExecute = require("../executeDB/common.execute.js");
const specifiedExecute = require("../executeDB/specified.execute.js");

exports.searchBook = async (req, res) => {
    const { keyword } = req.query;
    
    try {
        const allBooks = await Book.findAll();
        if (keyword === "") {
            for (let book of allBooks) {
                book.dataValues.coverImgURL = util.addHost(req, book.dataValues.coverImgURL) ;
            }
            return res.json(allBooks);
        }

        const options = {
            keys: ['title', 'author'],
            threshold: 0.3,
        };
        
        const fuse = new Fuse(allBooks, options);

        const result = fuse.search(keyword);
        let resp = []
        for (let book of result) {
            book.item.dataValues.coverImgURL = util.addHost(req, book.item.dataValues.coverImgURL) ;
            resp.push(book.item)
        }
        return res.json(resp);
    } catch (error) {
        console.error('Error occurred while searching for books:', error);
        return res.status(500).json({ error: 'Failed to retrieve books' });
    }
}

exports.createBook = async (req, res) => {
    let file = req.file;
    let {title, description, author, category, chapter} = req.body;
    if (title === undefined || description === undefined || chapter === undefined || author === undefined || category === undefined
        || title === "" || description === "" || chapter.length === 0 || author === "" || category === "") {
            return res.status(400).send({ message: "Missing field!" })
    }

    // kiểm tra category có tồn tại
    let conditionCategory = {
        name: category
    }
    let dataCategory = await commonExecute.findOneData(Category, conditionCategory)
    if (dataCategory.code == -1) {
        return res.status(400).send({ message: "Category isn't exist!" })
    }

    if (dataCategory.code == -2) {
        return res.status(500).send({ message: "Error occurred when find category", err: dataCategory.err})
    }

    // them book
    let valueBook = {
        categoryId: dataCategory.categoryId,
        title: title,
        description: description,
        author: author,
        coverImgURL: file.path.replace(/\\/g, "/")
    }
    let dataBook = await commonExecute.createData(Book, valueBook); 
    if (dataBook.code == -2) {
        return res.status(400).send({ message: "Error occurred when create book", err: dataBook.err })
    }

    let valueChapter = [];
    for (var i = 0; i < chapter.length; i++) {
        valueChapter.push({
            bookId: dataBook.bookId,
            content: chapter[i],
            number: i + 1
        })
    }

    let dataChapter = await commonExecute.createManyData(Chapter, valueChapter);
    if (dataChapter.code == -2) {
        return res.status(400).send({ message: "Error occurred when create chapter", err: dataChapter.err })
    }
     
    for (var i = 0; i < dataChapter.length;  i++) {
        delete dataChapter[i].dataValues.chapterId;
        delete dataChapter[i].dataValues.bookId;
        delete dataChapter[i].dataValues.createdAt;
        delete dataChapter[i].dataValues.updatedAt;
    }
    
    dataBook.coverImgURL = util.addHost(req, dataBook.coverImgURL);
    dataBook.category = dataCategory.name;
    dataBook.chapter = dataChapter
    return res.status(200).send(dataBook)
}

exports.getBook = async (req, res) => {
    let {bookId} = req.params;
    if (bookId === undefined || bookId === "") {
        return res.status(400).send({ message: "Missing field!" })
    }
    
    let conditionBook = {
        bookId: bookId
    }

    let dataBook = await commonExecute.findOneData(Book, conditionBook); 
    if (dataBook.code == -1) {
        return res.status(400).send({ message: "Book isn't exist!" })
    }
    if (dataBook.code == -2) {
        return res.status(500).send({ message: "Error occurred when finding book", err: dataCategory.err})
    }

    
    // tim category
    let conditionCategory = {
        categoryId: dataBook.categoryId
    }
    let dataCategory = await commonExecute.findOneData(Category, conditionCategory)
    if (dataCategory.code == -1) {
        return res.status(400).send({ message: "Category isn't exist!" })
    }
    if (dataCategory.code == -2) {
        return res.status(500).send({ message: "Error occurred when find category", err: dataCategory.err})
    }

    // lay comment

    let dataBookUser = await specifiedExecute.getAssessOfBook(Book, User, {bookId: bookId})
    if (dataBookUser.code == -2) {
        return res.status(500).send({ message: "Error occurred when get assess of book", err: dataBookUser.err})
    }
    let dataAssess = dataBookUser[0].dataValues.users;
    for (let assess of dataAssess) {
        assess.dataValues.comment = assess.assess.dataValues.comment;
        assess.dataValues.rate = assess.assess.dataValues.rate;
        assess.dataValues.imgURL = req.protocol + '://' + req.get('host') + '/' + assess.dataValues.imgURL;
        delete assess.dataValues.assess;
        delete assess.dataValues.email;
        delete assess.dataValues.password;
        delete assess.dataValues.resetCode;
        delete assess.dataValues.timeOfResetCode;
        delete assess.dataValues.createdAt;
        delete assess.dataValues.updatedAt;

    }
    dataBook.coverImgURL = util.addHost(req,dataBook.coverImgURL);
    dataBook.category = dataCategory.name;
    dataBook.assess = dataAssess
    delete dataBook.content;
    return res.status(200).send(dataBook)
}

exports.getFullBook = async (req, res) => {
    let {bookId} = req.params;
    if (bookId === undefined || bookId === "") {
        return res.status(400).send({ message: "Missing field!" })
    }
    
    let conditionBook = {
        bookId: bookId
    }

    let dataBook = await commonExecute.findOneData(Book, conditionBook); 
    if (dataBook.code == -1) {
        return res.status(400).send({ message: "Book isn't exist!" })
    }
    if (dataBook.code == -2) {
        return res.status(500).send({ message: "Error occurred when finding book", err: dataCategory.err})
    }

    let valueView = {
        view: dataBook.view + 1
    }
    let result = await commonExecute.updateData(Book, valueView , conditionBook) 
    if (result.code === -2) {
        return res.status(400).send({ message: "Can't update view" })
    }

    // tim category
    let conditionCategory = {
        categoryId: dataBook.categoryId
    }
    let dataCategory = await commonExecute.findOneData(Category, conditionCategory)
    if (dataCategory.code == -1) {
        return res.status(400).send({ message: "Category isn't exist!" })
    }
    if (dataCategory.code == -2) {
        return res.status(500).send({ message: "Error occurred when find category", err: dataCategory.err})
    }

    // tim chapter
    let conditionChapter = {
        bookId: bookId
    }
    
    let dataChapter = await commonExecute.findManyData(Chapter, conditionChapter) 
    if (dataChapter.length === 0) {
        return res.status(500).send({ message: "There are no chapter of this book in database", err: dataCategory.err})
    }
    if (dataChapter.code === -2) {
        return res.status(500).send({ message: "Error occurred when find chapter", err: dataCategory.err})
    }
    for (var i = 0; i < dataChapter.length;  i++) {
        delete dataChapter[i].dataValues.chapterId;
        delete dataChapter[i].dataValues.bookId;
        delete dataChapter[i].dataValues.createdAt;
        delete dataChapter[i].dataValues.updatedAt;
    }

    // them vao history
    let valueHistory = {
        userId: req.dataAccount.userId,
        bookId: dataBook.bookId
    }
    let dataHistory = await commonExecute.createData(History, valueHistory)
    if (dataHistory.code == -2) {
        return res.status(400).send({ message: "Error occurred when create history", err: dataHistory.err })
    }
     // lay comment

     let dataBookUser = await specifiedExecute.getAssessOfBook(Book, User, {bookId: bookId})
     if (dataBookUser.code == -2) {
         return res.status(500).send({ message: "Error occurred when get assess of book", err: dataBookUser.err})
     }
     let dataAssess = dataBookUser[0].dataValues.users;
     for (let assess of dataAssess) {
        assess.dataValues.comment = assess.assess.dataValues.comment;
        assess.dataValues.rate = assess.assess.dataValues.rate;
        assess.dataValues.imgURL = req.protocol + '://' + req.get('host') + '/' + assess.dataValues.imgURL;
        delete assess.dataValues.assess;
        delete assess.dataValues.email;
        delete assess.dataValues.password;
        delete assess.dataValues.resetCode;
        delete assess.dataValues.timeOfResetCode;
        delete assess.dataValues.createdAt;
        delete assess.dataValues.updatedAt;
 
     }
    dataBook.coverImgURL = util.addHost(req, dataBook.coverImgURL );
    dataBook.category = dataCategory.name;
    dataBook.chapter = dataChapter;
    dataBook.assess = dataAssess;
    return res.status(200).send(dataBook)
}

exports.updateBook = async (req, res) => {
    let {bookId, title, description, author, category} = req.body;
    if (bookId === undefined || bookId === "") {
        return res.status(400).send({ message: "Missing field" })
    }
    if (title === undefined && description === undefined && author === undefined && category === undefined) {
        return res.status(400).send({ message: "Nothing to change" })
    }
    let categoryId = undefined;
    if (category !== undefined) {
        let conditionCategory = {
            name: category
        }
        let dataCategory = await commonExecute.findOneData(Category, conditionCategory)
        if (dataCategory.code == -1) {
            return res.status(400).send({ message: "Category isn't exist!" })
        }
    
        if (dataCategory.code == -2) {
            return res.status(500).send({ message: "Error occurred when find category", err: dataCategory.err})
        }
        categoryId = dataCategory.categoryId
    }

    let conditionBook = {
        bookId: bookId
    }

    let valueBook = {
        categoryId: categoryId,
        title: title,
        description: description,
        author: author,
    }

    let resultUpdateBook = await commonExecute.updateData(Book, valueBook, conditionBook)
    if (resultUpdateBook.code === -1) {
        return res.status(400).send({ message: 'Unable to update book!' })
    }
    if (resultUpdateBook.code === -2) {
        return res.status(500).send({ message: "Unable to update book!", err: resultUpdateBook.err })
    }
    return res.status(200).send({ message: "Update successfully"})
}

exports.deleteBook = async (req, res) => {
    let {bookId} = req.body;

    if (bookId === undefined || bookId === "") {
        return res.status(400).send({ message: "Missing field" })
    }

    let condition = {
        bookId: bookId
    }

    let resultChapter = commonExecute.deleteData(Chapter, condition)
    if (resultChapter.code === -2) {
        return res.status(500).send({ message: "Error occurred when delete book", err: result.err})
    }
    let resultBook = commonExecute.deleteData(Book, condition)
    if (resultBook.code === -2) {
        return res.status(500).send({ message: "Error occurred when delete book", err: result.err})
    }
    return res.status(200).send({ message: "Delete successfully" }) 
}

exports.getTopBookRate = async (req, res) => {
    try {
        const topBooks = await Book.findAll({
            order: [['rate', 'DESC']],
            limit: 10,
          });
        for (let book of topBooks) {
            book.dataValues.coverImgURL = util.addHost(req, book.dataValues.coverImgURL);
        }
        //console.log(topBooks)
        return res.status(200).send(topBooks)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
}