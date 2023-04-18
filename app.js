const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

if (process.env.NODE_ENV != 'production'){
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: true
}))

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = res.isAuthenticated()
  res.locals.user = res.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = res.flash('warning_msg')
})

usePassport(app)

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
