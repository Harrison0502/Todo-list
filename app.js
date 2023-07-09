// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const Todo = require('./models/todo') // 載入 Todo model
const bodyParser = require('body-parser')
// 引用路由器
const routes = require('./routes')
require('./config/mongoose')
const usePassport = require('./config/passport')
// 載入 method-override
const methodOverride = require('method-override')
const app = express()
const PORT = process.env.PORT || 3000




// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
}))
// 呼叫 Passport 函式並傳入 app
usePassport(app)
// 將 request 導入路由器
app.use(routes)




app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定 port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})