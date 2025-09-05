const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medicos');

const searchGlobal = async (request, response) => {

	const elementoBusqueda = request.params.busqueda;
	// crear una expresion regular, El modificador 'i' hace que la búsqueda no distinga entre mayúsculas y minúsculas
	const regex = new RegExp(elementoBusqueda, 'i');
	// ejecuta varias promesas (operaciones asíncronas) al mismo tiempo y espera a que todas terminen
	const [usuarios, hospitales, medicos] = await Promise.all([
		Usuario.find({ nombre: regex }),
		Hospital.find({ nombre: regex }),
		Medico.find({ nombre: regex })
	]);

	response.json({
		ok: true,
		usuarios,
		hospitales,
		medicos
	});
};

const getDocumentosColeccion = async (request, response) => {

	const tabla = request.params.tabla;
	const busqueda = request.params.busqueda;
	// crear una expresion regular, El modificador 'i' hace que la búsqueda no distinga entre mayúsculas y minúsculas
	const regex = new RegExp(busqueda, 'i');

	let data = [];

	switch (tabla) {
		case 'usuarios':
			data = await Usuario.find({ nombre: regex });
			break;
		case 'hospitales':
			data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
			break;
		case 'medicos':
			data = await Medico.find({ nombre: regex }).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
			break;

		default:
			return response.status(400).json({
				ok: false,
				msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
			});
	}

	response.json({
		ok: true,
		resultados: data
	});
};

module.exports = { searchGlobal, getDocumentosColeccion };