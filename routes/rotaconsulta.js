
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");

require("../models/Paciente");
require("../models/Consulta");
const { eCadastrado } = require("../helpers/eCadastrado");
const Paciente = mongoose.model("pacientes");
const Usuario = mongoose.model("usuarios");
const Consulta = mongoose.model("consultas");

router.get("/", eCadastrado, (req, res) => {
    if (req.user) {
        Consulta.find({paciente: req.user.id, })
        .populate("medico")
            .then((consultas) => {
                res.render("cadastros/consultas", { consultas: consultas });
            })
            .catch((erro) => {
                req.flash("error_msg", "Erro ao listar as Consultas! " + erro);
                res.redirect("/");
            });
    } else {
        res.render("cadastros/consultas");
    }
});

router.get("/add", eCadastrado, (req, res) => {

    if (req.user) {
        Usuario.find({emedico: 1,})
            .sort({ nome: "desc" })
            .then((medicos) => {
                res.render("cadastros/addconsulta", { medicos: medicos });
            })
            .catch((erro) => {
                req.flash("error_msg", "Erro ao listar os Médicos! " + erro);
                res.redirect("/");
            });
    } else {
        res.render("cadastros/consultas");
    }
});
router.get("/addtratamento/:id", eCadastrado, (req, res) => {
    if (req.user) {
        Consulta.findOne({paciente:req.params.id,}).populate("medicos")
                .then((pac) => {
                res.render("cadastros/addtratamento", { pac: pac });
            })
            .catch((erro) => {
                req.flash("error_msg", "Erro ao listar o Paciente! " + erro);
                res.redirect("/");
            });
    } else {
        res.render("cadastros/consultas");
    }

});


router.post("/edit", eCadastrado, (req, res) => {

    Consulta.findOne({_id: req.body.id}).then((consulta)=>{
        consulta.nome_paciente= req.body.nome_paciente,
        consulta.sintomas= req.body.sintomas,
        consulta.data_orientacao= req.body.data_orientacao,
        consulta.orientacao= req.body.orientacao,
        consulta.medicacao= req.body.medicacao,
        consulta.realizada = "Sim",

    consulta.save().then(()=>{
        req.flash('success_msg', 'Orientação Inserida com Sucesso!');
        res.redirect('/pacientes/consultas');
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao inserir Orientação!');
        res.redirect('/');
    })
    }).catch((err)=>{
    req.flash('error_msg', 'Erro ao inserir Orientação!');
    res.redirect('/');
    });

});

router.post("/novo", eCadastrado, (req, res) => {

    const novaConsulta = {
        paciente: req.user._id,
        nome_paciente: req.user.nome,
        medico: req.body.medico,
        data: moment(req.body.data),
        sintomas: req.body.sintomas,
    };

    new Consulta(novaConsulta).save().then((novaConsulta) => {
        req.flash("success_msg", "Consulta cadastrada com sucesso!");
        res.redirect("/consultas");
    });
});

module.exports = router;
