module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    console.log('authenticator middleware')
    req.flash('warning_msg', 'Please login first!')
    res.redirect('/users/login')
  }
}