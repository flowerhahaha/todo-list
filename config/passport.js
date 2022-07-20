const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  /* usernameField 預設是 username，會自動抓取 POST body 中的 username 屬性代入其後 callbackFn 的第一個參數，參數名稱可自訂，passwordField 預設則是 password
  */
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passReqToCallback: true 
    }, 
    (req, email, password, done) => {
      console.log('callbackFn of new LocalStrategy')
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
          }
          if (user.password !== password) {
            return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
          }
          return done(null, user)
        })
        .catch(err => done(err, false))
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