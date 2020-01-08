<template>
  <transition>
    <img class="animated fadeIn" src="@/assets/logo.png" @click="handleLogoClick" alt="logo">
  </transition>
</template>

<script>
  export default {
    name: "Logo",
    data() {
      return {
      }
    },
    methods: {
      handleLogoClick() {
        this.$router.push('/');
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
