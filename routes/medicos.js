/**
 * Ruta: /api/medicos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get('/', getMedicos);

router.post(
	'/',
	// middlewares (sirven para validar cosas antes de ejecutar el controlador)
	[
		validarJWT,
		check('nombre', 'El nombre del medico es obligatorio').not().isEmpty(),
		check('hospital', 'El hospital id debe ser válido').isMongoId(),
		validarCampos
	],
	crearMedico
);

router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre del medico es obligatorio').not().isEmpty(),
		check('hospital', 'El hospital id debe ser válido').isMongoId(),
		validarCampos
	],
	actualizarMedico
);

router.delete('/:id', validarJWT, borrarMedico);

module.exports = router;