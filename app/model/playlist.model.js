module.exports = (sequelize, dataTypes) => {
    const playlist = sequelize.define('playlist', {
        playlistId: {
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
        name: {
            type: dataTypes.STRING,
            unique: true,
            allowNull: false
        }
    })
    playlist.associate = function(models) {
        // // associations can be defined here
        playlist.belongsToMany(models.book, {
            through: models.bookOfPlaylist,
            foreignKey: 'playlistId',
        })
    }
    return playlist;
}