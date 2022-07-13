const router = require('express').Router()

// get login page 
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router