const router = require('express').Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'The password confirmation does not match' })
  }
  if (errors.length) {
    return res.render('register', {errors, name, email, password})
  }
  try {
    // check if the email already exists
    const userData = await User.exists({ email })
    if (userData) {
      errors.push({ message: 'User already exists' })
      return res.render('register', {errors, name, email, password})
    }
    // else store the user register information
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({ name, email, password: hash })
    res.redirect('/')
  } catch(e) {
    console.log(e)
    next(e)
  }
})

router.get('/logout', (req, res, next) => {
  console.log(req.session)
  req.logout(err => {
    if (err) return next(err)
    req.flash('success_msg', 'You have successfully logged out.')
    res.redirect('/users/login')
    console.log(req.session)
  })
})

module.exports = router