const jwt = require('jsonwebtoken')
const secretKey = require('../config/jwt-secret-key')
module.exports= function(req, res, next){
    const token = req.header('Authorization')
    console.log(token)
    if(token){
        const id = jwt.verify(token, secretKey)
        res.userId = id
        next()
    }
}