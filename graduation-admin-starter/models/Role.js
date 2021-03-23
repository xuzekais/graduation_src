const mongoose = require('mongoose')
const Role = new mongoose.Schema({

  //角色名称
  roleName:{
    type: String,
    trim: true,//去掉两边空格
    require: true,
  },
  //角色编码
  roleCode:{
    type: String,
    require: true,
  },
  //备注描述
  description:{
    type: String,
    default: '暂无描述',
  },
  //角色类型
  roleType:{
    type: String,
    require: true,
    unique: true,//唯一值
    // enum: [0,1,2],// 0: 普通用户 1:管理员 2:超级管理员
  },
  //菜单
  menuData:{
    type:[String],
    require: true,
  },
  //创建时间
  creatTime:{
    type: Date,
    default: Date.now //默认值，可以是一个值也可以是一个函数
  }
})

module.exports = mongoose.model('Role', Role)

