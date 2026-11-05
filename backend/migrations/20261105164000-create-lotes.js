'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lotes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      codigoLote: { type: Sequelize.STRING(80), allowNull: false },
      fechaFabricacion: { type: Sequelize.DATEONLY, allowNull: true },
      fechaVencimiento: { type: Sequelize.DATEONLY, allowNull: true },
      cantidadInicial: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      cantidadDisponible: { type: Sequelize.DECIMAL(12, 3), allowNull: false },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      productoId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'productos', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      almacenId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'almacenes', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      compraId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'compras', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('lotes', ['codigoLote', 'productoId', 'almacenId'], {
      unique: true,
      name: 'lotes_codigo_producto_almacen_unique'
    });
    await queryInterface.addIndex('lotes', ['fechaVencimiento'], { name: 'lotes_vencimiento_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lotes');
  }
};
