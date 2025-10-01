// importaciones en node
const express = require('express');
require('dotenv').config(); // importar variables de entorno
const path = require('path'); // importar path
const { dbConnection } = require('./database/config'); // importar la conexion a la base de datos
const cors = require('cors'); // importar cors

// crear (o inicializar) el servidor de express
const app = express();

// configurar CORS (sirve para permitir que el servidor reciba peticiones desde otros dominios)
app.use(cors());

// carpeta publica
app.use((express.static('public')));

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
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

// si no se cumple ninguna de las rutas anteriores, enviar el index.html (debe ir al final de todas las rutas)
app.get('*', (request, response) => {
	response.sendFile(path.resolve(__dirname, 'public/index.html'));
})