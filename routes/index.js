const express = require('express')
const router = express.Router() 
const home = require('./modules/home')
const todos = require('./modules/todos')

/* 
1. router 是一個函式物件，類似功能比較少的 mini app(app = express())，
2. 跟 app 一樣可使用 .use() .get() 等方法來設定路由
3. 可作為 .use('/directory', callbackFn) 裡面的 callbackFn 來使用

console.log(express) // [Function: createApplication] {...}
console.log(express()) // [Function: app] {...}
console.log(router) // [Function: router] {...}
*/

router.use('/', home)
router.use('/todos', todos)

module.exports = router // 把 router 存進 index.js 的 module.exports 屬性
// console.log('index: ', router) // [Function: router] {...}