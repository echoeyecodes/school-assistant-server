const express = require('express')
const path = require('path')
const multer = require('multer')
const firestore = require('firebase').firestore
const cloudinaryConfig = require('../config/cloudinary-config')
let storage = multer.memoryStorage()
const DataUri = require('datauri')
const dUri = new DataUri()
let upload = multer({storage})
const cloudinary = require('cloudinary').v2
let router = express.Router()

cloudinary.config(cloudinaryConfig);


  router.post('/upload', upload.single('image'), (req, res) =>{
    const {uid, folderName} = req.body
    const uri = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)
    cloudinary.uploader.upload(uri.content, (err, result) =>{
        if(err){
          console.log(err)
          return
        }
        firestore().collection('media').doc(folderName).set({id: 1})
        firestore().collection('media').doc(folderName).collection('uploads').add({
            url: result.url,
            uid: uid,
            filename: `photo${uid}`,
            folder: folderName
        }).then(data =>{
            res.json({
                uid,
                id: data.id,
                url: result.url
            })
        })
      })
})

router.get('/media/:folder/:id', (req, res) =>{
    console.log(req.params.id)
    firestore().collection('media').doc(req.params.folder).collection('uploads').doc(req.params.id).get().then(data =>{
        res.json({
            id: data.id,
            data: data.data()
        })
    })
})

router.get('/folders', (req, res) =>{
    firestore().collection('media').get().then(data =>{
        let folders=[]
        data.forEach(item =>{
            folders = [...folders, item.id]
        })
        res.json({
            data: folders
        })
    })
})

router.get('/folder/:name', (req, res) =>{
    firestore().collection('media').doc(req.params.name).collection('uploads').get().then(data =>{
        let images = []
        data.forEach(snapshot =>{
            images = [...images, {
                id: snapshot.id,
                data: snapshot.data()
            }]
        })
        res.json({
            data: images
        })
    })
})
module.exports = router