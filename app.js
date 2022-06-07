// add required packages
const express = require('express')
const exphbs = require('express-handlebars')
// const { TopologyDescription } = require('mongodb')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const methodOverride = require('method-override')
const routes = require('./routes')

// set constant
const app = express()
const db = mongoose.connection

// set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// set db connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// set middleware: body-parser 
app.use(express.urlencoded({ extended: true }))

// set middleware: method-override
app.use(methodOverride('_method'))

// set middleware: routes
app.use(routes)

// start the server at port 3000
app.listen(3000, () => {
  console.log('The server is running')
})