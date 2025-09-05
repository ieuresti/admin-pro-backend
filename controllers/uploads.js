const { v4: uuidv4 } = require('uuid');
const path = require('path'); // sirve para poder construir un path completo
const fs = require('fs'); // paquete de node file system (leer carpetas y archivos)
const { actualizarImagen } = require('../helpers/actualizar-img');

const fileUpload = async (request, response) => {

    const tipo = request.params.tipo;
    const id = request.params.id;

    const tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (!tiposValidos.includes(tipo)) {
        return response.status(400).json({
            ok: false,
            msg: 'El tipo no es un usuario, hospital o medico'
        });
    }

    // validar que exista un archivo
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    // procesar la img
    const file = request.files.imagen
    const nombreCortado = file.name.split('.'); // toma el nombre del archivo (por ejemplo, "foto.perfil.jpg") y lo divide en partes usando el punto como separador. El resultado es un arreglo con cada parte del nombre
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // obtiene la última parte del arreglo, que corresponde a la extensión del archivo (por ejemplo, "jpg")

    // validar extension
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValida.includes(extensionArchivo)) {
        return response.status(400).json({
            ok: false,
            msg: 'No es una extension de archivo permitida'
        });
    }

    // generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // path para guardar la img
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover la img
    file.mv(path, (err) => {
        if (err)
            return response.status(500).json({
                ok: false,
                msg: 'Error al mover la img'
            });
    });

    // actualizar la base de datos
    actualizarImagen(tipo, id, nombreArchivo);

    response.json({
        ok: true,
        msg: 'Archivo subido!',
        nombreArchivo
    });
};

const retornaImagen = (request, response) => {

    const tipo = request.params.tipo;
    const foto = request.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // validar img existe, mostrar una default en caso de que no
    if (fs.existsSync(pathImg)) {
        response.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        response.sendFile(pathImg);
    }

}

module.exports = { fileUpload, retornaImagen };