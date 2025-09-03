const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async (request, response) => {

	const { email, password } = request.body;

	try {
		// verificar email
		const usuarioDB = await Usuario.findOne({ email });
		if (!usuarioDB) {
			return response.status(404).json({
				ok: false,
				msg: 'El email no encontrado'
			});
		}

		// verificar contraseña
		const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
		if (!validPassword) {
			return response.status(400).json({
				ok: false,
				msg: 'Contraseña no válida'
			});
		}

		// generar JWT
		const token = await generarJWT(usuarioDB.id);

		response.json({
			ok: true,
			token
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

module.exports = { login };