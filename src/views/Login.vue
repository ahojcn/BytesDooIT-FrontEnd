<!--suppress ALL -->
<template>
  <div class="layout">
    <div class="layout-main animated fadeInUp">
      <Card :style="{opacity: '0.9'}">
        <div slot="title" class="layout-logo">
          <a>
            <span>登录 - BytesDooIT</span>
          </a>
        </div>

        <Form ref="login_form" :model="login_form" :rules="rule_login">

          <Row :gutter="16">
            <Col span="12">
              <FormItem prop="username">
                <Input size="large" type="text" v-model="login_form.username" placeholder="用户名">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input size="large" type="password" v-model="login_form.password" placeholder="密码">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="verify_code">
                <Row :gutter="2">
                  <Col span="12">
                    <Input v-model="login_form.verify_code" placeholder="验证码">
                      <Icon type="md-finger-print" slot="prepend"/>
                    </Input>
                  </Col>
                  <Col span="12">
                    <img prop="verify_code_img" ref="verify_code_img" width="100%" @click="getVerifyCodeImg"/>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem>
                <Button size="large" long type="primary" @click="handleLogin">
                  登录
                </Button>

                <Button size="large" long type="text" to="/Register">
                  没有账号？注册一个
                  <Icon type="ios-arrow-forward"></Icon>
                </Button>
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Card>
    </div>

  </div>
</template>

<script>
  import {login, getUserInfo} from '@/api/user';
  import {verify_code_img} from '@/api/util';
  import Logo from '@/components/Logo';

  export default {
    name: "Login",
    components: {Logo},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (value.length < 4) {
          callback(new Error('用户名太短'));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        callback();
      };
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };

      return {
        is_login: false,

        login_form: {
          username: '',
          password: '',
          verify_code: '',
        },
        rule_login: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          verify_code: [
            {validator: validateCode, trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /**
       * 登录按钮点击事件
       */
      handleLogin() {
        this.$refs.login_form.validate((valid) => {
          if (valid) {
            this.$Loading.start();
            login({
              is_username: true,
              username: this.login_form.username,
              pwd: this.login_form.password,
              local_time: Date.parse(Date()) / 1000,
              verify_code: this.login_form.verify_code,
            }).then(res => {
              this.$Loading.finish();
              if (res.status_code === 0) {
                this.$Message.success({background: true, content: '欢迎回来, ' + res.data.username});
                this.$router.push({path: '/'});
              } else {
                this.$Loading.error();
                this.$Message.error({background: true, content: res.msg});
              }

            });
          } else {
            this.$Message.error('请完善信息');
          }
        });
      },
      /**
       * 获取图片验证码
       */
      getVerifyCodeImg() {
        this.$Loading.start();
        verify_code_img().then(res => {
          this.$Loading.finish();
          this.$refs.verify_code_img.src = window.URL.createObjectURL(res);
        });

      },
    },
    created() {
      this.$Loading.start();
      getUserInfo().then(res => {
        this.$Loading.finish();
        this.is_login = res.data.is_login;
        if (this.is_login === true) {
          this.$router.push({path: '/'})
        }

      });

      this.getVerifyCodeImg();
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

    background-image: url('../assets/homebk2.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }

  .layout-logo {
    width: 500px;
    font-size: 30px;
    font-weight: 700;
    text-align: center;
  }

  .layout-main {
    margin: 0 auto;
    width: 500px;
    margin-top: 10%;
    /*opacity: 90%;*/
  }

</style>
