module.exports = (sequelize, dataTypes) => {
    const history = sequelize.define('history', {
        historyId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        }
    })
    return history;
}