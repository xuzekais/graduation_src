const mongoose = require('mongoose')
const DictData = new mongoose.Schema({
  //对应字典ID
  dictId:{
    type: String,
    require: true,
  },
  //具体标题
  title:{
    type: String,
    require: true,
  },
  //对应的具体值
  value:{
    type: String,
    require: true,
    default: '0',
  },
  //创建时间
  creatTime:{
    type: Date,
    default: Date.now //默认值，可以是一个值也可以是一个函数
  }
})

module.exports = mongoose.model('DictData', DictData)