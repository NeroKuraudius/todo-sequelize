const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo


// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增
router.post('/new', (req, res) => {
  const userId = req.user.id
  const { name } = req.body

  return Todo.create({ userId, name })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 查看詳細
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(Number(id))
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    // 上列程式碼等於Mongoose.findById().lean()
    .catch(error => console.log(error))
})

module.exports = router