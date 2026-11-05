'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_ventas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      cantidad: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      precioUnitario: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      descuento: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuestoPorcentaje: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuesto: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      ventaId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'ventas', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      productoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'productos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      loteId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'lotes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      impuestoId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'impuestos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('detalle_ventas', ['ventaId'], { name: 'detalle_ventas_venta_index' });
    await queryInterface.addIndex('detalle_ventas', ['productoId'], { name: 'detalle_ventas_producto_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('detalle_ventas');
  }
};
