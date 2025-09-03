const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = {
			uid
		};

		// crea el jwt (payload, secret id, duracion)
		jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '8h'
		}, (error, token) => {
			if (error) {
				console.log(error);
				reject('No se pudo generar el JWT');
			} else {
				resolve(token);
			}
		});
	});
};

module.exports = {generarJWT};