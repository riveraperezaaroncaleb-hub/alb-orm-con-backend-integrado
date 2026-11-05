const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const assistantController = require('../controladores/assistantController');

const router = express.Router();

router.use(authMiddleware);
router.get('/estado', assistantController.estado);
router.post('/chat', assistantController.consultar);

module.exports = router;
