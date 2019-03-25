module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Loan', {
      /*id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },*/
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vin_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      loan_period_months: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      apr: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      ssn_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      monthly_payment: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
    }),
  down: (queryInterface ) =>
    queryInterface.dropTable('Loan'),
  
};