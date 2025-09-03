const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
	nombre: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	img: {
		type: String
	},
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE'
	},
	google: {
		type: Boolean,
		default: false
	}
});

// sirve para modificar la respuesta que se envia al cliente
usuarioSchema.method('toJSON', function() {
	// desestructurar el objeto this (que es el usuario) para eliminar __v, password y renombrar _id a uid
	const { __v, _id, password, ...object } = this.toObject();
	object.uid = _id;
	return object;
});

module.exports = model('Usuario', usuarioSchema);