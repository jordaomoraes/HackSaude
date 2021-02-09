const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');


const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/',   (req,res) => {
      res.render('usuarios/painelusuario');
})

router.get('/registro',   (req,res) => {
    //view registo
    res.render('usuarios/registro');
})
router.post('/registro', (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome Inválido!' })
    }

    if (req.body.nome.length < 4) {
        erros.push({ texto: 'Nome muito curto!' });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'E-mail Inválido!' })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'Senha Inválida!' })
    }
    if (req.body.senha.length < 4) {
        erros.push({ texto: 'Senha muito curta!' });
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: 'Senhas são diferentes!' })
    }
    if (erros.length > 0) {
        res.render('usuarios/registro', { erros: erros });
    } else {

        Usuario.findOne({ email: req.body.email }).then((usuarioEmail) => {
            if (usuarioEmail)
            {
                req.flash('error_msg', 'E-mail já existe no sistema');
                res.redirect('/usuarios/registro');
            }
            else {
                Usuario.findOne({ cpf: req.body.cpf }).then((usuarioCpf) => {
                    if (usuarioCpf)
                    {
                        req.flash('error_msg', 'Cpf já existe no sistema');
                        res.redirect('/usuarios/registro');
                    }
                    else {
                        if(req.body.radio_tipo == "opc_paciente"){
                           // console.log("Entrou paciente")
                        const novoUsuario = new Usuario({
                            nome: req.body.nome,
                            email: req.body.email,
                            cpf: req.body.cpf,
                            senha: req.body.senha,
                            epaciente:1
                        })
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash('error_msg', 'Houve um erro durante o salvamento do paciente');
                                    res.redirect('/');
                                }
                                novoUsuario.senha = hash;
                                novoUsuario.save().then(() => {
                                    req.flash('success_msg', 'paciente cadastrado com sucesso');
                                    res.redirect('/');
                                }).catch((err) => {
                                    req.flash('error_msg', 'Houve um erro ao cadastrar o paciente no banco de dados', + err);
                                    res.redirect('/usuarios/registro');
                                })
                            })
                        })}else{
                           // console.log("Entrou Medico")
                            const novoUsuario = new Usuario({
                                nome: req.body.nome,
                                email: req.body.email,
                                cpf: req.body.cpf,
                                senha: req.body.senha,
                                emedico:"1"
                            })

                            bcrypt.genSalt(10, (erro, salt) => {
                                bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                    if (erro) {
                                        req.flash('error_msg', 'Houve um erro durante o salvamento do Médico');
                                        res.redirect('/');
                                    }
                                    novoUsuario.senha = hash;
                                    novoUsuario.save().then(() => {
                                        console.log(novoUsuario)
                                        req.flash('success_msg', 'Médico cadastrado com sucesso');
                                        res.redirect('/');e
                                    }).catch((err) => {
                                        req.flash('error_msg', 'Houve um erro ao cadastrar o Médico no banco de dados', + err);
                                        res.redirect('/usuarios/registro');
                                    })
                                })
                            })
                        }
                    }
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/');
        })
    }
})

router.get('/login', (req,res)=>{
    res.render('usuarios/login');
})

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})
router.get("/logout",(req,res)=>{

    req.logout()
    res.redirect("/")
})

module.exports= router

