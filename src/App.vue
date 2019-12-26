<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {}
    },
    mounted() {
      this.$axios.post('api/util/csrf_token/')
        .then(res => {
        })
        .catch(err => {
          this.$Message.error('未知错误');
        });

      this.$Message.config({
        top: 100,
        duration: 5,
      });
    }
  }
</script>

<style>
</style>
