const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserCurriculo = sequelize.define('UserCurriculo', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TextoCurriculo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,  // Assumindo que o ID do usuário no Firebase é uma string
      allowNull: false,
    },
  });

  UserCurriculo.createUser = async function ({ username, TextoCurriculo, userId }) {
    return UserCurriculo.create({
      username,
      TextoCurriculo,
      userId,
    });
  };

  UserCurriculo.findAllUsers = async function () {
    return UserCurriculo.findAll();
  };

  return UserCurriculo;
};
