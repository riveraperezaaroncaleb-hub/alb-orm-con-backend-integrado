const express = require('express');

const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);
app.use('/api/proveedores', authMiddleware, proveedorRoutes);
app.use('/api/usuarios', authMiddleware, usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada.',
    metodo: req.method,
    ruta: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

module.exports = app;
