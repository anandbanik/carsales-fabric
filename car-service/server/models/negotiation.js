
module.exports = (sequelize, DataTypes) => {
  const Negotiation = sequelize.define('Negotiation', {
    vin_number: {
      type: DataTypes.STRING,
      allownull: false,
      unique: 'compositeNegotiation',
      primaryKey: true,
    },
    actual_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dealer_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ssn_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeNegotiation',
        primaryKey: true,
      },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
    }
  },
  {
      timestamps: true,
      freezeTableName: true,
      tableName: 'vehicle_negotiation'
  }
  );
  return Negotiation;
};