const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// set router: get new page
router.get('/new', (req, res) => {
  res.render('new')
})

// set router: post a new todo
router.post('/', (req, res) => {
  const name = req.body.name
  Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// set router: get detail page
router.get('/:id', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// set router: get edit todo page
router.get('/:id/edit', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// set router: put edited todo detail
router.put('/:id', (req, res) => {
  const {id} = req.params
  const {name, isDone} = req.body
  Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on' // 'on' or undefined
      todo.save()
      res.redirect(`/${id}`)
    })
    .catch(error => console.log(error))
})

// set router: delete todo
router.delete('/:id', (req, res) => {
  const {id} = req.params
  Todo.findById(id)
    .then(todo => {
      todo.remove()
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

// export router function object
module.exports = router

// console.log(router)