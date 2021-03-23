//企业微信token
const access_token =  `TzHMB5IyrapKxmcbhmBCOVFVIXNR5LAfFiC7i24pVCgVB1Oo3i227107LC-G5pcqiLF_JWPzyltcjAVvYj3qXkSc5tKNTWW3Qy9QEXVHE78yf-X8HYOzDMX3KiJwfu1CPmx4UiyoXrrwjyUJspBdLkxA4VFzr2z8nbhqNR8V6r7R0YcPNoTlNEf1pNFk-NbfxU51JI3NcuAjFQ4-jKsGCQ`
//引入计数模块
const Counter = require("../../models/Counter")
//引入网络请求模块
const request = require("request")


//1.导入模块
const Department = require("../../models/Department")

//初始化数据库

const insertFrist = async (data) => {
  //添加计数集合
  await Counter.create( { _id : "departmentId" , seq_val: 2}, function ( err, doc){
    if(err) return err
    // console.log(doc)
  })
  //添加父级组织
  console.log(`data: ${JSON.stringify(data)}`)
  let result  = await Department.create(data , function (err, doc){
    if(err) return err
    // console.log(`doc ${doc}`)
    return doc
  })
  // console.log(`结果: ${result}`)
  return result
}


//2.处理业务逻辑

//添加组织
const insertDepartment = async (data) => {
  //获取自增序列的值
  await Counter.findOneAndUpdate(
    { _id: 'departmentId' }, 
    { $inc: { seq_val: 1 } }, 
    {new: true},
    (err, doc) => {
      if(err) {return {msg : "获取自增ID失败",err :err }}
      // console.log("给组织ID赋值")
      data.departmentId = doc.seq_val +""
    }
  )
  console.log(`接口传递的添加组织数据: ${JSON.stringify(data)}`);
  const insertObj = await new Department(data)
  let resData = ''
  await insertObj.save()//保存到数据库里
    .then(async res => {
      console.log( `保存到数据库的信息: ${res}` )

      //这里处理企业微信需要的数据
      console.log(typeof(res.departmentName))
      let  wxData  = {
        name: res.departmentName,//企业微信部门中文名
        id: res.departmentId, //企业微信部门ID
        order: res.order,//企业微信部门排序值
        parentid: res.parentId//企业微信父级部门ID
      }
      console.log(`传递数据:${Object.prototype.toString.call(wxData) }`)

      // 这里调用企业微信第三方接口同步信息
      // access_token目前是写死的,还没做缓存
      // let url = clientBaseUrl + '/user/get?access_token=' + access_token
      // let result = {}
      // await request({
      //   url: "https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=" +access_token,
      //   methods: 'POST',
      //   json: true,
      //   headers:{
      //     "content-type": "application/json"
      //   },
      //   body: JSON.stringify(wxData)
      // },function(error, response, body) {
      //   // function() {
      //   console.log(JSON.stringify(error))
      //   console.log(`返回结构: ${JSON.stringify(response)}`)
      //   console.log(`请求返回 数据::${JSON.stringify(body)}`)
      //   result = JSON.stringify(body)
      //   // return body
      //   // }
      // }); 
      // console.log(result)
      // console.log("企业微信接口返回了吗")
      // return result
      
      await new Promise((resolve, reject) => {
        let result = ''
        console.log(wxData)
        request({
          url: "https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=" +access_token,
          method: 'POST',
          json: true,
          headers:{
            "content-type": "application/json"
          },
          body: wxData
        },function(error, response, body) {
          // function() {
          // console.log('err==', JSON.stringify(error))
          // console.log(`返回结构: ${JSON.stringify(response)}`)
          // console.log(`请求返回 数据::${JSON.stringify(body)}`)
          result = JSON.stringify(body)
          
          if (result) resolve(result)
        });
      }).then(res => {
        console.log('then===', res)
        console.log("企业微信接口返回了吗")
        resData = res
        // return {
        //   code: 0,
        //   data: '123'
        // }
      })
    })
  if (resData) {
    return {
      code: 0,
      data: resData
    }
  }
}



//3.导出

module.exports = {
  insertFrist,
  insertDepartment
}