const { Schema, model } = require('mongoose');

const medicoSchema = Schema({
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
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
		required: true
    }
}, { collection: 'medicos' });

// sirve para modificar la respuesta que se envia al cliente
medicoSchema.method('toJSON', function() {
	const { __v, ...object } = this.toObject();
	return object;
});

module.exports = model('Medico', medicoSchema);