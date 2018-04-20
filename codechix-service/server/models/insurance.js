module.exports = (sequelize, DataTypes) => {
  const Insurance = sequelize.define('Insurance', {
    customer_id: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    vin_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIns',
      primaryKey: true,
    },
    coverage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    monthly_cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
      unique: 'compositeIns',
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
      tableName: 'insurance'
  }
  );
  return Insurance;
};