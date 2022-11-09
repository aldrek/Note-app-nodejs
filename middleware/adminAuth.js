module.exports = (req , res , next) =>{

    const user = req.user;
    if(user.isAdmin !== true){
        res.json({
            status : "false" ,
            message : "You are not allowed to this"
        })
    }else{
        next()
    }
 
}