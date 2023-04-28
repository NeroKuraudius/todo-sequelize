const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FBStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const findUser = await User.findOne({ where: { email } })
      if (!findUser) {
        return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
      }
      const loginProcess = await bcrypt.compare(password, findUser.password)
      if (!loginProcess) {
        return done(null, false, req.flash('warning_msg', 'Email or Password is incorrect.'))
      }
      return done(null, findUser)
    } catch (err) {
      done(err)
    }
  }))

  passport.use(new FBStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    try {
      const findUser = await User.findOne({ where: { email } })
      if (findUser) return done(null, findUser)
      const randomPassword = Math.random().toString(36).slice(-10) //產生隨機密碼
      const passwordGensalt = await bcrypt.genSalt(10) // 撒鹽雜湊
      const passwordHash = await bcrypt.hash(randomPassword, passwordGensalt) // 隨機密碼
      const createNewUser = await User.create({ name, email, password: passwordHash }) // 創建新使用者
      return done(null, createNewUser)
    } catch (err) {
      done(err)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const findUser = await User.findByPk(id)
      processedUser = findUser.toJSON()
      return done(null, processedUser)
    } catch (err) {
      done(err)
    }
  })
}