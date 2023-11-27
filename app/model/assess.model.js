module.exports = (sequelize, dataTypes) => {
    const assess = sequelize.define('assess', {
        assessId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        },
        rate: {
            type: dataTypes.INTEGER
        },
        comment: {
            type: dataTypes.STRING,
        },
 
    })
    
    return assess;
}