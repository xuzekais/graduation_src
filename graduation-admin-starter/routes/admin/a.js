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
  // console.log(`接口传递的添加组织数据: ${JSON.stringify(data)}`);
  const insertObj = await new Department(data)

  await insertObj.save()//保存到数据库里
    .then( async res => {
      // console.log( `保存到数据库的信息: ${res}` )

      //这里处理企业微信需要的数据
      let  wxData  = {
        id: res.departmentId, //企业微信部门ID
        name: res.departmentName,//企业微信部门中文名
        order: res.order,//企业微信部门排序值
        parentid: res.parentId//企业微信父级部门ID
      }
      // console.log(`传递数据:${JSON.stringify(wxData)}`)

      // 这里调用企业微信第三方接口同步信息
      // access_token目前是写死的,还没做缓存
      // let url = clientBaseUrl + '/user/get?access_token=' + access_token

      //第三方接口请求配置
      // let options = {
      //   //请求方法
      //   methods: 'POST',
      //   //请求路径
      //   uri: clientBaseUrl + '/department/createte',
      //   //请求参数
      //   qs:{
      //     access_token: access_token,
      //   },
      //   //请求数据类型
      //   json: true,
      //   //请求头设置
      //   headers:{
      //     "content-type": "application/json",
      //     'User-Agent': 'Request-Promise'
      //   },
      //   //请求体
      //   body: JSON.stringify(wxData)
      // }
      await request(options)
        .then( (wxError, wxRespone ,wxBody) => {
          if(wxError){ 
            console.log(`请求是否出错: ${JSON.stringify(wxError)}`)
            return error
          }
          console.log(`wxRespone: ${JSON.stringify(wxRespone)}`)
          
          return wxRespone
          console.log(`wxBody: ${wxBody}`)
        })
        .catch( (wxErr) => {
          console.log(JSON.stringify(wxErr))
          return {msg: "请求企业微信接口出错", err : JSON.stringify(wxErr)}
        })
        
      console.log(wxResult)
      //返回创建好的数据
      // return wxResult
    })
    // .catch(err => {
    //   if(err){
    //     return {msg: " 保存到本地数据库出错 ",err: JSON.stringify(err) }
    //    }
    // })
  // return JSON.stringify(result)
}
