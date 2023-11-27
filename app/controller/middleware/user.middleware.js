const db = require("../../model/index.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require("../util.js")
const config = require("../../config/config.js");

const User = db.user;
const commonExecute = require("../executeDB/common.execute.js");

exports.register = async (req, res) => {
    let {email, password, firstName, lastName} = req.body;
    if (password === undefined || firstName === undefined || lastName === undefined || email === undefined
        || password === "" || firstName === "" || lastName === "" || email === "") {
            return res.status(400).send({ message: "Missing field!" })
    }
    var emailChecker = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!emailChecker.test(email)) {
        return res.status(400).send({ message: "Email invalid!" })
    }

    let condition = {
        email: email
    }
    let findAccount = await commonExecute.findManyData(User, condition);
    if (findAccount.code !== -2 && findAccount.length !== 0) {
        return res.status(400).send({ message: "Email has already existed!" })
    }

    // tao mat khau ma hoa 
    let salt = bcrypt.genSaltSync(10);
    let passwordHash = bcrypt.hashSync(password, salt);

    // lay anh default
    let imgURL = "img/default/" + firstName[0].toLowerCase() + ".png";

    let value = {
        email: email,
        password: passwordHash,
        firstName: firstName,
        lastName: lastName,
        imgURL: imgURL
    }

    let dataAccount = await commonExecute.createData(User, value);
    if (dataAccount.code === -2) {
        return res.status(500).send({ message: "Failed to create account", err: dataAccount.err })
    }
    dataAccount.imgURL = req.protocol + '://' + req.get('host') + '/' + dataAccount.imgURL; 
    delete dataAccount.password
    delete dataAccount.createdAt
    delete dataAccount.updatedAt
    return res.status(200).send(dataAccount)
}

exports.login = async (req, res) => {
    var {email, password} = req.body;
    if (email === undefined || password === undefined || email === "" || password === "") {
        return res.status(400).send({ message: "Missing field!" })
    }

    // kiem tra xem co email trong database khong
    let condition = {
        email: email
    }
    let dataAccount = await commonExecute.findManyData(User, condition)
    
    if (dataAccount.code === -2) {
        return res.status(500).send({ message: "Failed to login", err: dataAccount.err })
    }
    if (!dataAccount.length) {
        return res.status(400).send({ message: "Email or password is incorrect!" })
    }
  
    // kiem tra mat khau
    if (!bcrypt.compareSync(password, dataAccount[0].dataValues.password)) {
        return res.status(400).send({ message: "Email or password is incorrect!" })
    }

    // tao token JWT
    let informationAuth = {
        email: email,
        userId: dataAccount[0].dataValues.userId
    }

    const accessToken = jwt.sign(informationAuth, config.ACCESS_TOKEN_SECRET)

    return res.status(200).send({accessToken: accessToken})
}

exports.authorizationJWT = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    // cat chuoi "bearer" ra chi lay token
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).send({ message: "Missing token to authorize" })
    }
    console.log(token)
    try {
        // xac thuc token sync
        const decodeToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET)
        console.log(decodeToken.userId)
        // xac thuc thong tin token
        let condition = {
            userId: decodeToken.userId
        }
        let dataAccount = await commonExecute.findManyData(User, condition);
        if (dataAccount.length === 0 || dataAccount.code === -2) {
            return res.status(403).send({ message: "Forbidden!" })
        } 
        req.dataAccount = dataAccount[0].dataValues;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: "Unable to verify token!", err })
    }
}

exports.getInfo = async (req, res) => {
    var dataAccount = req.dataAccount;
    dataAccount.imgURL = req.protocol + '://' + req.get('host') + '/' + dataAccount.imgURL; 

    delete dataAccount.password
    delete dataAccount.createdAt
    delete dataAccount.updatedAt
    
    return res.status(200).send(dataAccount)
}


exports.changeInfo = async (req, res) => {
    const dataAccount = req.dataAccount;
    const {firstName, lastName, email} = req.body
    const {userId} = dataAccount;
    if (firstName == undefined && lastName == undefined && email == undefined) {
        return res.status(400).send({ message: "Nothing to change!" })
    }
    let condition = {
        userId: userId
    }
    let value = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    let resultUpdate = commonExecute.updateData(User, value, condition);
    if (resultUpdate.code === -1) {
        return res.status(400).send({ message: 'Unable to update user info!' })
    }
    if (resultUpdate.code === -2) {
        return res.status(400).send({ message: "Unable to update user info!", err: result.err })
    }
    return res.status(200).send({ message: 'Updated successfully' })
}

exports.sendResetCode = async (req, res) => {
    const {email} = req.body
    if (email === undefined || email === "") {
        return res.status(400).send({ message: "Missing field!" })
    }
    var emailChecker = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!emailChecker.test(email)) {
        return res.status(400).send({ message: "Email invalid!" })
    }

    let randomCode = util.generateForgotCode();
    let condition = {
        email: email
    }
    let value = {
        resetCode: randomCode,
        timeOfResetCode: new Date()
    }
    let resultUpdate = await commonExecute.updateData(User, value, condition);
    if (!resultUpdate) {
        return res.status(400).send({ message: "Create code unsuccessfully" })
    }
    if (resultUpdate.code === -2) {
        return res.status(500).send({ message: "Error ocurred when create code", err: resultUpdate.err})
    }

    util.sendEmail(config.ADMIN_EMAIL, email, config.PASSWORD, randomCode);
    return res.status(200).send({message: "Code has been sent to email"})
}

exports.verifyResetCode = async (req, res) => {
    const {email, code} = req.body
    
    if (email === undefined || email === "" || code === undefined || code === null) {
        return res.status(400).send({ message: "Missing field!" })
    }
    if (req.body.code.length !== 6) {
        return res.status(400).send({message: "Wrong code"});
    }
    var emailChecker = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!emailChecker.test(email)) {
        return res.status(400).send({ message: "Email invalid!" })
    }

    let condition = {
        email: email
    }
    let dataAccount = await commonExecute.findOneData(User, condition);
    if (dataAccount.code === -1) {
        return res.status(400).send({ message: "Email isn't exist" })
    }
    if (dataAccount.code === -2) {
        return res.status(500).send({ message: "Error ocurred when find account", err: resultUpdate.err})
    }
    if (util.differentDate(new Date(), dataAccount.timeOfResetCode) > 1000*60*5) {
        return res.status(400).send({ message: "Code was expired" })
    }
    if (dataAccount.resetCode !== code) {
        return res.status(400).send({ message: "Wrong code"})
    }
    
    let informationAuth = {
        email: email,
        userId: dataAccount.userId
    }

    const accessToken = jwt.sign(informationAuth, config.ACCESS_TOKEN_SECRET)

    return res.status(200).send({message: "Code has been verified ", accessToken: accessToken})
}

exports.resetPassword = async (req, res) => {
    const dataAccount = req.dataAccount;
    const {newPassword} = req.body
    const {userId} = dataAccount;
    if (newPassword === undefined || newPassword === "") {
        return res.status(400).send({ message: "Password is empty" })
    }

    // tao mat khau ma hoa 
    let salt = bcrypt.genSaltSync(10);
    let passwordHash = bcrypt.hashSync(newPassword, salt);
    
    let condition = {
        userId: userId
    }
    let value = {
        password: passwordHash
    }
    let resultUpdate = commonExecute.updateData(User, value, condition);
    if (resultUpdate.code === -1) {
        return res.status(400).send({ message: 'Unable to update user info!' })
    }
    if (resultUpdate.code === -2) {
        return res.status(400).send({ message: "Unable to update user info!", err: result.err })
    }
    return res.status(200).send({ message: 'Updated successfully' })
}


