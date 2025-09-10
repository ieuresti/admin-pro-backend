/**
 * Ruta: /api/hospitales
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');

const router = Router();

router.get('/', getHospitales);

router.post(
	'/',
	// middlewares (sirven para validar cosas antes de ejecutar el controlador)
	[
		validarJWT,
		check('nombre', 'El nombre del hospital es requerido').not().isEmpty(),
		validarCampos
	],
	crearHospital
);

router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre del hospital es requerido').not().isEmpty(),
		validarCampos
	],
	actualizarHospital
);

router.delete('/:id', validarJWT, borrarHospital);

module.exports = router;