module.exports = {
    HOST: "localhost",
    PORT: 3306,
    USER: "root",
    PASSWORD: "1234",
    DB: "audify",
    dialect: "mysql",
    timezone: "Asia/Ho_Chi_Minh",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }