const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const firestore = require('firebase').firestore
let storage = multer.memoryStorage()
const path = require('path')
const secretKey = require('../config/jwt-secret-key')
const DataUri = require('datauri')
const dUri = new DataUri()
let upload = multer({storage})
const cloudinary = require('cloudinary').v2
let router = express.Router()

router.post('/create', upload.single('image'), (req, res) =>{
    const {email, password, name, department, level} = req.body
    const uri = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)
    cloudinary.uploader.upload(uri.content, async (err, result) =>{
        if(err){
            console.log(err)
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        firestore().collection('users').add({
            email,
            password: hashedPassword,
            name,
            department,
            level,
            imageUrl: result.url,
            isAdmin: false,
            notifications: []
        }).then(data =>{
            const token = jwt.sign(data.id, secretKey);
            data.get().then(user =>{
                res.json({
                    status: 200,
                    token,
                    id: user.id,
                    data: user.data()
                })
            })
        }).catch(error =>{
            res.json({
                status: 400,
                msg: "Couldn't create account"
            })
        })
    })
})

router.get('/login/:user/:password', (req, res) =>{
    const email = req.params.user
    const password = req.params.password
    console.log(email)

    firestore().collection('users').get().then(async data =>{
        let users = []
        data.forEach(snapshot =>{
            users = [...users, {
                id: snapshot.id,
                data: snapshot.data()
            }]
        })
        const valid = users.find(item => item.data.email === email)
        if(valid){
            const validPassword = await bcrypt.compare(password, valid.data.password)
            if(validPassword){
                const token = jwt.sign(valid.id, secretKey)
                firestore().collection('users').doc(valid.id).get().then(user =>{
                    res.json({
                        status: 200,
                        token,
                        id: user.id,
                        data: user.data()
                    })
                })
            }else{
                res.json({
                    status: 400,
                    msg: 'Invalid Password'
                })
            }
        }else{
            res.json({
                status: 401,
                msg:'Invalid username/password'
            })
        }
    })
})
module.exports=router