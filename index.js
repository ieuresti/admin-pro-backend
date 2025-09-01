// importaciones en node
const express = require('express');
require('dotenv').config(); // importar variables de entorno
const { dbConnection } = require('./database/config'); // importar la conexion a la base de datos
const cors = require('cors'); // importar cors

// crear (o inicializar) el servidor de express
const app = express();

// configurar CORS
app.use(cors());

// base de datos
dbConnection();

// para levantar el servidor
app.listen(process.env.PORT, () => {
	console.log('Server corriendo en el puerto ' + process.env.PORT);
});

// rutas
app.get('/', (request, response) => {
	response.json({
		ok: true,
		mensaje: 'Hola mundo'
	});
});