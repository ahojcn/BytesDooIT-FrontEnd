<template>
  <transition>
    <img v-if="init_flag" class="animated zoomInDown" src="@/assets/logo.png" alt="logo">
<!--    <span v-if="init_flag" class="animated flip" style="color: #fff; font-size: 30px">BytesDooIT</span>-->
  </transition>
</template>

<script>
  export default {
    name: "Logo",
    data() {
      return {
        init_flag: false,
      }
    },
    created() {
      this.init_flag = true;
    }
  }
</script>

<style scoped>

</style>
