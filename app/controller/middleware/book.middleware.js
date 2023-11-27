const db = require("../../model/index.js");
const util = require("../util.js")

const User = db.user;
const Book = db.book;
const Category = db.category;
const History = db.history;

const commonExecute = require("../executeDB/common.execute.js");


exports.createBook = async (req, res) => {
    let file = req.file;
    let {title, description, content, author, category} = req.body;
    if (title === undefined || description === undefined || content === undefined || author === undefined || category === undefined
        || title === "" || description === "" || content === "" || author === "" || category === "") {
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

    // // kiem tra nếu chưa có tác giả thì thêm tác giả
    // let conditionAuthor = {
    //     name: author
    // }
    // let valueAuthor = {
    //     name: author
    // }
    // let dataAuthor = await commonExecute.findOrCreateData(Author, conditionAuthor, valueAuthor) 
    // if (dataAuthor.code == -2) {
    //     return res.status(400).send({ message: "Error occurred when find or create author" })
    // }

    // them book
    let valueBook = {
        categoryId: dataCategory.categoryId,
        title: title,
        description: description,
        content: content,
        author: author,
        coverImgURL: file.path.replace(/\\/g, "/")
    }
    let dataBook = await commonExecute.createData(Book, valueBook); 
    if (dataBook.code == -2) {
        return res.status(400).send({ message: "Error occurred when create book", err: dataBook.err })
    }
    dataBook.coverImgURL = req.protocol + '://' + req.get('host') + '/' + dataBook.coverImgURL;
    dataBook.category = dataCategory.name;
    // // them data bieu thi su lien ket giua author va book
    // let valueBookOfAuthor = {
    //     bookId: dataBook.bookId,
    //     authorId: dataAuthor.authorId
    // }
    // let dataBookOfAuthor = await commonExecute.createData(BookOfAuthor, valueBookOfAuthor)
    // if (dataBookOfAuthor.code == -2) {
    //     return res.status(400).send({ message: "Error occurred when create data association between book and author" })
    // }
    return res.status(200).send(dataBook)
}

exports.getBook = async (req, res) => {
    let {bookId} = req.body;
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

    dataBook.coverImgURL = req.protocol + '://' + req.get('host') + '/' + dataBook.coverImgURL;
    dataBook.category = dataCategory.name;
    delete dataBook.content;
    return res.status(200).send(dataBook)
}

exports.getFullBook = async (req, res) => {
    let {bookId} = req.body;
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

    // tim category
    let valueHistory = {
        userUserId: req.dataAccount.userId,
        bookBookId: dataBook.bookId
    }
    let dataHistory = await commonExecute.createData(History, valueHistory)
    if (dataHistory.code == -2) {
        return res.status(400).send({ message: "Error occurred when create history", err: dataHistory.err })
    }

    dataBook.coverImgURL = req.protocol + '://' + req.get('host') + '/' + dataBook.coverImgURL;
    dataBook.category = dataCategory.name;
    return res.status(200).send(dataBook)
}

exports.updateBook = async (req, res) => {
    let {bookId, title, description, content, author, category} = req.body;
    if (bookId === undefined || bookId === "") {
        return res.status(400).send({ message: "Missing field" })
    }
    if (title === undefined && description === undefined && content === undefined && author === undefined && category === undefined) {
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
        content: content,
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
    let result = commonExecute.deleteData(Book, condition)
    if (result.code === -2) {
        return res.status(500).send({ message: "Error occurred when delete book", err: result.err})
    }
    return res.status(200).send({ message: "Delete successfully" }) 
}