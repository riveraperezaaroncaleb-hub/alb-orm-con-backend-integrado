'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_movimientos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      cantidad: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      costoUnitario: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      observaciones: { type: Sequelize.STRING(255), allowNull: true },
      movimientoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'movimientos_inventario', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      productoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'productos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      loteId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'lotes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('detalle_movimientos', ['movimientoId'], { name: 'detalle_movimientos_movimiento_index' });
    await queryInterface.addIndex('detalle_movimientos', ['productoId'], { name: 'detalle_movimientos_producto_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('detalle_movimientos');
  }
};
