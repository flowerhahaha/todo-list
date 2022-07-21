const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // login with email and password
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passReqToCallback: true 
    }, 
    async (req, email, password, done) => {
      console.log('callbackFn of new LocalStrategy')
      try {
        const userData = await User.findOne({ email })
        if (!userData) {
          return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
        }
        const isMatch = await bcrypt.compare(password, userData.password)
        if (!isMatch) {
          return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
        }
        return done(null, userData)
      } catch (err) {
        done(err, false)
      }
    }
  ))
  
  // login with facebook
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, 
    async (accessToken, refreshToken, profile, done) => {
      console.log('callbackFn of new FacebookStrategy')
      const { name, email } = profile._json
      console.log(name, email)
      try {
        // if the user doesn't exist, generate a random password and store the userData first
        let userData = await User.findOne({ email })
        console.log('user: ', userData)
        if (!userData) {
          const randomPassword = Math.random().toString(36).slice(-8)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          userData = await User.create({ name, email, password: hash })
        }
        // log in to the homepage
        return done(null, userData)
      } catch (err) {
        console.log(err)
        done(err, false)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    console.log('callbackFn of serializeUser')
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    console.log('callbackFn of deserializeUser')
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}