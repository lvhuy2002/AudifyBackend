const db = require("../../model/index.js");
const util = require("../util.js")

const User = db.user;
const Book = db.book;
const Assess = db.assess;
const Category = db.category;
const History = db.history;
const Chapter = db.chapter;
const commonExecute = require("../executeDB/common.execute.js");


exports.createAssess = async (req, res) => {
    let {bookId, rate, comment} = req.body;
    let {userId} = req.dataAccount;
    if (bookId === undefined || rate === undefined || bookId === "" || rate === "" ) {
            return res.status(400).send({ message: "Missing field!" })
    }
    let rateInt = parseInt(rate);
    if (rateInt > 10 || rateInt < 0) {
        return res.status(400).send({ message: "Rate isn't valid!" }) 
    }
    let valueAssess = {
        bookId: bookId,
        userId: userId,
        comment: comment,
        rate: rateInt
    }

    let dataAssess = await commonExecute.createData(Assess, valueAssess);
    if (dataAssess === -2) {
        return res.status(500).send({ message: "Error occurred when created assess", err: dataAssess.err })
    }
    
    let rateAverage = await commonExecute.averageData(Assess, "rate", {bookId: bookId})
    if (rateAverage.code === -2) {
        return res.status(500).send({ message: "Error occurred when average rate", err: rateAverage.err  })
    }
    let result = await commonExecute.updateData(Book, {rate: parseFloat(rateAverage).toFixed(1)}, {bookId: bookId}) 
    if (result.code === -2) {
        return res.status(500).send({ message: "Error occurred when get book data", err: result.err  })
    }
    if (result === 0 ) {
        return res.status(500).send({ message: "Unable update rate" })
    }
    return res.status(200).send(dataAssess);
}

exports.updateAssess = async (req, res) => {
    let {bookId, rate, comment} = req.body;
    let {userId} = req.dataAccount;
    if (bookId === undefined || rate === undefined || bookId === "" || rate === "" ) {
            return res.status(400).send({ message: "Missing field!" })
    }
    let rateInt = parseInt(rate);
    if (rateInt > 10 || rateInt < 0) {
        return res.status(400).send({ message: "Rate isn't valid!" }) 
    }

    let conditionAssess = {
        bookId: bookId,
        userId: userId
    }
    let dataOldAssess = await commonExecute.findOneData(Assess, conditionAssess) 
    if (dataOldAssess.code === -1) {
        return res.status(400).send({ message: "Assess is not exist" })
    }
    if (dataOldAssess.code === -2) {
        return res.status(400).send({ message: "Can't find assess", err: dataOldAssess.err})
    }
    
    let valueAssess = {
        comment: comment,
        rate: rateInt
    }
    let dataAssess = await commonExecute.updateData(Assess, valueAssess, conditionAssess);
    if (dataAssess === -2) {
        return res.status(500).send({ message: "Error occurred when created assess", err: err })
    }

    if (rateInt !== dataOldAssess.rate) {
        let rateAverage = await commonExecute.averageData(Assess, "rate", {bookId: bookId})
        if (rateAverage.code === -2) {
            return res.status(500).send({ message: "Error occurred when average rate", err: rateAverage.err  })
        }
        let result = await commonExecute.updateData(Book, {rate: rateAverage}, {bookId: bookId}) 
        if (result.code === -2) {
            return res.status(500).send({ message: "Error occurred when get book data", err: err  })
        }
        if (result === 0 ) {
            return res.status(500).send({ message: "Unable update rate" })
        }
        //let rateAverage = parseFloat((dataBook.rate * countAssess) + ((  - ) / countAssess)).toFixed(1))
    }

    return res.status(200).send("ok");
}


exports.removeAssess = async (req, res) => {
    let {bookId} = req.body;
    let {userId} = req.dataAccount;
    if (bookId === undefined || bookId === "" ) {
            return res.status(400).send({ message: "Missing field!" })
    }

    let resultDelete = await commonExecute.deleteData(Assess, {bookId: bookId, userId: userId});
    if (resultDelete === -2) {
        return res.status(500).send({ message: "Error occurred when created assess", err: resultDelete.err })
    }
    
    let rateAverage = await commonExecute.averageData(Assess, "rate", {bookId: bookId})
    if (rateAverage.code === -2) {
        return res.status(500).send({ message: "Error occurred when average rate", err: rateAverage.err  })
    }
    let result = await commonExecute.updateData(Book, {rate: parseFloat(rateAverage).toFixed(1)}, {bookId: bookId}) 
    if (result.code === -2) {
        return res.status(500).send({ message: "Error occurred when get book data", err: result.err  })
    }
    if (result === 0 ) {
        return res.status(500).send({ message: "Unable update rate" })
    }
    return res.status(200).send("ok");
}

exports.getAssess = async (req, res) => {
    let {bookId} = req.params;
    let {userId} = req.dataAccount;
    if (bookId === undefined || bookId === "" ) {
            return res.status(400).send({ message: "Missing field!" })
    }

    let dataAssess = await commonExecute.findOneData(Assess, {userId: userId, bookId: bookId})
    if (dataAssess.code === -2) {
        return res.status(500).send({ message: "Error occurred when get assess of book", err: result.err  })
    }
    if (dataAssess.code === -1) {
        return res.status(200).send({})
    }

    return res.status(200).send(dataAssess);
}