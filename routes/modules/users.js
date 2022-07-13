const router = require('express').Router()

// get login page 
router.get('/login', (req, res) => {
  res.render('login')
})

// post login information to login personal todo list page
router.post('/login', (req, res) => {

})

// get register page
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router