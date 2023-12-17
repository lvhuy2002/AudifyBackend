const db = require("../../model/index.js");
exports.createData = (model, value) => {
    return model.create(value).then(data => {
        return data.dataValues
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.createManyData = (model, value) => {
    return model.bulkCreate(value).then(data => {
        return data
    }).catch(err => {
        return {code: -2, err: err.message}
    });
}

exports.updateData = (model, value, condition) => {
    return model.update(value,{
        where: condition
    }).then(data => {
        if (!data[0]) {
            return {code: -1}
        }
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.findOneData = (model, condition) => {
    return model.findOne({
        where: condition
    }).then(data => {
        if (data === null) {
            return {code: -1}
        }
        return data.dataValues;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.findManyData = (model, condition) => {
    return model.findAll({
        where: condition
    }).then(data => {
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.deleteData = (model, condition) => {
    return model.destroy({
        where: condition
    }).then(data => {
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.findOrCreateData = (model, condition, value) => {
    return model.findOrCreate({
        where: condition,
        default: value
    }).then(data => {
        return data[0].dataValues;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}


exports.countData = (model, condition) => {
    return model.count({
        where: condition
    }).then (data => {
        return data;
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

exports.averageData = (model, colName, condition) => {
    return model.findOne({
        where: condition,
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col(colName)), 'average']]
    }).then (data => {
        return data.dataValues.average
    }).catch(err => {
        return {code: -2, err: err.message}
    })
}

