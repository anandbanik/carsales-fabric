
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Vehicles', {
      vin_number: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      vehicle_type: {
        type: Sequelize.STRING
      },
      vehicle_make: {
        type: Sequelize.STRING
      },
      vehicle_model: {
        type: Sequelize.STRING
      },
      vehicle_year: {
        type: Sequelize.INTEGER
      },
      vehicle_color: {
        type: Sequelize.STRING
      },
      list_price: {
        type: Sequelize.INTEGER
      },
      actual_price: {
        type: Sequelize.INTEGER
      },
      /*
      actual_price: {
        type: Sequelize.INTEGER
      },
      */
      image_path: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }),
  down: (queryInterface ) =>
    queryInterface.dropTable('Vehicles'),
  
};