const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  }) // 上列程式碼等於Mongoose.find().lean()
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router