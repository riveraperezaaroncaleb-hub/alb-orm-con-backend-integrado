'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_compras', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      cantidad: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      costoUnitario: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      descuento: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuestoPorcentaje: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuesto: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      compraId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'compras', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      productoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'productos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      impuestoId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'impuestos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('detalle_compras', ['compraId'], { name: 'detalle_compras_compra_index' });
    await queryInterface.addIndex('detalle_compras', ['productoId'], { name: 'detalle_compras_producto_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('detalle_compras');
  }
};
