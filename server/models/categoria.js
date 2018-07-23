const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    categoria: {
        type: String,
        required: [true, 'El nombre de la categoria es necesario'],
        unique: true
    },
    usuarioCreador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


categoriaSchema.plugin(uniqueValidator, { message: 'La {PATH} ya existe' });

module.exports = mongoose.model('Categoria', categoriaSchema);