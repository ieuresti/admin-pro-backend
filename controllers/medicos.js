const Medico = require('../models/medicos');
const bcryptjs = require('bcryptjs');
const jwt = require('../helpers/jwt');

const getMedicos = async (request, response) => {
	const medicos = await Medico.find()
		.populate('usuario', 'nombre email')
		.populate('hospital', 'nombre');

	response.json({
		ok: true,
		medicos
	});
};

const crearMedico = async (request, response) => {

	const uid = request.uid;
	const medico = new Medico({
		usuario: uid,
		...request.body
	});

	try {
		// guardar en la base de datos
		const medicoDB = await medico.save();

		response.json({
			ok: true,
			medico: medicoDB
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

const actualizarMedico = async (request, response) => {
	response.json({
		ok: true,
		msg: 'actualizar medico'
	});
};

const borrarMedico = async (request, response) => {
	response.json({
		ok: true,
		msg: 'borrar medico'
	});
}

module.exports = { getMedicos, crearMedico, actualizarMedico, borrarMedico };