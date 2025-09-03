const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('../helpers/jwt');

const getUsuarios = async (request, response) => {
	// obtener todos los usuarios de la base de datos
	// las {} para especificar un filtro (aqui no hay filtro) y el segundo parametro para especificar que campos quiero traer
	const usuarios = await Usuario.find({}, 'nombre email role google');

	response.json({
		ok: true,
		usuarios,
		uid: request.uid
	});
};

const crearUsuarios = async (request, response) => {
	// obtener los datos del body de la peticion
	const { email, password } = request.body;

	try {
		// findOne sirve para buscar un solo registro en la base de datos
		const existeEmail = await Usuario.findOne({ email });
		if (existeEmail) {
			return response.status(400).json({
				ok: false,
				msg: 'El correo ya esta registrado'
			});
		}

		// crear una instancia del objeto/modelo Usuario
		const usuario = new Usuario(request.body);

		// encriptar la contraseña
		// un salt es un # aleatorio que se usa para hacer mas segura la encriptacion
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		// generar JWT
		const token = await jwt.generarJWT(usuario.id);

		// guardar el usuario en la base de datos
		await usuario.save();

		response.json({
			ok: true,
			usuario,
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

const actualizarUsuarios = async (request, response) => {
	try {
		const uid = request.params.id;

		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un usuario por ese id'
			});
		}

		const { password, google, ...campos } = request.body;

		const existeEmail = await Usuario.findOne({ email: request.body.email });

		if (usuarioDB.email === request.body.email) {
			delete campos.email // si son iguales no esta actualizando el email, ergo se puede extraer
		} else if (existeEmail) {
			// si son diferentes mostrar error
			return response.json({
				ok: false,
				msg: 'Ya existe un usuario con ese email'
			});
		}

		// findByAndUpdate recibe 3 parametros: el id del registro a actualizar, un objeto con los campos a actualizar y un objeto con opciones (new:true para que retorne el registro actualizado)
		const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

		response.json({
			ok: true,
			usuario: usuarioActualizado
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
};

const borrarUsuario = async (request, response) => {

	try {
		const uid = request.params.id;

		const usuarioDB = await Usuario.findById(uid);

		// validar si existe antes de eliminar usuario por ese id
		if (!usuarioDB) {
			return response.status(404).json({
				ok: false,
				msg: 'No existe un usuario por ese id'
			});
		}

		// busca el usuario por id y lo elimina
		await Usuario.findByIdAndDelete( uid );

		response.json({
			ok: true,
			msg: 'Usuario eliminado'
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			ok: false,
			msg: 'Error inesperado... revisar logs'
		});
	}
}

module.exports = { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuario };