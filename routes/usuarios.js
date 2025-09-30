/**
 * Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos'); 
const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuario } = require('../controllers/usuarios'); // importar el controlador
const { validarJWT, validarAdminRole, validarAdminRole_O_MismoUsuario } = require('../middlewares/validar-jwt'); 

const router = Router();

router.get('/', validarJWT, getUsuarios); // cuando se haga la peticion get a la ruta /api/usuarios se ejecuta el controlador getUsuarios

router.post(
	'/',
	// middlewares (sirven para validar cosas antes de ejecutar el controlador)
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		validarCampos // middleware personalizado para validar los campos
	],
	crearUsuarios
);

router.put(
	'/:id',
	[
		validarJWT,
		validarAdminRole_O_MismoUsuario,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('role', 'El role es obligatorio').not().isEmpty(),
		validarCampos
	],
	actualizarUsuarios
);

router.delete('/:id', [validarJWT, validarAdminRole], borrarUsuario);

module.exports = router;