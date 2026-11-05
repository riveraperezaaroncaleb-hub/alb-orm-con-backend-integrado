const express = require('express');
const productoController = require('../controladores/productoController');

const router = express.Router();

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.patch('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
