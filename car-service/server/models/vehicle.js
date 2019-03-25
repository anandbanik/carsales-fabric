
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    vin_number: {
      type: DataTypes.STRING,
      allownull: false,
      primaryKey: true,
    },
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_make: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_model:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_year:{
        type:  DataTypes.INTEGER,
        allowNull: true,
    },
    vehicle_color:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    list_price:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    /*
    actual_price:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    */
    image_path:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
    }
  });
  return Vehicle;
};