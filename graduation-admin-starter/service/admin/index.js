//企业微信token
const access_token =  `86SeD2IU8WDRLRP6_aIOLN5QWUV1l72ap6bXUSaUUV1K-u8Jhk-RIiAh80fwonfmdST0BfwRPLRbsb7rAvcN3grdEyvOeYj9nhR3Kqfrw-RWivuB0vXIgkNlxtfUHJ64iXQDCHYLBv2xgyfu9c0I5LenLaA8jmSWWY2pERV5JunnTHBnovLWsitoRGN6HCEUmsFuCezJhK5yF3q3fUAXAw`
//引入计数模块
const Counter = require("../../models/Counter")
//引入网络请求模块
const request = require("request")
const rq = require("request-promise")


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
//获取初始父级列表
const getInitialDepatment = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  //1.获取数据库的数据
  const findData = await Department.find(
    { parentId: "0"},
    (err,docs) => {
      if(err){ return err}
      console.log(docs)
    }
  )
  //处理成前端树形控件所需格式
  let resultData = []
  for(let i = 0; i < findData.length; i++){
    let obj = {
      id: findData[i].departmentId,
      label: findData[i].departmentName
    }
    resultData.push(obj)
  }
  return resultData
}

//获取子组织列表
const getSubsDepartment = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  //1.根据父级ID获取其子部门
  const findData = await Department.find(
    { parentId: data.id},
    (err,docs) => {
      if(err){return err}
      // console.log(`请求返回的数据: ${JSON.stringify(docs)}`)
    }
  )
  //2.处理数据
  console.log(`接口传递数据: ${JSON.stringify(findData)}`)
  let resultData = []
  for(let i = 0; i < findData.length; i++){
    let obj = {
      id: findData[i].departmentId,
      label: findData[i].departmentName
    }
    resultData.push(obj)
  }
  //3.返回数据
  return resultData
}

//添加组织
const insertDepartment = async (data) => {
  //获取自增序列的值
  const counterResult = await Counter.findOneAndUpdate(
    { _id: 'departmentId' }, 
    { $inc: { seq_val: 1 } }, 
    {new: true},
    (err, doc) => {
      if(err) {return {msg : "获取自增ID失败",err :err }}
      // data.departmentId = doc.seq_val +""
      return doc
    }
  )
  //给本地数据库部门ID赋值
  data.departmentId = counterResult.seq_val +""
  console.log(`接口传递的添加组织数据: ${JSON.stringify(data)}`);
  const insertObj = await new Department(data)
  
  let resultData = await insertObj.save()//保存到数据库里
    .then(async res => {
      console.log( `保存到数据库的信息: ${res}` )

      //这里处理企业微信需要的数据
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
      const requestResult = await rq({
        url: "https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=" +access_token,
        method: 'POST',
        json: true,
        headers:{
          "content-type": "application/json"
        },
        body: wxData
      })
        .then( res => {
          console.log(`请求返回的数据::${JSON.stringify(res)}`)
          return res
        })
        .catch( err => {
          console.log(`请求错误的数据: ${JSON.stringify(error)}`)
          return err
        })
        // resultData = requestResult
      // console.log(requestResult)
      console.log("企业微信接口返回了吗")
      return requestResult
      

    })
    console.log(resultData)
    if(resultData.errcode == 0){
      return {
        code: 0,
        msg: "同步企业微信数据成功",
        data: resultData
      }
    }else{
      return {
        code: 1,
        msg: "同步企业微信数据失败",
        data: resultData
      }
    }
}

//删除组织
const removeDepartment = async (data) => {
  //1.删除数据库的信息
  console.log(`${JSON.stringify(data)}`)
  const departmentResult = await Department.deleteOne(
      {departmentId: data.departmentId},
      (err ,doc) => {
      if(err) {
        console.log(`删除数据库出错:${err}`)
        throw err 
      }
      console.log(`DOC的内容: ${JSON.stringify(doc)}`)
    }
  )
  //2.同步到企业微信
  const requestResult = await rq({
    uri: "https://qyapi.weixin.qq.com/cgi-bin/department/delete",
    qs:{
      access_token: access_token,
      id: data.departmentId
    },
    method: 'GET',
    json: true,
    headers:{
      "content-type": "application/json"
    },
  })
    .then( res => {
      console.log(`请求返回的数据::${JSON.stringify(res)}`)
      return res
    })
    .catch( err => {
      console.log(`请求错误的数据: ${JSON.stringify(error)}`)
      return err
    })
  
  //3.返回数据
  // console.log(`最终返回的: ${JSON.stringify(requestResult)}`)
  return requestResult
}

//更新组织
const updateDepartment = async (data) => {
  //1.更新数据库信息
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  const updataResult = await Department.updateOne(
    { departmentId : data.departmentId},
    { $set: {
      departmentName: data.departmentName,
      order: data.order
    }},
    (err,doc) => {
      console.log(`err: ${JSON.stringify(doc)}`)
      if(err){
        console.log(`err: ${JSON.stringify(err)}`)
        return err
      }
    }
  )
  //数据库已经更新
  if(updataResult.n == 1 ){
    //2.调用企业微信接口同步
    let  wxData  = {
      name: data.departmentName,
      order: data.order,//企业微信部门排序值
    }
    const requestResult = await rq({
      uri: "https://qyapi.weixin.qq.com/cgi-bin/department/update",
      qs:{
        access_token: access_token,
      },
      method: 'POST',
      json: true,
      headers:{
        "content-type": "application/json"
      },
      body: wxData
    })
      .then( res => {
        console.log(`返回的数据:${JSON.stringify(res)}`)
        return res
      })
      .catch( err => {
        console.log(`报错信息:${JSON.stringify(err)}`)
        return err
      })
    //3.返回数据
    return requestResult
  }else{
    return {
      code:1,
      msg: "接口请求失败",
    }
  }
}

//获取单个组织信息
const getOneDeparment = async (data) => {
  //1.查询数据库中是否有对应的数据
  let findData = await Department.findOne(
    { departmentId: data.id},
    { _id : 0 , __v : 0},
    (err, docs) => {
      if(err){return err}
      console.log(`接口返回的数据: ${JSON.stringify(docs)}`)
    }
  )
  //2.返回数据
  return findData
}

//3.导出

module.exports = {
  insertFrist,
  getInitialDepatment,
  getSubsDepartment,
  insertDepartment,
  removeDepartment,
  updateDepartment,
  getOneDeparment
}