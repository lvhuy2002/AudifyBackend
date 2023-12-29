const db = require("../../model/index.js");
const util = require("../util.js")
const csv = require('csv-parser');
const fs = require('fs');

const User = db.user;
const Book = db.book;
const Assess = db.assess;
const Category = db.category;
const History = db.history;
const Chapter = db.chapter;
const commonExecute = require("../executeDB/common.execute.js");


exports.init = async (req, res) => {
    const results = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream('harry_potter_books.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve());
    });
    
    let book = [];
    let chapter = [];
    let text = results[0].text;
    let chapterNum = 1;
    let bookName = results[0].book;
    for (let i = 1; i < results.length; i++) {
        if (results[i].book !== results[i - 1].book || i === results.length - 1) {
            book.push({name: bookName, chapter: chapter})
            //
            chapter = [];
            text = results[i].text;
            chapterNum = 1;
            bookName = results[i].book;
        } else {
            if (results[i].chapter !== results[i - 1].chapter) {
                chapter.push({content: text, number: chapterNum})
                //
                text = results[i].text;
                chapterNum++;
            } else {
                text += " " + results[i].text;
            }
        }
    }
    console.log(book[6])
    let categoryValue = [{name: "Fiction"}, {name: "Self help"}, {name: "Academic"}, {name: "Non fiction"}, {name: "History"}]
    let categoryData = commonExecute.createManyData(Category, categoryValue)
    for (let b = 0; b < book.length; b++) {
        let conditionCategory = {
            name: "Fiction"
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
            title: book[b].name,
            description: "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's conflict with Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic, and subjugate all wizards and Muggles (non-magical people).",
            author: "J. K. Rowling",
            coverImgURL: "img/coverBook/harry-porter" + (b + 1).toString() + ".jpg"
        }
        //console.log(valueBook)
        let dataBook = await commonExecute.createData(Book, valueBook); 
        if (dataBook.code == -2) {
            return res.status(400).send({ message: "Error occurred when create book", err: dataBook.err })
        }

        let valueChapter = [];
        for (var i = 0; i < book[b].chapter.length; i++) {
            valueChapter.push({
                bookId: dataBook.bookId,
                content: book[b].chapter[i].content,
                number: book[b].chapter[i].number
            })
        } 
        let dataChapter = await commonExecute.createManyData(Chapter, valueChapter);
        if (dataChapter.code == -2) {
            return res.status(400).send({ message: "Error occurred when create chapter", err: dataChapter.err })
        }
    }
    //console.log(book[0].chapter[1]);
    return res.status(200).send("ok")
}
