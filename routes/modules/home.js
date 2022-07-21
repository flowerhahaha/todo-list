const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// set router: get homepage
router.get('/', (req, res) => {
  console.log('This is get "/" route')
  const userId = req.user._id
  Todo.find({ userId })
    .lean()
    .sort({_id: 1}) // 1: 'asc', -1: 'desc'
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

module.exports = router