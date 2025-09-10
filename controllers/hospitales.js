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

	const id = request.params.id;
	const uid = request.uid; // uid del usuario

	try {
		const hospitalDB = await Hospital.findById(id);

		if (!hospitalDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un hospital por ese id'
			});
		}

		const cambiosHospital = {
			...request.body,
			usuario: uid
		};

		// findByAndUpdate recibe 3 parametros: el id del registro a actualizar, un objeto con los campos a actualizar y un objeto con opciones (new:true para que retorne el registro actualizado)
		const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

		response.json({
			ok: true,
			hospital: hospitalActualizado
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

const borrarHospital = async (request, response) => {

	const id = request.params.id;

	try {
		const hospitalDB = await Hospital.findById(id);

		// validar si existe antes de eliminar hospital por ese id
		if (!hospitalDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un hospital por ese id'
			});
		}

		// busca el hospital por id y lo elimina
		await Hospital.findByIdAndDelete(id);

		response.json({
			ok: true,
			msg: 'Hospital eliminado'
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
}

module.exports = { getHospitales, crearHospital, actualizarHospital, borrarHospital };