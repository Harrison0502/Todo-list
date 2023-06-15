// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose')// 載入 mongoose
const exphbs = require('express-handlebars');
const Todo = require('./models/todo') // 載入 Todo model
const bodyParser = require('body-parser')
// 引用路由器
const routes = require('./routes')
// 載入 method-override
const methodOverride = require('method-override')
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()


// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })



// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 將 request 導入路由器
app.use(routes)



app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})