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
    });
  
    UserCurriculo.associate = (models) => {
      UserCurriculo.hasMany(models.TextoCurriculo, { onDelete: "CASCADE" });
    };
  
    UserCurriculo.findByLogin = async (login) => {
      let user = await UserCurriculo.findOne({
        where: { username: login },
      });
  
      // if (!user) {
      //   user = await User.findOne({
      //     where: { email: login },
      //   });
      // }
  
      return user;
    };
  
    return UserCurriculo;
  };
  
  export default getUserModel;