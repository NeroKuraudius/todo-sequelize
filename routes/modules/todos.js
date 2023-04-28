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
router.get('/:id', async (req, res) => {
  const UserId = req.user.id
  const id = Number(req.params.id)

  try {
    const findTodo = await Todo.findOne({ where: { UserId, id } })
    return res.render('detail', { todo: findTodo.toJSON() })
    // 上列程式碼等於Mongoose.findById().lean()
  } catch (error) {
    console.log(error)
  }
})

// 編輯頁面
router.get('/:id/edit', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  try {
    const findTodo = await Todo.findOne({ where: { UserId, id } })
    return res.render('edit', { todo: findTodo.toJSON() })
  } catch (error) {
    console.log(error)
  }
})

// 儲存編輯
router.put('/:id', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  try {
    const findTodo = await Todo.findOne({ where: { UserId, id } })
    findTodo.name = name
    findTodo.isDone = (isDone === 'on')
    findTodo.updatedAt = new Date()
    findTodo.save()
    return res.redirect(`/todos/${id}`)
  } catch (err) {
    console.log(err)
  }
})

// 刪除資料
router.delete('/:id', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  try {
    const findTodo = await Todo.findOne({ where: { UserId, id } })
    findTodo.destroy()
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router