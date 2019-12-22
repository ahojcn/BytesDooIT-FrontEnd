<template>
  <div>
    <Input size="large" style="width: 25%">
      <span slot="prepend">标题：</span>
    </Input>
    <br>
    <Input size="large" style="width: 25%">
      <span slot="prepend">标签：</span>
      <span slot="append">
        <Button type="primary" icon="md-add" style="color: red">添加</Button>
      </span>
    </Input>
    <Divider></Divider>

    <mavon-editor
      v-model="content"
      ref="md"
      style="height: 100%">
    </mavon-editor>
  </div>
</template>

<script>
  export default {
    name: "NewPost",
    data() {
      return {
        content: '',
      }
    },
    methods: {
    },
    created() {
    },
  }
</script>

<style scoped>

</style>
