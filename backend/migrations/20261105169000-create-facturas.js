'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('facturas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      numeroFactura: { type: Sequelize.STRING(80), allowNull: false },
      fechaEmision: { type: Sequelize.DATEONLY, allowNull: false },
      fechaVencimiento: { type: Sequelize.DATEONLY, allowNull: true },
      estado: { type: Sequelize.ENUM('borrador', 'emitida', 'anulada'), allowNull: false, defaultValue: 'borrador' },
      moneda: { type: Sequelize.STRING(3), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      impuestoTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      nombreFiscal: { type: Sequelize.STRING(150), allowNull: true },
      identificacionFiscal: { type: Sequelize.STRING(50), allowNull: true },
      direccionFiscal: { type: Sequelize.STRING(255), allowNull: true },
      ventaId: {
        type: Sequelize.INTEGER, allowNull: false, unique: true,
        references: { model: 'ventas', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('facturas', ['numeroFactura'], { unique: true, name: 'facturas_numero_unique' });
    await queryInterface.addIndex('facturas', ['fechaEmision'], { name: 'facturas_fecha_emision_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('facturas');
  }
};
