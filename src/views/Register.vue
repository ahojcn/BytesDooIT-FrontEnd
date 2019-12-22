<template>
  <div class="layout">

    <div v-if="init_flag" class="layout-main animated fadeIn">
      <Logo style="width: 500px;"></Logo>

      <Card>
        <p slot="title">注册</p>

        <Form ref="reg_form" :model="reg_form" :rules="rule_reg">

          <Row :gutter="16">
            <Col span="12">
              <FormItem prop="email">
                <Input type="text" v-model="reg_form.email" placeholder="邮箱">
                  <Icon type="ios-mail-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="username">
                <Input type="text" v-model="reg_form.username" placeholder="用户名">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="reg_form.password" placeholder="密码">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="c_password">
                <Input type="password" v-model="reg_form.c_password" placeholder="确认密码">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="verify_code">
                <Row :gutter="16">
                  <Col span="12">
                    <Input v-model="reg_form.verify_code" placeholder="验证码">
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
              <Radio v-model="reg_form.is_agree">我已阅读并同意用户协议。</Radio>
              <FormItem>
                <Button size="large" long type="primary" @click="handleRegister()">
                  <Icon type="md-checkmark"></Icon>
                  注册
                </Button>
              </FormItem>

              <Steps :current="0" direction="vertical">
                <Step title="注册"></Step>
                <Step title="验证邮箱"></Step>
              </Steps>
            </Col>
          </Row>

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
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.reg_form.c_password !== '') {
            this.$refs.reg_form.validateField('c_password')
          }
          callback();
        }
      };
      const validateCPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码'));
        } else if (value !== this.reg_form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (value.length < 4) {
          callback(new Error('用户名太短'));
        } else {
          callback();
        }
      };
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };

      return {
        init_flag: false,
        is_login: false,

        reg_form: {
          username: '',
          email: '',
          password: '',
          c_password: '',
          verify_code: '',
          is_agree: false,
        },
        rule_reg: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '格式不正确', trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          c_password: [
            {validator: validateCPassword, trigger: 'blur'}
          ],
          verify_code: [
            {validator: validateCode, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      /**
       * 注册按钮点击事件
       */
      handleRegister() {
        if (this.reg_form.is_agree === false) {
          this.$Message.error('请先阅读并同意用户协议');
          return;
        }
        this.$refs.reg_form.validate((valid) => {
          if (valid) {
            this.$axios.post('api/user/', {
              username: this.reg_form.username,
              email: this.reg_form.email,
              pwd: this.reg_form.password,
              c_pwd: this.reg_form.c_password,
              verify_code: this.reg_form.verify_code,
              is_agree: this.reg_form.is_agree
            }).then(res => {
              console.log(res);
              if (res.data.status_code === 0) {
                this.$Message.success(res.data.msg);
                this.$router.push('/');
              } else {
                this.$Message.error(res.data.msg);
              }
            }).catch(err => {
              this.$Message.error('电波无法到达');
            })
          } else {
            this.$Message.error('请完善信息');
          }
        })
      },
      /**
       * 获取图片验证码
       */
      getVerifyCodeImg() {
        this.$Loading.start();
        this.$axios.get('api/util/verify_code_img/', {responseType: 'blob'})
          .then(res => {
            this.$Loading.finish();
            this.$refs.verify_code_img.src = window.URL.createObjectURL(res.data);
          })
          .catch(err => {
            this.$Loading.error();
            console.log(err)
          });
      },
    },
    created() {
      this.init_flag = true;
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

    background: #74ebd5; /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #ACB6E5, #74ebd5); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #ACB6E5, #74ebd5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .layout-main {
    margin: 0 auto;
    width: 500px;
    margin-top: 100px;
    /*opacity: 90%;*/
  }
</style>
