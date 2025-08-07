import express from 'express';
import cors from 'cors';
import { sequelize } from './db/config.js';
import dotenv from 'dotenv';
import routerApi from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

routerApi(app);

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo de errores
app.use(errorHandler);

const testConnection = async () => {
  try {
    console.log('Intentando conectar a la base de datos con los siguientes parámetros:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Puerto: ${process.env.DB_PORT}`);
    console.log(`Usuario: ${process.env.DB_USER}`);
    console.log(`Base de datos: ${process.env.DB_NAME}`);
    // No imprimas la contraseña por seguridad
    
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
  }
};
testConnection();


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});