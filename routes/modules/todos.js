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
  const UserId = req.user.id
  const { name } = req.body

  return Todo.create({ UserId, name })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 查看詳細
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = Number(req.params.id)

  return Todo.findOne({where:{UserId,id}})
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    // 上列程式碼等於Mongoose.findById().lean()
    .catch(error => console.log(error))
})

// 編輯頁面
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({ where: {UserId ,id} })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 儲存編輯
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findOne({ where: { UserId,id} })
    .then(todo => {
      todo.name = name
      todo.isDone = (isDone === 'on')
      todo.updatedAt = new Date()
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({ where: { UserId,id } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router