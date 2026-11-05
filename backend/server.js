const path = require('path');
const fs = require('fs');
const envFiles = [
  path.join(__dirname, '.env.local'),
  path.join(__dirname, '.env')
].filter((file) => fs.existsSync(file));

if (envFiles.length > 0) {
  require('dotenv').config({ path: envFiles });
}

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida.');
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();
