const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// set router: get new page
router.get('/new', (req, res) => {
  res.render('new')
})

// set router: post a new todo
router.post('/', (req, res) => {
  const userId = req.user._id
  const name = req.body.name
  Todo.create({ name, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// set router: get detail page
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// set router: get edit todo page
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// set router: put edited todo detail
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, isDone } = req.body
  Todo.findOne({ _id, userId })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${_id}`))
    .catch(error => console.log(error))
})

// set router: delete todo
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId })
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// export router function object
module.exports = router