const { validationResult } = require('express-validator');

const validarCampos = (request, response, next) => {

	// va a guardar los errores de las validaciones hechas en las rutas
	const errores = validationResult(request);

	if (!errores.isEmpty()) {
		return response.status(400).json({
			ok: false,
			errors: errores.mapped()
		});
	}

	next(); // si todo esta bien, se llama a next para que continue con el siguiente middleware o controlador
};

module.exports = { validarCampos };