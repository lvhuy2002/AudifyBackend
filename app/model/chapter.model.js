module.exports = (sequelize, dataTypes) => {
    const chapter = sequelize.define('chapter', {
        chapterId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        },
        bookId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false
        },
        content: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        number: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    })
    chapter.associate = function(models) {
        // // associations can be defined here
        chapter.belongsTo(models.book, {
            foreignKey: 'bookId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
    }
    return chapter;
}