const express = require('express');
const clienteController = require('../controladores/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obtener);
router.post('/', clienteController.crear);
router.put('/:id', clienteController.actualizar);
router.patch('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

module.exports = router;
