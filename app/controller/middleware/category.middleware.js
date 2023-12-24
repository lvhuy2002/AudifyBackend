const db = require("../../model/index.js");
const util = require("../util.js")

const User = db.user;
const Book = db.book;
const Author = db.author;
const Category = db.category;
const commonExecute = require("../executeDB/common.execute.js");


exports.createCategory = async (req, res) => {
    let {name} = req.body;
    console.log(name)
    if (name === undefined || name === "" ) {
            return res.status(400).send({ message: "Missing field!" })
    }

    let conditionCategory = {
        name: name
    }
    let checkCategory = await commonExecute.findOneData(Category, conditionCategory)
    if (checkCategory.code == -2) {
        return res.status(500).send({ message: "Error occurred when find category", err: dataCategory.err})
    }
    if (checkCategory.code != -1) {
        return res.status(400).send({ message: "Category already exists!" })
    }

    let value = {
        name: name
    }
    let dataCategory = await commonExecute.createData(Category, value)
    if (dataCategory.code === -2) {
        return res.status(500).send({ message: "Failed to create category", err: dataAccount.err })
    }

    return res.status(200).send(dataCategory);
}

exports.getCategoryList = async (req, res) => {
    let dataCategory = await commonExecute.findManyData(Category, {})
    if (!dataCategory.length) {
        return res.status(500).send({ message: "There are no categories in db"}) 
    }
    if (dataCategory.code === -2) {
        return res.status(500).send({ message: "Failed to create category", err: dataAccount.err })
    }
    return res.status(200).send(dataCategory)
}


exports.getBook = async (req, res) => {
    let dataCategory = await commonExecute.findManyData(Category, {})
    if (!dataCategory.length) {
        return res.status(500).send({ message: "There are no categories in db"}) 
    }
    if (dataCategory.code === -2) {
        return res.status(500).send({ message: "Failed to create category", err: dataAccount.err })
    }
    return res.status(200).send(dataCategory)
}
