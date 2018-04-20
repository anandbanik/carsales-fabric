module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Insurance', {
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vin_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coverage: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      monthly_cost: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }),
  down: (queryInterface ) =>
    queryInterface.dropTable('Insurance'),
  
};