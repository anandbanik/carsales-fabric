module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Negotiation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vin_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      actual_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      comments: {
        allowNull: true,
        type: Sequelize.STRING
      },
      dealer_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
    }),
  down: (queryInterface ) =>
    queryInterface.dropTable('Negotiation'),
  
};