'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('compras', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      numeroCompra: { type: Sequelize.STRING(50), allowNull: false },
      fechaCompra: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      estado: { type: Sequelize.ENUM('borrador', 'recibida', 'cancelada'), allowNull: false, defaultValue: 'borrador' },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuestoTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      observaciones: { type: Sequelize.STRING(500), allowNull: true },
      proveedorId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'proveedores', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      almacenId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'almacenes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      usuarioId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'usuarios', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      metodoPagoId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'metodos_pago', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('compras', ['numeroCompra'], { unique: true, name: 'compras_numero_unique' });
    await queryInterface.addIndex('compras', ['proveedorId'], { name: 'compras_proveedor_index' });
    await queryInterface.addIndex('compras', ['almacenId'], { name: 'compras_almacen_index' });
    await queryInterface.addIndex('compras', ['fechaCompra'], { name: 'compras_fecha_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('compras');
  }
};
