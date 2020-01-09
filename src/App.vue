<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {csrfToken} from '@/api/util';

  export default {
    name: 'App',
    data() {
      return {}
    },
    mounted() {
      csrfToken();

      this.$Notice.config({
        top: 100,
        duration: 3
      });

      this.$Message.config({
        top: 100,
        duration: 3,
      });
    },
    created() {
      window.L2Dwidget.init({
        pluginRootPath: '../static/live2dw/',
        pluginJsPath: '../lib/',
        pluginModelPath: '../live2d-widget-model-wanko/assets/',
        tagMode: false,
        debug: false,
        model: {jsonPath: '../static/live2dw/live2d-widget-model-wanko/assets/wanko.model.json'},
        display: {position: 'left', width: 150, height: 300},
        mobile: {show: true, scale: 0.5},
        log: false,
        dialog: {  // 开启对话框
          enable: true,
          script: {
            // 当接触到角色身体
            'tap body': '汪汪 ~',
            // 当初碰到头部
            'tap face': '好好看，好好学 ~'
          }
        },
      });

      window.L2Dwidget.on('*', (name) => {
      });
    },
  }
</script>

<style>
</style>
