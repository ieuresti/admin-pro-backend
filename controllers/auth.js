const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify')

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

const googleSignIn = async (request, response) => {

	try {
		const { email, name, picture } = await googleVerify(request.body.token);

		const usuarioDB = await Usuario.findOne({ email });
		let usuario;

		if (!usuarioDB) {
			usuario = new Usuario({
				nombre: name,
				email,
				password: '@@@',
				img: picture,
				google: true
			});
		} else {
			usuario = usuarioDB;
			usuario.google = true;
		}

		await usuario.save();

		// generar JWT
		const token = await generarJWT(usuario.id);

		response.json({
			ok: true,
			email, name, picture,
			token
		});
	} catch (error) {
		console.log(error);
		response.status(400).json({
			ok: false,
			msg: 'Token de google no es correcto'
		});
	}
};

const renewToken = async (request, response) => {

	const uid = request.uid;

	// generar JWT
	const token = await generarJWT(uid);

	// obtener usuario por uid
	const usuarioDB = await Usuario.findById(uid);

	response.json({
		ok: true,
		token,
		usuario: usuarioDB
	});
};

module.exports = { login, googleSignIn, renewToken };