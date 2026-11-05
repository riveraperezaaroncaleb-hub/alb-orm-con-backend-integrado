const express = require('express');

const almacenRoutes = require('./routes/almacenRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const compraRoutes = require('./routes/compraRoutes');
const detalleCompraRoutes = require('./routes/detalleCompraRoutes');
const detalleMovimientoRoutes = require('./routes/detalleMovimientoRoutes');
const detalleVentaRoutes = require('./routes/detalleVentaRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const impuestoRoutes = require('./routes/impuestoRoutes');
const loteRoutes = require('./routes/loteRoutes');
const metodoPagoRoutes = require('./routes/metodoPagoRoutes');
const movimientoInventarioRoutes = require('./routes/movimientoInventarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const sucursalRoutes = require('./routes/sucursalRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando.' });
});

app.use('/api/almacenes', almacenRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/detalle-compras', detalleCompraRoutes);
app.use('/api/detalle-movimientos', detalleMovimientoRoutes);
app.use('/api/detalle-ventas', detalleVentaRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/impuestos', impuestoRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/movimientos-inventario', movimientoInventarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', ventaRoutes);

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
