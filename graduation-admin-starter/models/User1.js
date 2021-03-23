const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = new mongoose.Schema({
  //用户账号
  userName:{
    type: String,
    require: true,
    unique: true,//唯一值
  },
  //密码
  password: {
    type: String,
    select: false,
    require: true,
    set(val) {
      return bcrypt.hashSync(val, 10);
    }
  },
  //昵称
  nickName:{
    type: String,
    trim: true,//去掉两边空格
    require: true,
  },
  //手机号码
  mobile:{
    type: String,
    require: true,
  },
  //部门id
  departmentId:{
    type: [String],
    require: true,
  },
  //角色类型
  roleType:{
    type: String,
    require: true,
    default: 0,
    // enum: [0,1,2],// 0: 普通用户 1:管理员 2:超级管理员
  },
  //用户状态
  enable:{
    type: Number,
    default: 1,
    enum: [0,1], //1表示启用成员，0表示禁用成员 
  },
  //跟企业微信同步状态
  syncStatus:{
    type: Number,
    default: 0,
    enum: [0,1,2,3],//0-未同步 1-同步成功未激活 2-同步失败 3-同步成功已激活
  },
  //创建时间
  creatTime:{
    type: Date,
    default: Date.now //默认值，可以是一个值也可以是一个函数
  }
})

module.exports = mongoose.model('Users', User)