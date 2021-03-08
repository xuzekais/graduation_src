<template>
  <div>
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-header title="用户管理"></my-header>
    <!-- <header>
      <div class="header-left">
        <div class="header-left-icon" v-if="show">
          </div>
        <div class="header-title" style="font-size: 18px;color: #303133;">用户管理</div>
      </div>
      
      <el-divider></el-divider>
    </header> -->
    
    <span>用户管理</span>
    <span>对吧!!</span>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'UserManage',
  components:{
    MyHeader
  },
  data() {
    return {
      
        
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
  
</style>