const dbConfig = require("../config/db.config.js");

const { Sequelize, DataTypes } = require('sequelize');
// tao db
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone,
    define: {
        freezeTableName: true
    },
  });

const db = {};

db.dataTypes = DataTypes;
db.sequelize = sequelize;

// // thuc hien viec tao table
db.book = require("./book.model.js")(sequelize, DataTypes);
db.bookOfPlaylist = require("./bookOfPlaylist.model.js")(sequelize, DataTypes);
db.category = require("./category.model.js")(sequelize, DataTypes);
db.history = require("./history.model.js")(sequelize, DataTypes);
db.playlist = require("./playlist.model.js")(sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, DataTypes);
//db.chapter = require("./chapter.model.js")(sequelize, DataTypes);
db.assess = require("./assess.model.js")(sequelize, DataTypes);

//db.author.associate(db);
db.book.associate(db);
//db.chapter.associate(db);
db.category.associate(db);
db.playlist.associate(db);
db.user.associate(db);


module.exports = db;