module.exports = {
    eCadastrado: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Você precisa realizar Login para ter acesso a esta parte do site")
        res.redirect("/")
    }
}