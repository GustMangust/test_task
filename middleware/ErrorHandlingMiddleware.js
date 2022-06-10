const ServerError = require('../errors/ServerError')

module.exports = function(err,req,res,next){
    if(err instanceof ServerError){
        return res.status(err.status).json({message: err.message})
    }
    
    return res.status(500).json({message:"Непредвиденная ошибка!"})
}