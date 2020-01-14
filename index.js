const express = require('express')
const bodyparser = require('body-parser')
let app = express()
const config = require('./config/firebase-config')
const http = require('http').createServer(app)
const firebase = require('firebase')
firebase.initializeApp(config)
const mediaRoute = require('./routes/media.route')
const courseRoute = require('./routes/courses.route')
const assignmentRoute = require('./routes/assignments.route')
const userRoute = require('./routes/user.route')

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

app.use(userRoute)
app.use(mediaRoute)
app.use(courseRoute)
app.use(assignmentRoute)
http.listen(3000, () => console.log(`Server started at port ${PORT}`))