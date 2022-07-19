const router = require('express').Router()
const User = require('../../models/user')
const passport = require('passport')

// get login page 
router.get('/login', (req, res) => {
  res.render('login')
})

// post login information to login personal todo list page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// get register page
router.get('/register', (req, res) => {
  res.render('register')
})

// post register information to register an account
router.post('/register', async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    // check if the email already exists
    const userData = await User.exists({ email })
    if (userData) {
      const errMsg = 'User already exists'
      return res.render('register', {name, email, password, errMsg})
    }
    // else store the user register information
    await User.create({ name, email, password })
    res.redirect('/')
  } catch(e) {
    console.log(e)
    next(e)
  }
})

module.exports = router