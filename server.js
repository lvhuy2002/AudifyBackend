const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')
const cors = require("cors")

require('dotenv').config()
const app = express()

var corsOptions = {
    origin: "*",
    method: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions))
//app.use(require("./app/middleware/middleware.js").UpdateDatabase)

app.get("/", (req, res) => {
    res.json({ message: "Audify Server!!!!!!!!" })
})
app.use('/img', express.static('./img'));
app.use("/api/user", require("./app/router/user.router.js"))
app.use("/api/book", require("./app/router/book.router.js"))
app.use("/api/category", require("./app/router/category.router.js"))
app.use("/api/playlist", require("./app/router/playlist.router.js"))
app.use("/api/assess", require("./app/router/assess.router.js"))
app.use("/api/init", require("./app/router/init.router.js"))
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'))
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})


const db = require("./app/model")

db.sequelize.sync({ force: true })
//db.sequelize.sync();
//db.sequelize.sync({ alter: true });