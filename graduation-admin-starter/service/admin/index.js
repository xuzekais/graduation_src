//企业微信token
const access_token =  `86SeD2IU8WDRLRP6_aIOLN5QWUV1l72ap6bXUSaUUV1K-u8Jhk-RIiAh80fwonfmdST0BfwRPLRbsb7rAvcN3grdEyvOeYj9nhR3Kqfrw-RWivuB0vXIgkNlxtfUHJ64iXQDCHYLBv2xgyfu9c0I5LenLaA8jmSWWY2pERV5JunnTHBnovLWsitoRGN6HCEUmsFuCezJhK5yF3q3fUAXAw`
//引入计数模块
const Counter = require("../../models/Counter")
//引入网络请求模块
const request = require("request")
const rq = require("request-promise")


//1.导入模块
const Department = require("../../models/Department")
const Menu = require("../../models/Menu")
const role = require("../../models/Role")

const User = require("../../models/User1")

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
//添加用户
const insertUser = async (data) => {
  console.log(`添加组织接口传递数据: ${JSON.stringify(data)}`)
  //1.添加用户数据到数据库

}

//获取全部菜单列表
const getAllMenu = async () => {
  //1.第一步查父级的菜单
  let parentResult = await Menu.find(
    {isParent : 1},
    { __v : 0},
    (err, docs) => {
      if(err){
        console.log(`获取菜单列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  console.log(parentResult)
  for(let i = 0; i < parentResult.length; i++){
    let childResult = await Menu.find(
      {parentId: parentResult[i]._id},
      {__v: 0},
      (err,docs) => {
        if(err){
          console.log(`获取子级菜单列表失败: ${JSON.stringify(err)}`)
          return err
        }
        console.log(`获取菜单列表失败: ${JSON.stringify(docs)}`)
        return docs
      }
    )
    parentResult[i]['children'] = childResult
    console.log(parentResult[i]['children'])
  }
  console.log("返回数据了吗")
  return parentResult
}

//添加菜单
const insertMenu = async (data) => {
  console.log(`添加菜单接口传递数据: ${JSON.stringify(data)}`)
  //1.添加角色数据到数据库
  const insertObj = await new Menu(data)
  let resultData = await insertObj.save()
    .then( res => {
      console.log( `保存到数据库的信息: ${res}` )
      return res
    })
  return {
    code: 0,
    data: resultData
  }
}

//删除菜单
const removeMenu = async (data) => {
  console.log(`删除菜单接口传递数据: ${JSON.stringify(data)}`)
  const menuResult = await Menu.deleteOne(
    {_id: data.id},
    (err ,doc) => {
      if(err) {
        console.log(`删除数据库出错:${err}`)
        throw err 
      }
      console.log(`DOC的内容: ${JSON.stringify(doc)}`)
    }
  )
  return menuResult
}

//更新菜单
const updateMenu = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  const updataResult = await Menu.updateOne(
    { _id : data._id},
    { $set: {
      menuName: data.menuName,
      menuPath: data.menuPath,
      order: data.order,
      isUsed: data.isUsed,
      parentId: data.parentId
    }},
    (err,doc) => {
      console.log(`doc: ${JSON.stringify(doc)}`)
      if(err){
        console.log(`err: ${JSON.stringify(err)}`)
        return err
      }
    }
  )
  return updataResult
}

//添加角色
const insertRole = async (data) => {
  console.log(`添加组织接口传递数据: ${JSON.stringify(data)}`)
  //1.添加角色数据到数据库
  const insertObj = await new Department(data)
  let resultData = await insertObj.save()
    .then( res => {})

}

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
    { _id: 0, __v: 0},
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
      label: findData[i].departmentName,
      isLeaf: findData[i].isParent == 1 ? false : true
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
      //将父级组织的isParent(是否为父级)修改
      const updataResult = await Department.updateOne(
        {departmentId: res.parentId},
        {$set: 
          {isParent: 1 }
        },
        (err ,docs) => {
          if(err){
            console.log(`err: ${JSON.stringify(err)}`)
            return err
          }
        }
      )
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
  //1.修改父级组织的isParent(是否为父级)状态
  const changeResult = await Department.findOne(
    {parentId: data.parentId},
    { _id : 0 , __v : 0},
    async (err, docs) => {
      if(err){return err}
      console.log(`相同父级的数据: ${JSON.stringify(docs)}`)
      if(!docs){
        const findData = await Department.updateOne(
          { departmentId : data.parentId},
          { $set: {
            isParent: 0,
          }},
          (err,doc) => {
            console.log(`err: ${JSON.stringify(doc)}`)
            if(err){
              console.log(`err: ${JSON.stringify(err)}`)
              return err
            }
          }
        )
      }
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
  insertUser,
  getAllMenu,
  insertMenu,
  removeMenu,
  updateMenu,
  getInitialDepatment,
  getSubsDepartment,
  insertDepartment,
  removeDepartment,
  updateDepartment,
  getOneDeparment
}