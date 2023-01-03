const express =  require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('portals/Index');
})
router.get('/login', (req, res) =>{
    res.render('portals/Login');
})
router.get('/panel', (req, res) =>{
    res.render('portals/Panel');
})


module.exports = router;