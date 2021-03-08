<template>
  <div>
    <div class="header-left">
      <div class="header-left-icon" v-if="isShowing" @click="goBack"></div>
      <div class="header-title">{{title}}</div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  props: {
    isShowing:{
      type: Boolean,
      default: false
    },
    title: {
      type: String
    }
  },
  data() {
    return {

    }
  },
  methods:{
    goBack(){
      this.$emit("goBack")
    }
  }
}
</script>

<style lang="scss">
  .header-left{
    display: flex;
    line-height: 42px;
    padding: 0px 10px 5px 10px;
  }
  .header-left .header-left-icon::before{
    content:'<';
    width: 16px;
    height: 16px;
  }
  .header-left .header-left-icon{
    float: left;
    margin-left: 5px;
    cursor: pointer;
  }
  .header-left .header-title{
    float: left;
    margin-left: 5px;
    font-size: 18px;
    color: #303133;
    cursor: default;
  }
  .el-divider{
    margin:0;
  }
</style>