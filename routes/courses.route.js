const express = require('express')
const firestore = require('firebase').firestore
let router = express.Router()
const usermiddleware =  require('../middleware/jwt')
router.post('/courses', usermiddleware, (req, res) =>{
        firestore().collection('classes').add(req.body).then(data =>{
            res.json({
                status: 2,
                id: data.id
            })
    }).then(data =>{
        firestore().collection('users').get().then(user =>{
            user.forEach(snapshot =>{
                let notifications =[]
                let msg={
                    title: `${req.body.courseTitle} was added to ${req.body.dayOfTheWeek}`,
                    route: `Classes`,
                    index: req.body.dayOfTheWeek,
                    createdAt: new Date().toString()
                }
                let prevNotifications = snapshot.data().notifications
                notifications = [...prevNotifications, msg]
                snapshot.ref.update({
                    notifications
                })
            })
        })
    })
})

router.get('/courses', (req, res) =>{
    firestore().collection('classes').get().then(data =>{
        let courses =[]
        data.forEach(course =>{
            courses = [...courses, course.data()]
        })
        res.json({
            status: 200,
            data: courses
        })
        console.log(courses)
    })
})

module.exports=router