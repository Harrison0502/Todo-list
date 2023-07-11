const Todo = require('../todo')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

// 連線成功
db.once('open', () => {
  bcrypt
  .genSalt(10)
  .then(salt=>bcrypt.hash(SEED_USER.password,salt))
  .then(hash=>User.create({
    name:SEED_USER.name,
    email: SEED_USER.email,
    password:hash
  }))
  .then(user=>{
    const userId = user._id
    return Promise.all(Array.from(
      { length: 10 },
      (_, i) => Todo.create({ name: `name-${i}`, userId })
    ))
  })
  .then(() => {
      console.log('done.')
      process.exit()
  })
})