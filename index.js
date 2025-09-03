// importaciones en node
const express = require('express');
require('dotenv').config(); // importar variables de entorno
const { dbConnection } = require('./database/config'); // importar la conexion a la base de datos
const cors = require('cors'); // importar cors

// crear (o inicializar) el servidor de express
const app = express();

// configurar CORS (sirve para permitir que el servidor reciba peticiones desde otros dominios)
app.use(cors());

// lectura y parseo del body (sirve para leer los datos que se envian en el body de la peticion)
app.use(express.json());

// base de datos
dbConnection();

// para levantar el servidor
app.listen(process.env.PORT, () => {
	console.log('Server corriendo en el puerto ' + process.env.PORT);
});

// rutas
// middleware para cuando se haga una peticion a la ruta /api/usuarios se use el router de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));

app.use('/api/login', require('./routes/auth'));