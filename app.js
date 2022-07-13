// add modules
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const Todo = require('./models/todo')
const routes = require('./routes')
require('./config/mongoose')

console.log(process.env.NODE_ENV)
const app = express()
const PORT = process.env.PORT || 3000

// set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// set middleware: body-parser 
app.use(express.urlencoded({ extended: true }))

// set middleware: method-override
app.use(methodOverride('_method'))

// set middleware: routes
app.use(routes)

// start the server at port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})