let nodemailer = require('nodemailer');
exports.getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

exports.getCurrentDateTime = () => {
    var now = new Date();
    var DD = String(now.getDate()).padStart(2, '0');
    var MM = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = now.getFullYear();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    today = YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
    return today;
}

exports.formatDateTime = (date) => {
    var DD = String(date.getDate()).padStart(2, '0');
    var MM = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = date.getFullYear();
    var hh = String(date.getHours()).padStart(2, '0');
    var mm = String(date.getMinutes()).padStart(2, '0');
    var ss = String(date.getSeconds()).padStart(2, '0');
    dateFormat = DD + '-' + MM + '-' + YYYY + ' ' + hh + ':' + mm + ':' + ss;
    return dateFormat; 
}

exports.getDateTimeFromDate = (dateStr) => {
    var date = new Date(dateStr)
    var DD = String(date.getDate()).padStart(2, '0');
    var MM = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = date.getFullYear();
    dateFormat = YYYY + '-' + MM + '-' + DD + ' ' + '00' + ':' + '00' + ':' + '00';
    return dateFormat; 
}

exports.differentDate = (date1, date2) => {
    return Math.abs(date1.getTime() - date2.getTime());
}

exports.generateForgotCode = () => {
    let a = 999999;
    return a.toString();
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendEmail = ( senderEmail, recipientEmail, password, code) => {
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: password
        }
    });
    var mailOptions = {
        from: senderEmail,
        to: recipientEmail,
        subject: 'Code to reset password Audify',
        html: '<p>Here is your verification code: ' + code + '</p>'
    };
    mail.sendMail(mailOptions, (err) => {
        if (err) {
            return {code: -2, err: err.message} 
        } else {
            return {code: 1}
        }
    })
    return {code: 1}
}
