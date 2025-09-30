const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (request, response, next) => {

	// leer el token
	const token = request.header('x-token');

	if (!token) {
		return response.status(401).json({
			ok: false,
			msg: 'No hay token en la petición'
		});
	}

	// verificar el JWT
	try {

		const { uid } = jwt.verify(token, process.env.JWT_SECRET);
		// establecer info en la request
		request.uid = uid;
		next();

	} catch (error) {
		console.log(error);
		return response.status(401).json({
			ok: false,
			msg: 'Token no válido'
		});
	}
};

const validarAdminRole = async (request, response, next) => {
	// en este punto se puede obtener el uid de la request porque en validarJWT se establece y este middleware se usará despues de ese
	const uid = request.uid;
	try {
		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return response.status(404).json({
				ok: false,
				msg: 'Usuario no existe'
			});
		}

		if (usuarioDB.role !== 'ADMIN_ROLE') {
			return response.status(403).json({
				ok: false,
				msg: 'No tiene privilegios para hacer eso'
			});
		}

		next();

	} catch (error) {
		console.log(error);
		return response.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		});
	}
}

const validarAdminRole_O_MismoUsuario = async (request, response, next) => {

	const uid = request.uid;
	const id = request.params.id;

	try {
		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return response.status(404).json({
				ok: false,
				msg: 'Usuario no existe'
			});
		}

		if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
			next();
		} else {
			return response.status(403).json({
				ok: false,
				msg: 'No tiene privilegios para hacer eso'
			});
		}

	} catch (error) {
		console.log(error);
		return response.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		});
	}
}

module.exports = { validarJWT, validarAdminRole, validarAdminRole_O_MismoUsuario };