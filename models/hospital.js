const { Schema, model } = require('mongoose');

const hospitalSchema = Schema({
	nombre: {
		type: String,
		required: true
	},
	img: {
		type: String
	},
    usuario: {
        type: Schema.Types.ObjectId, // indica a Mongoose que va a haber una relacion de este esquema con la sig referencia
        ref: 'Usuario',
		required: true
    }
}, { collection: 'hospitales' });

// sirve para modificar la respuesta que se envia al cliente
hospitalSchema.method('toJSON', function() {
	const { __v, ...object } = this.toObject();
	return object;
});

module.exports = model('Hospital', hospitalSchema);