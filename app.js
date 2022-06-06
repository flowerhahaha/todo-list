// set server
const express = require('express')
const app = express()

// set template engine
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// set database
const { TopologyDescription } = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const Todo = require('./models/todo')

// set db connection status
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// set body-parser 
app.use(express.urlencoded({ extended: true }))

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

// set router: edit todo detail
app.get('/todos/:id/edit', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// set router: update edited todo detail
app.post('/todos/:id/edit', (req, res) => {
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
app.post('/todos/:id/delete', (req, res) => {
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