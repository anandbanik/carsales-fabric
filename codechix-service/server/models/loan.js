module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    customer_id: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    vin_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeLoan',
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loan_period_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    apr: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    ssn_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeLoan',
      primaryKey: true,
    },
    monthly_payment: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    status:{
      type: DataTypes.STRING  ,
      allowNull: true,
    },
    
  },
  {
      timestamps: false,
      freezeTableName: true,
      tableName: 'loan'
  }
  );
  return Loan;
};