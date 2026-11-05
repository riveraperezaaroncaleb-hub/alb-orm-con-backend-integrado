'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ventas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      numeroVenta: { type: Sequelize.STRING(50), allowNull: false },
      fechaVenta: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      estado: { type: Sequelize.ENUM('borrador', 'completada', 'cancelada'), allowNull: false, defaultValue: 'borrador' },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      descuentoTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      impuestoTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      observaciones: { type: Sequelize.STRING(500), allowNull: true },
      clienteId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'clientes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
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

    await queryInterface.addIndex('ventas', ['numeroVenta'], { unique: true, name: 'ventas_numero_unique' });
    await queryInterface.addIndex('ventas', ['clienteId'], { name: 'ventas_cliente_index' });
    await queryInterface.addIndex('ventas', ['almacenId'], { name: 'ventas_almacen_index' });
    await queryInterface.addIndex('ventas', ['fechaVenta'], { name: 'ventas_fecha_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ventas');
  }
};
