const express = require('express')
const bodyparser = require('body-parser')
let app = express()
const config = require('./config/firebase-config')
const http = require('http').createServer(app)
const firebase = require('firebase')
firebase.initializeApp(config)
const mediaRoute = require('./routes/media.route')

let router = express.Router()
app.use(bodyparser.json())

const PORT = process.env.PORT || 3000

app.use((req, res, next) =>{
    console.log(new Date().toString())
    next()
})

router.get('/', (req, res) =>{
    res.send('Hello world')
})

app.use(mediaRoute)

http.listen(3000, () => console.log(`Server started at port ${PORT}`))