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
  
  //添加用户
  app.post("/admin/api/addUser", async (req, res) =>{
    let data = await service.insertUser(req.body)
    console.log(`添加用户成功后返回数据:${JSON.stringify(data) }`)
    if(data.code == 0){
      res.json( {code:200,msg:"添加部门成功",data})
    }else{
      console.log(`数据库:${JSON.stringify(data) }`)
      res.json( {code:200,msg:"数据库添加成功",data})
    }
  })

   //添加角色
   app.post("/admin/api/addRole", async (req, res) =>{
    let data = await service.insertRole(req.body)
    console.log(`添加用户成功后返回数据:${JSON.stringify(data) }`)
    if(data.code == 0){
      res.json( {code:200,msg:"添加部门成功",data})
    }else{
      console.log(`数据库:${JSON.stringify(data) }`)
      res.json( {code:200,msg:"数据库添加成功",data})
    }
  })

  //获取初始父级列表
  app.get("/admin/api/getInitialDepatment", async (req, res) => {
    let data = await service.getInitialDepatment(req.query)
    res.json( {code: 200, msg: "获取初始父级部门列表成功", data})
  })

  //获取子组织列表
  app.get("/admin/api/getSubsDepartment", async (req, res) => {
    if(!req.query.id){
      return res.json( {code: 400,msg: "未成功接收参数"})
    }
    let data = await service.getSubsDepartment(req.query)
    res.json( {code: 200, msg: "获取子部门列表成功", data})
  })

  //添加组织
  app.post("/admin/api/addDepatment", async (req, res) => {
    let data = await service.insertDepartment(req.body)
    console.log(`添加组织成功后返回数据:${JSON.stringify(data) }`)
    if(data.code == 0){
      res.json( {code:200,msg:"添加部门成功",data})
    }else{
      console.log(`数据库:${JSON.stringify(data) }`)
      res.json( {code:200,msg:"数据库添加成功",data})
    }
  })
    
  //删除组织
  app.get("/admin/api/deleteDepatment", async (req, res) => {
    let data = await service.removeDepartment(req.query)
    console.log(`返回的最终结果:${req.query}`)
    res.json({code:200,msg:"删除部门成功",data})
  })

  //修改组织
  app.post("/admin/api/updateDepartment", async (req, res) => {
    let data = await service.updateDepartment(req.body)

    res.json({code:200,msg:"更新部门成功",data})
  })

  //获取单个组织信息
  app.get("/admin/api/getOneDeparment", async (req, res) => {
    if(!req.query.id){
      return res.json({code: 400, msg: "未成功接收参数"})

    }
    let data = await service.getOneDeparment(req.query)
    res.json({code: 200, msg: "获取单个部门信息成功" ,data})
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