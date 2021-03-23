const mongoose = require('mongoose')
const Menu = new mongoose.Schema({
  //菜单名称
  menuName:{
    type: String,
    require: true,
  },
  //菜单路由名称
  menuRouterName:{
    type: String,
    trim: true,//去掉两边空格
    require: true,
  },
  //路径
  menuPath:{
    type: String,
    trim: true,//去掉两边空格
    require: true,
  },
})

module.exports = mongoose.model('Menu', Menu)