const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const bcryptjs = require('bcryptjs');
const jwt = require('../helpers/jwt');

const getMedicos = async (request, response) => {
	const medicos = await Medico.find()
		.populate('usuario', 'nombre img')
		.populate('hospital', 'nombre img');

	response.json({
		ok: true,
		medicos
	});
};

const getMedicoById = async (request, response) => {

	const medicoId = request.params.id;

	try {
		const medicoDB = await Medico.findById(medicoId)
			.populate('usuario', 'nombre img')
			.populate('hospital', 'nombre img');

		if (!medicoDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un medico por ese id'
			});
		}

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
}

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

	const medicoId = request.params.id;
	const userId = request.uid;
	const hospitalId = request.body.hospital;

	try {
		const medicoDB = await Medico.findById(medicoId);

		if (!medicoDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un medico por ese id'
			});
		}

		const hospitalDB = await Hospital.findById(hospitalId);

		if (!hospitalDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un hospital por ese id'
			});
		}

		const cambiosMedico = {
			...request.body,
			usuario: userId,
			hospital: hospitalId
		};

		// findByAndUpdate recibe 3 parametros: el id del registro a actualizar, un objeto con los campos a actualizar y un objeto con opciones (new:true para que retorne el registro actualizado)
		const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, { new: true });

		response.json({
			ok: true,
			medico: medicoActualizado
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

const borrarMedico = async (request, response) => {

	medicoId = request.params.id;

	try {
		const medicoDB = await Medico.findById(medicoId);

		if (!medicoDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un medico por ese id'
			});
		}

		// busca el medico por id y lo elimina
		await Medico.findByIdAndDelete(medicoId);

		response.json({
			ok: true,
			msg: 'Medico eliminado'

		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
}

module.exports = { getMedicos, getMedicoById, crearMedico, actualizarMedico, borrarMedico };