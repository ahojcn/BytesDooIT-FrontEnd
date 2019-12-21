<template>
  <transition>
    <img v-if="init_flag" class="animated fadeIn" src="@/assets/logo.png" @click="handleLogoClick" alt="logo">
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
    methods: {
      handleLogoClick() {
        this.$router.push('/');
      }
    },
    created() {
      this.init_flag = true;
    }
  }
</script>

<style scoped>

</style>
