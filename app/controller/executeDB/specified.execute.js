exports.getBookFromPlaylist = (playlistModel, bookModel, condition) => {
    return playlistModel.findAll({
        where: condition,
        include: [{
            model: bookModel,
            through: {
                attribute: []
            }
        }]
    }).then(data => {
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.getAssessOfBook = (bookModel, userModel, condition) => {
    return bookModel.findAll({
        where: condition,
        include: [{
            model: userModel
        }]
    }).then(data => {
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}