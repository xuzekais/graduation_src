<template>
  <div>
    <my-header title="消息通知"></my-header>

    <h2>我是消息通知,嘿嘿嘿</h2>
    <span>对吧!!</span>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'InfoNotice',
  components:{
    MyHeader
  },
  data() {
    return {
      model: {}
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>