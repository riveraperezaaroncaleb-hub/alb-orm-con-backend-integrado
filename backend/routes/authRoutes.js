const express = require('express');
const authController = require('../controladores/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.registrar);
router.post('/login', authController.iniciarSesion);
router.get('/perfil', authMiddleware, authController.perfil);

module.exports = router;
