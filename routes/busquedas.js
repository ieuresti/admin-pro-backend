/**
 * Ruta: /api/todo/
 */
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { searchGlobal, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();

router.get(
    '/:busqueda',
    [
        validarJWT
    ],
    searchGlobal
);

router.get('/coleccion/:tabla/:busqueda', [validarJWT], getDocumentosColeccion);

module.exports = router;