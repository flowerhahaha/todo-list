const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', 
  (req, res, next) => {
    console.log('/auth/facebook middleware') 
    next()
  }, 
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  })
)

// router.get('/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/users/login'
// })

router.get('/facebook/callback',
  (req, res, next) => {
    console.log('/auth/facebook/callback middleware') 
    next()
  }, 
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  (req, res) => {
    console.log('Successful facebook authentication')
    res.redirect('/');
  });


module.exports = router