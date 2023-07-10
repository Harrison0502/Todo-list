const express=require('express')
const router=express.Router()
const User=require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')  


router.get('/login',(req,res)=>{
  const userInput = req.session.userInput || {}; // 從 session 中取回使用者輸入的值
  // 清除 session 中的使用者輸入
  delete req.session.userInput;
  res.render('login', { email: userInput.email, password: userInput.password });
})

router.post('/login', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  req.session.userInput = { email, password } // 存儲使用者輸入的值
  next() 
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
})
)

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '使用者已經存在' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
        userExists:true
      })
    } else {
      return bcrypt
        .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
        .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
        .then(hash => User.create({
          name,
          email,
          password: hash // 用雜湊值取代原本的使用者密碼
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router