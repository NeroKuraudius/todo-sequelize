const express = require('express')
const router = express.Router()

const db = require('../../models')
const User = db.User
const Todo = db.Todo

router.get('/', (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('use not found.')

      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      }) // 上列程式碼等於Mongoose.find().lean()
    })
    .then(todos => res.render('index', { todos }))
    .catch(err=> console.log(err))
})

module.exports = router