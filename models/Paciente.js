const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Paciente = new Schema({

    medico:{
        type: Schema.Types.ObjectId,
        ref:"usuarios", required:true},

    nome:{
        type:String,
    },
    idade:{
        type:String,
    },
    obs:{
        type:String,
    },


});


mongoose.model("pacientes", Paciente);

