const getUserModel = (sequelize, { DataTypes }) => {
    const UserCurriculo = sequelize.define("user", {
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
      UserCurriculo.hasMany(models.Message, { onDelete: "CASCADE" });
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