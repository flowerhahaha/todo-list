// add required packages
const express = require('express')
const exphbs = require('express-handlebars')
// const { TopologyDescription } = require('mongodb')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const methodOverride = require('method-override')

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

// set router: get homepage
app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .sort({_id: 1}) // 1: 'asc', -1: 'desc'
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

// set router: get new page
app.get('/todos/new', (req, res) => {
  res.render('new')
})

// set router: post a new todo
app.post('/todos', (req, res) => {
  const name = req.body.name
  Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// set router: get detail page
app.get('/todos/:id', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// set router: get edit todo page
app.get('/todos/:id/edit', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// set router: put edited todo detail
app.put('/todos/:id', (req, res) => {
  const {id} = req.params
  const {name, isDone} = req.body
  Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on' // 'on' or undefined
      todo.save()
      res.redirect(`/todos/${id}`)
    })
    .catch(error => console.log(error))
})

// set router: delete todo
app.delete('/todos/:id', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .then(todo => {
      todo.remove()
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

// start the server at port 3000
app.listen(3000, () => {
  console.log('The server is running')
})