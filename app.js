// add modules
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000

// set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// set middleware: session
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}))

// set middleware: body-parser 
app.use(express.urlencoded({ extended: true }))

// set middleware: method-override
app.use(methodOverride('_method'))

// set middleware: passport initialize and authenticate
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  console.log(req.session)
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  console.log(req.session)
  next()
})

// set middleware: routes
app.use(routes)

// error handling: catch error from server side
app.use((err, req, res, next) => {
  const errMessage = 'Sorry! Server is broken. We will fix it soon.'
  console.log(err)
  res.status(500).render('error', { errMessage })
})

// start the server at port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})