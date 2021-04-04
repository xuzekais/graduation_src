//企业微信token
let access_token =  ``
let ab = 1
//引入计数模块
const Counter = require("../../models/Counter")
//引入网络请求模块
const request = require("request")
const rq = require("request-promise")
const assert = require("http-assert");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule")
async function getToken(data) {
  const res = await rq({
    url:"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wwf591efa35a5936c0&corpsecret=" + data,
    method: 'GET',
    json: true,
    headers:{
      "content-type": "application/json"
    },
  })
  .then(res => {
    console.log(`请求返回的数据::${JSON.stringify(res)}`)
    return res
  })
  console.log(res)
  access_token = res.access_token
}
// getToken('N73TA0f8cGsbEZzHusYdEEzb3NIkFOutioEI56lPCHg')
schedule.scheduleJob('0 59 * * * *',async function(){
  await getToken('N73TA0f8cGsbEZzHusYdEEzb3NIkFOutioEI56lPCHg')
});

//1.导入模块
const Department = require("../../models/Department")
const Menu = require("../../models/Menu")
const Role = require("../../models/Role1")
const User = require("../../models/User1")
const Problem = require("../../models/Problem")
//初始化数据库

const insertFrist = async (data) => {
  //添加计数集合
  await Counter.create( { _id : "departmentId" , seq_val: 2}, function ( err, doc){
    if(err) return err
    // console.log(doc)
  })
  await Counter.create( { _id : "userName" , seq_val: 2}, function ( err, doc){
    if(err) return err
    // console.log(doc)
  })
  //添加父级组织
  console.log(`data: ${JSON.stringify(data)}`)
  let result  = await Department.create(
    {
      order: 1,
      departmentId: "1",
      departmentName: "学生毕设组织",
      isParent: "1",
      parentId: "0"
    } , 
    function (err, doc){
    if(err) return err
    // console.log(`doc ${doc}`)
    return doc
  })
  let departInfo= {
    departmentId: "1",
    departmentName: "学生毕设组织"
  }
  let userResult = await User.create(
    {
      userName: "XuZeKai",
      password:"JS123456",
      nickName: "许泽铠",
      mobile:"18420014917",
      departInfo: departInfo
    },
  )
  // console.log(`结果: ${result}`)
  return {
    result,
    userResult
  }
}


//2.处理业务逻辑

//登录
const login = async (data) => {
  console.log(`接口传递数据:${JSON.stringify(data)}`)
  const user = await User.findOne({
    userName: data.userName,
  }).select("+password");
  // console.log(user)
  assert(user, 422, "用户不存在");
  const isValid = require("bcryptjs").compareSync(data.password, user.password);
  assert(isValid, 422, "密码错误");
  const token = jwt.sign({
      id: user._id,
    },
    "i2u34y12oi3u4y8"
  );
  return {
    token,
    roleId: user.roleInfo._id
  }
}


//获取用户列表
const getUser = async (data) => {
  let searchObj = {}
  if(data){
    console.log(`接口传递数据: ${JSON.stringify(data)}`)
    let searchFrom = JSON.parse(data.searchFrom)
    searchObj={
      userName: new RegExp(searchFrom.userName),
      nickName: new RegExp(searchFrom.nickName),
      syncStatus: searchFrom.syncStatus,
      enable : searchFrom.enable,
      gender: searchFrom.gender,
      'roleInfo.roleName': new RegExp(searchFrom.roleName),
    }
  }
  //处理搜索条件
  if(!searchObj.userName){
    delete searchObj.userName
  }
  if(!searchObj.syncStatus){
    delete searchObj.syncStatus
  }
  if(!searchObj.enable){
    delete searchObj.enable
  }
  if(!searchObj.gender){
    delete searchObj.gender
  }
  if(searchObj.userName == '/(?:)/'){
    delete searchObj.userName
  }
  if(searchObj.nickName == '/(?:)/'){
    delete searchObj.nickName
  }
  if(searchObj['roleInfo.roleName'] == '/(?:)/'){
    delete searchObj['roleInfo.roleName']
  }
  console.log(searchObj)
  //搜索数据库
  let parentResult = await User.find(
    searchObj,
    { __v : 0},
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(parentResult)
  console.log("返回数据了吗")
  return parentResult
}

//添加用户
const insertUser = async (data) => {
  // console.log(`添加组织接口传递数据: ${JSON.stringify(data)}`)
  //1.根据自定规则生成username
  const counterResult = await Counter.findOneAndUpdate(
    { _id: 'userName' }, 
    { $inc: { seq_val: 1 } }, 
    {new: true},
    (err, doc) => {
      if(err) {return {msg : "获取自增ID失败",err :err }}
      // data.departmentId = doc.seq_val +""
      return doc
    }
  )
  data.userName = 'PG' + ( 90000 + Number(counterResult.seq_val) )
  data.password = "JS123456"
  //2.将数据写入数据库中
  // console.log(`接口传递的添加组织数据: ${JSON.stringify(data)}`);
  
  const insertObj = await new User(data)
  
  let resultData = await insertObj.save()
    .then( async res => {
      console.log( `保存到数据库的信息: ${res}` )
      let arr=[]
      for(let i =0; i<res.departInfo.length;i++){
        arr.push(res.departInfo[i].departmentId)
      }
      //这里处理企业微信需要的数据
      let  wxData  = {
        userid: res.userName,//企业微信唯一标识
        name: res.nickName,//企业微信部门中文名
        mobile: res.mobile,//企业微信对应手机号
        department: arr,//企业微信用户所属部门
        gender: res.gender, //企业微信用户性别
        enable: res.enable,//企业微信是否使用该用户
      }
      console.log(`企业微信传递数据:${JSON.stringify(wxData) }`)
      const requestResult = await rq({
        url: "https://qyapi.weixin.qq.com/cgi-bin/user/create?access_token=" +access_token,
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

//删除用户
const removeUser = async (data) => {
  //1.删除数据库中的信息
  console.log(`${JSON.stringify(data)}`)
  const userResult = await User.deleteOne(
      {userName: data.userName},
      (err ,doc) => {
      if(err) {
        console.log(`删除数据库出错:${err}`)
        throw err 
      }
      console.log(`DOC的内容: ${JSON.stringify(doc)}`)
    }
  )
  //同步到企业微信
  const requestResult = await rq({
    uri: "https://qyapi.weixin.qq.com/cgi-bin/user/delete",
    qs:{
      access_token: access_token,
      userid: data.userName
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
  return requestResult
}

//更新用户
const updateUser = async (data) => {
  //1.更新数据库信息
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  const updataResult = await User.updateOne(
    { userName : data.userName},
    { $set: {
      nickName: data.nickName,
      departInfo: data.departInfo,
      roleInfo: data.roleInfo,
      gender: data.gender
    }},
    (err,doc) => {
      console.log(`err: ${JSON.stringify(doc)}`)
      if(err){
        console.log(`err: ${JSON.stringify(err)}`)
        return err
      }
    }
  )
  if(updataResult.n == 1 ){
    let arr=[]
    for(let i =0; i<data.departInfo.length;i++){
      arr.push(data.departInfo[i].departmentId)
    }
    let  wxData  = {
      userid: data.userName,
      name: data.nickName,//企业微信部门中文名
      department:arr,//企业微信用户所属部门
      gender: data.gender, //企业微信用户性别
    }
    const requestResult = await rq({
      uri: "https://qyapi.weixin.qq.com/cgi-bin/user/update",
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

//获取全部菜单列表
const getAllMenu = async () => {
  //1.第一步查父级的菜单
  console.log(ab)
  let parentResult = await Menu.find(
    {isParent : 1},
    { __v : 0},
    (err, docs) => {
      if(err){
        // console.log(`获取菜单列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(parentResult)
  for(let i = 0; i < parentResult.length; i++){
    let childResult = await Menu.find(
      {parentId: parentResult[i]._id},
      {__v: 0},
      (err,docs) => {
        if(err){
          // console.log(`获取子级菜单列表失败: ${JSON.stringify(err)}`)
          return err
        }
        // console.log(`获取菜单列表失败: ${JSON.stringify(docs)}`)
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

//获取角色列表
const getRole = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  let parentResult = await Role.find(
    {roleName: new RegExp(data.roleName) },
    { __v : 0},
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(parentResult)
  console.log("返回数据了吗")
  return parentResult
}

//获取角色列表字典
const getRoleDict = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  let parentResult = await Role.find(
    {},
    { 
      roleName : 1,
      _id: 1
    },
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(parentResult)
  console.log("返回数据了吗")
  return parentResult
}

//添加角色
const insertRole = async (data) => {
  console.log(`添加角色接口传递数据: ${JSON.stringify(data)}`)
  //1.添加角色数据到数据库
  const insertObj = await new Role(data)
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

//删除角色
const removeRole = async (data) => {
  console.log(`删除角色接口传递数据: ${JSON.stringify(data)}`)
  const roleResult = await Role.deleteOne(
    {_id: data.id},
    (err ,doc) => {
      if(err) {
        console.log(`删除数据库出错:${err}`)
        throw err 
      }
      console.log(`DOC的内容: ${JSON.stringify(doc)}`)
    }
  )
  return roleResult
}

//更新角色
const updateRole = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  const updataResult = await Role.updateOne(
    { _id : data._id},
    { $set: {
      roleName: data.roleName,
      roleCode: data.roleCode,
      description: data.description,
      menuData: data.menuData,
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

//给角色分配菜单权限
const allotMenu = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  const updataResult = await Role.updateOne(
    { _id : data._id},
    { $set: {
      menuData: data.menuData,
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

//获取角色对应菜单权限
const getRoleMenu = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  let parentResult = await Role.findOne(
    {_id:  data.id },
    {menuData : 1},
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  let n = parentResult.menuData.pop()
  console.log(n)
  for(let i = 0; i< n; i++){
    parentResult.menuData.pop()
  }
  console.log("返回数据了吗")
  return parentResult
}

//获取角色对应的菜单信息
const getRoleMenuInfo = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  let parentResult = await Role.findOne(
    {_id:  data.id },
    {menuData : 1},
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  parentResult.menuData.pop()
  // console.log(parentResult)
  //获取菜单信息
  const menuResult = await Menu.find(
    {_id: {$in : parentResult.menuData}},
    {__v: 0 },
    (err, docs) => {
      if(err){
        console.log(`获取菜单列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(menuResult)
  //处理菜单信息
  let lastData = []
  for(let i = 0; i<menuResult.length; i++){
    if(menuResult[i].isParent == 1){
      lastData.push(menuResult[i])
    }
  }
  for(let i = 0; i<menuResult.length; i++){
    for(let j = 0; j <lastData.length; j++){
      // console.log(menuResult[i].parentId)
      // console.log(lastData[j]._id)
      // console.log(String( menuResult[i].parentId) == String(lastData[j]._id) )
      if(String( menuResult[i].parentId) == String(lastData[j]._id)){
        lastData[j].children.push(menuResult[i])
      }
    }
  }
  // console.log(lastData)

  // console.log("返回数据了吗")
  return lastData
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
      // console.log(`传递数据:${Object.prototype.toString.call(wxData) }`)
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

//获取申报内容列表
const getProblemList = async (data) => {
  console.log(`接口传递数据: ${JSON.stringify(data)}`)
  let searchFrom = JSON.parse(data.searchFrom)

  let searchObj = {
    optionTitle: new RegExp(searchFrom.optionTitle),
    optionType: searchFrom.optionType,
    isRequired: searchFrom.isRequired,
    isEnable: searchFrom.isEnable,
  }
  //处理搜索条件
  if(!searchObj.optionType){
    delete searchObj.optionType
  }
  if(!searchObj.isRequired){
    delete searchObj.isRequired
  }
  if(!searchObj.isEnable){
    delete searchObj.isEnable
  }
  if(searchObj.optionTitle == '/(?:)/'){
    delete searchObj.optionTitle
  }
  console.log(searchObj)
  const parentResult = await Problem.find(
    searchObj,
    { __v : 0},
    (err, docs) => {
      if(err){
        // console.log(`获取角色列表失败: ${JSON.stringify(err)}`)
        return err
      }
      // console.log(`获取菜单列表成功: ${docs}`)
      return docs
    }
  )
  // console.log(parentResult)
  console.log("返回数据了吗")
  return parentResult
}

//添加申报内容
const insertProblem = async (data) => {
  console.log(`添加参数: ${JSON.stringify(data)}`)
  const insertObj = await new Problem(data).save()
  return insertObj
}

//删除申报内容
const deleteProblem = async (data) => {
  console.log(`删除参数: ${JSON.stringify(data)}`)
  const res = await Problem.deleteOne(
    {_id: data.id},
    (err, doc) => {
      if(err) {
        console.log(`删除数据库出错:${err}`)
        throw err 
      }
      console.log(`DOC的内容: ${JSON.stringify(doc)}`)
      return doc
    }
  )
  return res
}

//修改申报内容
const updateProblem = async (data) => {
  console.log(`编辑删除参数: ${JSON.stringify(data)}`)
  const updataResult = await Problem.updateOne(
    { _id : data._id},
    { $set: {
      optionTitle: data.optionTitle,
      optionType: data.optionType,
      isRequired: data.isRequired,
      order: data.order,
      sourceList: data.sourceList
    }},
    (err,doc) => {
      console.log(`err: ${JSON.stringify(doc)}`)
      if(err){
        console.log(`err: ${JSON.stringify(err)}`)
        return err
      }
    }
  )
  return updataResult
}

//启用申报内容
const getEnable = async (data) => {
  console.log(`编辑删除参数: ${JSON.stringify(data)}`)
  const updataResult = await Problem.updateOne(
    { _id : data.id},
    { $set: {
      isEnable: data.isEnable
    }},
    (err,doc) => {
      console.log(`err: ${JSON.stringify(doc)}`)
      if(err){
        console.log(`err: ${JSON.stringify(err)}`)
        return err
      }
    }
  )
  return updataResult
}
//3.导出

module.exports = {
  insertFrist,
  login,
  //数据字典
  getRoleDict,
  //用户管理
  getUser,
  insertUser,
  removeUser,
  updateUser,
  //菜单管理
  getAllMenu,
  insertMenu,
  removeMenu,
  updateMenu,
  //角色管理
  getRole,
  insertRole,
  removeRole,
  updateRole,
  allotMenu,
  getRoleMenu,
  getRoleMenuInfo,
  //组织管理
  getInitialDepatment,
  getSubsDepartment,
  insertDepartment,
  removeDepartment,
  updateDepartment,
  getOneDeparment,
  //申报内容管理
  getProblemList,
  insertProblem,
  deleteProblem,
  updateProblem,
  getEnable
}