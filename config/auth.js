const localStrategy = require('passport-local').Strategy
const mongoose =require('mongoose')
const bcrypt = require('bcryptjs')


    require('../models/Usuario')
    const Usuario = mongoose.model('usuarios')


    module.exports = (passport) => {
        passport.use(new localStrategy({usernameField: 'cpf', passwordField: 'senha'}, (cpf, senha, done) => {

            Usuario.findOne({cpf: cpf}).then((usuario) =>{
                if(!usuario)
                {
                    return done(null, false, {message: 'Esta conta não existe!'});
                }

                bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                    if(batem)
                    {
                        return done(null, usuario)
                    }else{
                        return done(null, false, {message: 'Senha incorreta'})
                    }
                })
            })

        }))

        passport.serializeUser((usuario, done) => {
            done(null, usuario.id)
        })

        passport.deserializeUser((id, done) => {
            Usuario.findById(id, (err, usuario) => {
                done(err, usuario)
            })
        })


    }


