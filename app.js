const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./models')
const Todo =db.Todo
const User = db.User

const app = express()
const PORT = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))


// 登入頁
app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true 
  }) // 上列程式碼等於Mongoose.find().lean()
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

//登入功能
app.post('/users/login', (req, res) => {
  res.send('login')
})

// 註冊頁
app.get('/users/register', (req, res) => {
  res.render('register')
})

// 註冊功能
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// 登出功能
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// 查詢詳細
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() })) 
    // 上列程式碼等於Mongoose.findById().lean()
    .catch(error => console.log(error))
})


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
