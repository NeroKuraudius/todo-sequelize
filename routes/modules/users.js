const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User


// 登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

//登入功能
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊功能
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  // 欄位檢查
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位皆為必填' })
  }
  // 密碼檢查
  if (password !== confirmPassword) {
    errors.push({ message: '密碼輸入不符' })
  }

  // 檢視錯誤
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  try {
    const findUser = await User.findOne({ where: { email } })
    if (findUser) {
      errors.push({ message: '該帳號已註冊' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    const passwordGensalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordGensalt)
    const createUser = await User.create({ name, email, password: passwordHash })
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

// 登出功能
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
  })
  req.flash('success_msg', '您已成功登出')
  res.redirect('/')
})

module.exports = router