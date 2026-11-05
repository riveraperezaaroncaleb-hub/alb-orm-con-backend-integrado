'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('metodos_pago', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      descripcion: { type: Sequelize.STRING(255), allowNull: true },
      requiereReferencia: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('metodos_pago', ['nombre'], { unique: true, name: 'metodos_pago_nombre_unique' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('metodos_pago');
  }
};
