module.exports = (sequelize, dataTypes) => {
    const category = sequelize.define('category', {
        categoryId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false    
        },
        name: {            
            type: dataTypes.STRING,
            allowNull: false
        },
    })
    category.associate = function(models) {
        // // associations can be defined here
        category.hasMany(models.book, {
            foreignKey: 'categoryId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
    }
    return category;
}