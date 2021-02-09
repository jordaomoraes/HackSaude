const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },

    epaciente: {
        type: Number,
         default: 0
    },
    emedico: {
        type: Number,
        default: 0
    },
    


});
//criando efetivamente, e passando o nome categorias
mongoose.model("usuarios", Usuario);
