const express = require('express');
const proveedorController = require('../controladores/proveedorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', proveedorController.listar);
router.get('/:id', proveedorController.obtener);
router.post('/', proveedorController.crear);
router.put('/:id', proveedorController.actualizar);
router.patch('/:id', proveedorController.actualizar);
router.delete('/:id', proveedorController.eliminar);

module.exports = router;
