const mongoose = require('mongoose')
const Department = new mongoose.Schema({
  //部门ID
  departmentId:{
    type: String,
    require: true,
    unique: true
  },
  //部门名称
  departmentName:{
    type: String,
    trim: true,//去掉两边空格
    unique: true,
    require: true,
  },
  //部门英文名称
  departmentNameEn:{
    type:String,
    trim: true
  },
  //是否为父级
  isParent:{
    type: Number,
    require: true,
    enum:[0,1],//0: 不是 1:是
  },
  //父级的ID
  parentId:{
    type: String,
    require: true,
  },
  order:{
    type:Number,
    enum:[0,1,2,3,4,5,6,7,8,9],
    default: 1
  },
  //机构等级
  orgLevel:{
    type: Number,
  },
  //创建时间
  creatTime:{
    type: Date,
    default: Date.now //默认值，可以是一个值也可以是一个函数
  }
})

module.exports = mongoose.model('Department', Department)
