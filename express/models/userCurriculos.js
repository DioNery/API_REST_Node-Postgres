const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserCurriculo = sequelize.define("userCurriculo", {

      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      TextoCurriculo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
  }
);

  UserCurriculo.createUser = async (username, TextoCurriculo) => {
    try {
      const newUser = await UserCurriculo.create({
        username: username,
        TextoCurriculo: TextoCurriculo,
      });
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  // Associação de tabelas
  UserCurriculo.associate = (models) => {
    UserCurriculo.hasMany(models.TextoCurriculo, { onDelete: "CASCADE" });
  };

  // Encontrar todos os usuários
  UserCurriculo.findAllUsers = async () => {
    try {
      const users = await UserCurriculo.findAll();
      return users;
    } catch (error) {
      console.error('Erro ao encontrar todos os usuários:', error);
      throw error;
    }
  };

  return UserCurriculo;
};
