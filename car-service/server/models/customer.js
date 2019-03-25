
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allownull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ssn_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
  return Customer;
};