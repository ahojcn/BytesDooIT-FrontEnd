<template>
  <div id="app">
    <router-view/>
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
    }
  }
</script>

<style>
</style>
