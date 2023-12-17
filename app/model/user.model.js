module.exports = (sequelize, dataTypes) => {
    const user = sequelize.define('user', {
        userId: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: dataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: dataTypes.STRING,
            allowNull: false
        },
        imgURL: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        resetCode: {
            type: dataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        timeOfResetCode: {
            type: dataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    })
    user.associate = function(models) {
        // // associations can be defined here
        user.hasMany(models.history, {
            foreignKey: 'userId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
        user.belongsToMany(models.book, {
            through: models.assess,
            foreignKey: 'userId',
        })
        user.hasMany(models.playlist,  {
            foreignKey: 'userId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        })
    }
    return user;
}