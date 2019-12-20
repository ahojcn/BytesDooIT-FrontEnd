<template>

  <div class="layout">

    <div v-if="init_flag" class="layout-main animated zoomIn zoomOut">
      <Logo style="width: 500px; padding-left: 50px"></Logo>

      <Card>
        <p slot="title">注册</p>

        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.username" placeholder="用户名">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="密码">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Radio>我已阅读并同意用户协议</Radio>

            <Button size="large" long type="primary" @click="handleSubmit('formInline')">注册</Button>
          </FormItem>
        </Form>
      </Card>
    </div>

  </div>
</template>

<script>
  import Logo from '@/components/Logo'

  export default {
    name: "Register",
    components: {Logo},
    data() {
      return {
        init_flag: false,

        login_form: {
          username: '',
          password: ''
        },
        rule_login_form: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码不得小于6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
    },
    created() {
      this.init_flag = true;
    },
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
  }

  .layout {
    width: 100%;
    height: 100%;
    position: absolute;

    background: #74ebd5; /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #ACB6E5, #74ebd5); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .layout-main {
    margin: 0 auto;
    width: 30%;
    margin-top: 10%;
    /*opacity: 90%;*/
  }
</style>
