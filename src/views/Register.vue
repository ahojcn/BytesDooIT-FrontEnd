<!--suppress ALL -->
<template>
  <div class="layout">
    <div class="layout-main animated fadeInDown">
      <Card :style="{opacity: '0.9'}">
        <div slot="title" class="layout-logo">
          <a>
            <span>注册 - BytesDooIT</span>
          </a>
        </div>

        <Form ref="reg_form" :model="reg_form" :rules="rule_reg">

          <Row :gutter="16">
            <Col span="12">
              <FormItem prop="email">
                <Input size="large" type="text" v-model="reg_form.email" placeholder="邮箱">
                  <Icon type="ios-mail-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="username">
                <Input size="large" type="text" v-model="reg_form.username" placeholder="用户名">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input size="large" type="password" v-model="reg_form.password" placeholder="密码">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="c_password">
                <Input size="large" type="password" v-model="reg_form.c_password" placeholder="确认密码">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="verify_code">
                <Row :gutter="2">
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
              <Formitem>
                <Radio v-model="reg_form.is_agree">我已阅读并同意用户协议</Radio>
              </Formitem>
            </Col>
            <Col span="12">
              <Steps :current="0" direction="vertical">
                <Step title="注册"></Step>
                <Step title="验证邮箱"></Step>
              </Steps>

              <FormItem>
                <Button size="large" long type="primary" @click="handleRegister()">
                  注册
                </Button>
                <Button size="large" long type="text" to="/Login">
                  已有账号？去登录
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
  import {register} from '@/api/user';
  import {verify_code_img} from '@/api/util';
  import Logo from '@/components/Logo';

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
          this.$Message.error({background: true, content: '请先阅读并同意用户协议'});
          return;
        }

        this.$refs.reg_form.validate((valid) => {
          if (valid) {
            this.$Loading.start();
            register({
              username: this.reg_form.username,
              email: this.reg_form.email,
              pwd: this.reg_form.password,
              c_pwd: this.reg_form.c_password,
              verify_code: this.reg_form.verify_code,
              is_agree: this.reg_form.is_agree
            }).then(res => {
              this.$Loading.finish();
              if (res.status_code === 0) {
                this.$Message.success({background: true, content: res.msg});
                this.$router.push('/');
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error({background: true, content: '请完善信息'});
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
    text-align: center;
    width: 500px;
    font-size: 30px;
    font-weight: 700
  }

  .layout-main {
    margin: 0 auto;
    width: 500px;
    margin-top: 100px;
  }
</style>
