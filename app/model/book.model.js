module.exports = (sequelize, dataTypes) => {
    const book = sequelize.define('book', {
        bookId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        },
        categoryId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false
        },
        title: {            
            type: dataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        rate: {
            type: dataTypes.FLOAT
        },
        view: {
            type: dataTypes.INTEGER,
            defaultValue: 0
        },
        author: {
            type: dataTypes.STRING,
            allowNull: false
        },
        coverImgURL: {
            type: dataTypes.TEXT,
            allowNull: false
        }
    })
    book.associate = function(models) {
        // associations can be defined here
        book.hasMany(models.chapter, {
            foreignKey: 'bookId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
        book.belongsTo(models.category, {
            foreignKey: 'categoryId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })

        book.hasMany(models.history, {
            foreignKey: 'bookId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })

        book.belongsToMany(models.user, {
            through: models.assess,
            foreignKey: 'bookId',
        })
        
        book.belongsToMany(models.playlist, {
            through: models.bookOfPlaylist,
            foreignKey: 'bookId',
        })
    }
    return book;
}