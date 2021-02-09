const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Consulta = new Schema({
    medico:{
        type: Schema.Types.ObjectId,
        ref:"usuarios", required:true},
    paciente:{
        type: Schema.Types.ObjectId,
        ref:"pacientes", required:true},
    data: {
        type: Date,
    },
    data_orientacao: {
        type: Date,
    },
    nome_paciente: {
        type: String,
    },
    sintomas: {
        type: String,
    },
    orientacao: {
        type: String,
    },
    medicacao: {
        type: String,
    },
    realizada: {
        type: String,
        default: "Não"
    },

});

mongoose.model("consultas", Consulta);
