<template>
  <div class="layout">

    <div v-if="init_flag" class="layout-main animated zoomIn">
      <Logo style="width: 500px; padding-left: 50px"></Logo>

      <Card>
        <p slot="title">登录</p>

        <Form ref="login_form" :model="login_form">
          <FormItem prop="user">
            <Input type="text" v-model="login_form.username" placeholder="用户名">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="login_form.password" placeholder="密码">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button size="large" long type="primary" @click="handleLogin()">登录</Button>
            <!-- TODO 使用邮箱登录-->
            <Button size="large" long type="text" disabled>使用邮箱登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>

  </div>
</template>

<script>
  import Logo from '@/components/Logo'

  export default {
    name: "Login",
    components: {Logo},
    data() {
      return {
        init_flag: false,

        login_form: {
          username: '',
          password: ''
        },
      }
    },
    methods: {
      /**
       * 登录处理
       */
      handleLogin() {
        this.$Loading.start();

        if (this.login_form.username === '' || this.login_form.password === '' || this.login_form.password.length < 6) {
          this.$Message.error({
            background: true,
            content: '请输入正确的用户名和密码',
            duration: 5
          });
          this.$Loading.error();
          return
        }

        this.$axios.post('api/user/session/', {
          is_username: true,
          username: this.login_form.username,
          pwd: this.login_form.password,
          local_time: Date.parse(Date())/1000,
        }).then(res => {
          if (res.data.status_code === 0) {
            this.$Loading.finish();
            this.$Message.success({
              background: true,
              content: '欢迎回来, ' + res.data.data.username,
              duration: 10
            });
          } else {
            this.$Loading.error();
            this.$Message.error({
              background: true,
              content: res.data.msg,
              duration: 10
            });
          }
        }, err => {
          this.$Loading.error();
          console.log(err)
        });
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
