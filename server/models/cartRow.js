module.exports = (sequelize, DataTypes) => {
  const CartRow = sequelize.define(
    "cartrow",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );
  return CartRow;
};
