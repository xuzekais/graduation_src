const mongoose = require('mongoose')
const Menu = new mongoose.Schema({
  //菜单名称
  menuName:{
    type: String,
    trim: true,//去掉两边空格
    require: true,
  },
  //菜单路由名称
  menuRouterName:{
    type: String,
    require: true,
  },
  //路径
  menuPath:{
    type: String,
    trim: true,//去掉两边空格
    unique: true,
    require: true,
  },
  //排序值
  order:{
    type: Number,
    enum:[0,1,2,3,4,5,6,7,8,9],
    default: 0
  },
  //是否启用
  isUsed:{
    type: String,
    enum:[0,1],//0: 不启用,1:启用
    default: 0
  },
  //父级的ID,原始则为空
  parentId:{
    type: ObjectId,

  },
  //是否为父级
  isParent:{
    type: String,
    enum:[0,1],//0: 不是,1:是
    default: 0
  }


})

module.exports = mongoose.model('Menu', Menu)