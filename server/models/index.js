"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Relations
db.user.hasMany(db.cart, { foreignKey: "user_id" });
db.cart.belongsTo(db.user, {
  foreignKey: "user_id",
  allowNull: false,
  onDelete: "CASCADE",
});

db.cartRow.belongsTo(db.cart, { foreignKey: "cart_id" });
db.cart.hasMany(db.cartRow, { foreignKey: "cart_id" });

db.product.hasMany(db.cartRow, { foreignKey: "product_id" });
db.cartRow.belongsTo(db.product, { foreignKey: "product_id" });

db.product.hasMany(db.rating, { foreignKey: "product_id" });
db.rating.belongsTo(db.product, { foreignKey: "product_id" });
