'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('productos', 'almacenId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('productos', {
      fields: ['almacenId'],
      type: 'foreign key',
      name: 'productos_almacen_id_fk',
      references: {
        table: 'almacenes',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('productos', ['almacenId'], {
      name: 'productos_almacen_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('productos', 'productos_almacen_id_fk');
    await queryInterface.removeIndex('productos', 'productos_almacen_id_index');
    await queryInterface.removeColumn('productos', 'almacenId');
  },
};
