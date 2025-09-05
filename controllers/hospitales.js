const Hospital = require('../models/hospital');
const bcryptjs = require('bcryptjs');
const jwt = require('../helpers/jwt');

const getHospitales = async (request, response) => {
	// el populate se utiliza para reemplazar una referencia (ObjectId) en un documento por el documento completo al que hace referencia
	// esto busca hospitales y, en vez de mostrar solo el id del usuario, incluye los campos nombre e img del usuario relacionado
	const hospitales = await Hospital.find().populate('usuario', 'nombre img');

	response.json({
		ok: true,
		hospitales
	});
};

const crearHospital = async (request, response) => {

	const uid = request.uid;
	// desectructurar todos los campos que vienen en el body
	const hospital = new Hospital({
		usuario: uid,
		...request.body
	});

	try {
		// guardar en la base de datos
		const hospitalDB = await hospital.save();

		response.json({
			ok: true,
			hospital: hospitalDB
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

const actualizarHospital = async (request, response) => {
	response.json({
		ok: true,
		msg: 'actualizar hosp'
	});
};

const borrarHospital = async (request, response) => {
	response.json({
		ok: true,
		msg: 'borrar hosp'
	});
}

module.exports = { getHospitales, crearHospital, actualizarHospital, borrarHospital };