module.exports = (app) => {
  const express = require("express");
  const assert = require("http-assert");
  const jwt = require("jsonwebtoken");
  const service = require('../../service/admin/index')
  const AdminUser = require("../../models/AdminUser");
  const sendEmail = require("../../plugins/sendEmail.js");
  const rq = require("request-promise")
  const request =require("request")
  const router = express.Router({
    mergeParams: true,
  });
  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true,
    });
  });
  router.get("/", async (req, res) => {
    const queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = "parent";
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(100);
    res.send(items);
  });
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });

  //登录校验中间件
  // const authMiddleware = require("../../middleware/auth");

  //资源中间件
  const resourceMiddleware = require("../../middleware/resource");

  //资源路由
  app.use(
    "/admin/api/rest/:resource",
    // authMiddleware(),
    resourceMiddleware(),
    router
  );
  //项目初始化接口
  app.post("/frist",async (req ,res) =>{
    let data  = await service.insertFrist(req.body)
    console.log(`data:${data}`)
    res.json( {code:200 ,msg:"初始化数据库成功", data })
  })
   // requset({
    //   url: 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=' + tokens +'&userid=XuZeKai',
    //   method:'GET'
    // },function (err,response,body) {
    //   // console.log(err)
    //   // console.log(response)
    //   console.log(body)
    // })
  app.post("/admin/api/testpost",async(req,res) => {
    let data = req.body
    console.log(`${data}`)
    res.json({code:200,msg:"1111",data})
  })
  //添加组织
  app.post("/admin/api/addDepatment", async (req, res) => {

    console.log(`req.body: ${Object.prototype.toString.call(req.body) }`)
    // res.json({code:200,msg:"111",data})
    const tokens = `TzHMB5IyrapKxmcbhmBCOVFVIXNR5LAfFiC7i24pVCgVB1Oo3i227107LC-G5pcqiLF_JWPzyltcjAVvYj3qXkSc5tKNTWW3Qy9QEXVHE78yf-X8HYOzDMX3KiJwfu1CPmx4UiyoXrrwjyUJspBdLkxA4VFzr2z8nbhqNR8V6r7R0YcPNoTlNEf1pNFk-NbfxU51JI3NcuAjFQ4-jKsGCQ`
    // console.log(requset);
    let  wxData  = {
      name: "二54555门",//企业微信部门中文名
      parentid: "1",//企业微信父级部门ID
      id: "10"//企业微信部门ID
      // order: res.order,//企业微信部门排序值
    }
    console.log(wxData)
    // request({
    //   url: "https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=" +tokens,
    //   method: "POST",
    //   json: true,
    //   headers: {
    //       "content-type": "application/json",
    //   },
    //   body: wxData
    // }, function(error, response, body) {
    //   console.log(JSON.stringify(error))
    //   console.log(`${JSON.stringify(response)}`)
    //   console.log(`res:${JSON.stringify(body)}`)
    // }); 
    
    // rq({
    //   methods: "POST",
      
    //   uri: "https://qyapi.weixin.qq.com/cgi-bin/department/create",
    //   qs:{
    //     access_token: `psFqC1rcLp5hJ_VkUSPNsZMMCtkYAB6z_odAyLHefWaMj1fGI3wlcTk-m1cHzIMHMv-CBc-LEYxcme0HirDTBSCP_crNlUrg_fdn-JekOpmZ2FWwp8J87dJP4dVSQPlK_b-vSVBfLSf7qWTiraOe8uqMDA_oXU6wS43UR1CqLeiBb8BoQ6-MndWL40rKBQzluAJx3NfFCw8ugGVy4ZZtVQ`
    //   },
    //   json:true,
    //   // headers:{
    //   //   // 'User-Agent': 'Request-Promise',
    //   //   // "content-type": "application/json;charset=utf-8"
    //   // },
    //   body:req.body
    // }).then( res => {
    //   console.log(`请求返回 数据::${JSON.stringify(res)}`)
    // })

    let data = await service.insertDepartment(req.body)
    console.log(`添加组织成功后返回数据:${Object.prototype.toString.call(data) }`)
    res.json( {code:200,msg:"添加部门成功"})
  })
    
  //图片上传
  const multer = require("multer");
  const MAO = require("multer-aliyun-oss");
  const upload = multer({
    storage: MAO({
      config: {
        region: "oss-cn-shenzhen", // // 阿里云oss的所在区域
        accessKeyId: "your accessKeyId", // 阿里云oss的accessKeyId，要自己去创建
        accessKeySecret: "your accessKeySecret", // 阿里云oss的accessKeySecret
        bucket: "miqilin-blog", // 阿里云oss的bucket's name
      },
    }),
  });
  app.post(
    "/admin/api/upload",
    // authMiddleware(),
    upload.single("file"),
    async (req, res) => {
      const file = req.file;
      // file.url = `http://miqilin21.cn/uploads/${file.filename}`;
      res.send(file);
    }
  );

  //第一次登录把注册注释取消
  // app.post("/admin/api/register", async (req, res) => {
  //   const user = await AdminUser.create({
  //     username: req.body.username,
  //     password: req.body.password
  //   });
  //   res.send(user)
  // })

  //登录
  app.post("/admin/api/login", async (req, res) => {
    const {
      username,
      password
    } = req.body;
    console.log(req.body);
    
    const user = await AdminUser.findOne({
      username,
    }).select("+password");
    assert(user, 422, "用户不存在");
    const isValid = require("bcryptjs").compareSync(password, user.password);
    assert(isValid, 422, "密码错误");
    const token = jwt.sign({
        id: user._id,
      },
      app.get("secret")
    );
    res.send({
      token,
      username,
    });
  });

  app.post("/admin/api/email", async (req, res) => {
    console.log(req.body);
    sendEmail(req.body);
    res.send({
      ok: "ok",
    });
  });

  //错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message,
    });
  });


};