const express =  require('express');
const router = express.Router();
const {rooms} = require('../utils/users')

router.get('/', (req, res) =>{
    res.render('portals/Index');
})
router.get('/login', (req, res) =>{
    res.render('portals/Login');
})

router.post('/chatIndex', (req, res) =>{
    const username = req.body.username
    console.log(username)
    res.redirect(`/chatIndex:${username}`);
})

router.get('/chatIndex:userRoom', (req,res) =>{
    res.render('portals/IndexChat')
})

module.exports = router;