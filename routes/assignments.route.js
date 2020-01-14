const express = require('express')
const firestore = require('firebase').firestore
let router = express.Router()
const usermiddleware =  require('../middleware/jwt')
router.post('/assignment', usermiddleware, (req, res) =>{
    firestore().collection('assignments').add(req.body).then(data =>{
        res.send({
            status: 200,
            msg: 'Successfully Created',
            id: data.id
        })
    }).then(notification =>{
        firestore().collection('users').get().then(user =>{
            user.forEach(snapshot =>{
                let notifications =[]
                let msg={
                    title: `${req.body.courseCode} was added to ${req.body.content}`,
                    route: `Assignments`,
                    createdAt: new Date().toString()
                }
                let prevNotifications = snapshot.data().notifications
                notifications = [...prevNotifications, msg]
                snapshot.ref.update({
                    notifications
                })
            })
        })
    }).catch(error => {
        res.json({
            status: 400,
            msg:'An error occured on the server'
        })
    })
})

router.get('/assignments', (req, res) =>{
    firestore().collection('assignments').get().then(data =>{
        let assignments=[]
        data.forEach(homework =>{
            assignments = [...assignments, homework.data()]
        })
        console.log(assignments)
        res.json({
            status: 200,
            data: assignments
        })
    }).catch(error => {
        res.json({
            status: 400,
            msg:'An error occured on the server'
        })
    })
})
module.exports = router