const express = require('express')
const router = express.Router()


// 新增頁面
router.get('/new',(req,res)=>{
  res.render('new')
})

// 新增
router.post('/new',(req,res)=>{
  const {name} = req.body
  Todo.create({ name })
  .then(()=>res.redirect('/'))
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