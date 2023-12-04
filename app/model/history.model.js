module.exports = (sequelize, dataTypes) => {
    const history = sequelize.define('history', {
        historyId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        },
        userId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false  
        },
        bookId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false  
        }
    })
    history.associate = function(models) {

        history.belongsTo(models.user, {
            foreignKey: 'userId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
        history.belongsTo(models.book, {
            foreignKey: 'bookId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
    }
    return history;
}