'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('impuestos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      codigo: { type: Sequelize.STRING(30), allowNull: true },
      porcentaje: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      descripcion: { type: Sequelize.STRING(255), allowNull: true },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('impuestos', ['nombre'], { unique: true, name: 'impuestos_nombre_unique' });
    await queryInterface.addIndex('impuestos', ['codigo'], { unique: true, name: 'impuestos_codigo_unique' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('impuestos');
  }
};
