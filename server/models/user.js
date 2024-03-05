module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [4, 20],
          isFirstName: true,
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [4, 20],
          isLastName: true,
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [4, 200],
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  return User;
};
