
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");

require("../models/Paciente");
require("../models/Consulta");
const { eCadastrado } = require("../helpers/eCadastrado");
const Paciente = mongoose.model("pacientes");
const Consulta = mongoose.model("consultas");


router.get("/", eCadastrado, (req, res) => {
    if (req.user) {
        Paciente.find({
            medico: req.user.id,
        })
            .sort({ nome: "desc" })
            .then((pacientes) => {
                res.render("cadastros/paciente", { pacientes: pacientes });
            })
            .catch((erro) => {
                req.flash("error_msg", "Erro ao listar os Pacientes! " + erro);
                res.redirect("/");
            });
    } else {
        res.render("cadastros/paciente");
    }
});

router.get("/add", eCadastrado, (req, res) => {
    res.render("cadastros/addpaciente");
});

router.get("/consultas", eCadastrado, (req, res) => {

    if (req.user) {
        Consulta.find({medico: req.user.id, })
        .populate("pacientes")
            .then((consultas) => {
                res.render("cadastros/consultasmedico", { consultas: consultas });
            })
            .catch((erro) => {
                req.flash("error_msg", "Erro ao listar as Consultas! " + erro);
                res.redirect("/");
            });
    } else {
        res.render("cadastros/consultasmedico");
    }


});

router.post("/novo", eCadastrado, (req, res) => {

    const novoPaciente = {
        medico: req.user.id,
        nome: req.body.nome,
        idade: req.body.idade,
        obs: req.body.obs,

    };

    new Paciente(novoPaciente).save().then((novoPaciente) => {
        req.flash("success_msg", "Paciente cadastrado com sucesso!");
        res.redirect("/pacientes");
    });
});

module.exports = router;
