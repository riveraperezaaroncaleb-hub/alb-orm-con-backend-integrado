const express = require('express');
const productoController = require('../controladores/productoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.patch('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
