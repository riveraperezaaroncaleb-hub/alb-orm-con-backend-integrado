const express = require('express');
const proveedorController = require('../controladores/proveedorController');

const router = express.Router();

router.get('/', proveedorController.listar);
router.get('/:id', proveedorController.obtener);
router.post('/', proveedorController.crear);
router.put('/:id', proveedorController.actualizar);
router.patch('/:id', proveedorController.actualizar);
router.delete('/:id', proveedorController.eliminar);

module.exports = router;
