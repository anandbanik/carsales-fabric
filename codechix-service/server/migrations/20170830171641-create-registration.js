module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Registration', {
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vin_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeReg',
        primaryKey: true,
      },
      tag_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      insurance_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ssn_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeReg',
        primaryKey: true,
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
    queryInterface.dropTable('Registration'),
  
};