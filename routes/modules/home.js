const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  const UserId = req.user.id
  return Todo.findAll({
    raw: true,
    nest: true,
    where: { UserId }
  }) // 上列程式碼等於Mongoose.find().lean()
    .then(todos => res.render('index', { todos }))
    .catch(err => console.log(err))
})

module.exports = router