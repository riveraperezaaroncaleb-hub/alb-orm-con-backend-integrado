'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movimientos_inventario', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      tipo: { type: Sequelize.ENUM('entrada', 'salida', 'ajuste'), allowNull: false },
      referencia: { type: Sequelize.STRING(100), allowNull: true },
      observaciones: { type: Sequelize.STRING(500), allowNull: true },
      almacenId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'almacenes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      usuarioId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'usuarios', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('movimientos_inventario', ['almacenId', 'fecha'], { name: 'movimientos_almacen_fecha_index' });
    await queryInterface.addIndex('movimientos_inventario', ['tipo'], { name: 'movimientos_tipo_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('movimientos_inventario');
  }
};
