const jwt = require('jsonwebtoken');

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

module.exports = { validarJWT };