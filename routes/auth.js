/**
 * Ruta: /api/login
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
	'/',
	[
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password es obligatorio').not().isEmpty(),
		validarCampos // middleware personalizado para validar los campos
	],
	login
);

router.post(
	'/google',
	[
		check('token', 'El token de google es obligatorio').not().isEmpty(),
		validarCampos // middleware personalizado para validar los campos
	],
	googleSignIn
);

router.get(
	'/renew',
	[
		validarJWT
	],
	renewToken
);

module.exports = router;