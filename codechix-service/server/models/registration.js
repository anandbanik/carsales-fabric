module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    customer_id: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    vin_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeReg',
      primaryKey: true,
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ssn_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeReg',
      primaryKey: true,
    },
    status:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
      timestamps: false,
      freezeTableName: true,
      tableName: 'registration'
  }
  );
  return Registration;
};