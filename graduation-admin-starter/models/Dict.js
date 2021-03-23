const mongoose = require('mongoose')
const Dict = new mongoose.Schema({
  //字典名字
  dictTitle:{
    type: String,
    require: true,
    trim: true,//去掉两边空格
  },
  //字典类型
  dictType:{
    type: String,
    require: true,
  },
  //备注描述
  description:{
    type: String,
    default: '暂无描述',
  },
  //创建时间
  creatTime:{
    type: Date,
    default: Date.now //默认值，可以是一个值也可以是一个函数
  }
})

module.exports = mongoose.model('Dict', Dict)