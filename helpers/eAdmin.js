module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated()&& req.user.eadmin == 1){
            return next();
        }
        req.flash("error_msg", "vc deve ser Admin para entrar aqui")
        res.redirect("/")
    }
}