const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres', 
  host: process.env.BANCO_URL,
  username: process.env.USUARIO_BD,
  password: process.env.SENHA_BD,
  database: process.env.DATABASE_BD,
  port: 5432,
});

//Criação de Modelo do Usuario
const getUserModel = (sequelize, { DataTypes }) => {
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
    });
  
    // Associação de tabelas
    UserCurriculo.associate = (models) => {
      UserCurriculo.hasMany(models.TextoCurriculo, { onDelete: "CASCADE" });
    };
  
    // Encontrar pelo Login
    UserCurriculo.findByLogin = async (login) => {
      let user = await UserCurriculo.findOne({
        where: { username: login },
      });
      return user;
    };
  
    // Método para criar um novo usuário
    UserCurriculo.createUser = async (userData) => {
      try {
        const user = await UserCurriculo.create(userData);
        return user;
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
    };

    // Método para encontrar todos os usuários
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
  
  export default getUserModel;
  