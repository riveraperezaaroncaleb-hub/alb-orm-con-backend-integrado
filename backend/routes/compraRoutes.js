const express = require('express');
const controller = require('../controladores/compraController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.patch('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
