<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-active="$route.path">
        <el-submenu v-for="(item,index) in menuData" :key="item._id" :index="index">
          <template slot="title">
            <i class="el-icon-message"></i>{{item.menuName}}
          </template>
          <el-menu-item-group v-for="cItem in item.children" :key="cItem._id">
            <el-menu-item :index="cItem.menuPath">{{cItem.menuName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>内容管理
          </template>
          <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">文章评论</template>
            <el-menu-item index="/comments/list">评论列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">友链</template>
            <el-menu-item index="/links/create">新建友链</el-menu-item>
            <el-menu-item index="/links/list">友链列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">留言</template>
            <el-menu-item index="/messages/list">留言列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">留言评论用户</template>
            <el-menu-item index="/users/list">留言评论用户列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
        <!-- <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message"></i>健康上报
          </template>
          <el-menu-item-group>
            <template slot="title">全体人员</template>
            <el-menu-item index="/healthReport/reportProblem">上报问题明细</el-menu-item>
            <el-menu-item index="/healthReport/reportRecord">上报记录</el-menu-item>
            <el-menu-item index="/healthReport/infoNotice">消息通知</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-message"></i>权限管理
          </template>
          <el-menu-item-group>
            <template slot="title">全体人员</template>
            <el-menu-item index="/authorityManage/userManage">用户管理</el-menu-item>
            <el-menu-item index="/authorityManage/organizeManage">组织管理</el-menu-item>
            <el-menu-item index="/authorityManage/roleManage">角色管理</el-menu-item>
            <el-menu-item index="/authorityManage/menuManage">菜单管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
        <!-- <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>系统设置
          </template>
          <el-menu-item-group>
            <template slot="title">管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <span>{{userName}}</span>
        <el-dropdown>
          <i class="el-icon-setting" style="margin-left: 10px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a @click="logout">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main style="margin:20px; background-color:#fff">
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #69a8e7;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-main{
  padding: 0;
}
.el-container .el-container{
  background: #eee;
}
</style>

<script>
export default {
  data() {
    return {
      userName: "",
      roleId: "",
      menuData:[],
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    async init(){
      this.userName = localStorage.getItem("userName") || "";
      this.roleId = localStorage.getItem("roleId") || "";
      console.log(this.roleId )
      if(this.roleId){
        const res = await this.$http.get("getRoleMenuInfo?id=" + this.roleId)
        console.log(`当前角色可使用的菜单:${JSON.stringify(res)}`)
        this.menuData = res.data.data
        console.log(this.menuData)
      }
    }
  },
  created() {
    console.log("登录成功")
    this.init()
  },
  // mounted(){
  //   console.log("登录成功")

  // }
};
</script>
