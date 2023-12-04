module.exports = (sequelize, dataTypes) => {
    const assess = sequelize.define('assess', {
        rate: {
            type: dataTypes.INTEGER
        },
        comment: {
            type: dataTypes.STRING,
        },
 
    })
    
    return assess;
}