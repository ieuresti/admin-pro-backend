const mongoose = require('mongoose');

// Configuracion de la base de datos
const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DB_CNN);
		console.log('DB online')
	} catch (error) {
		console.log(error);
		throw new Error('Error a la hora de iniciar la DB');
	}
}

// Exportar la funcion de conexion
module.exports = {
	dbConnection
};