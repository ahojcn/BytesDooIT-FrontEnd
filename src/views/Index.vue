<template>

  <div class="layout">
    <!--  返回顶部按钮  -->
    <BackTop :height="100" :bottom="200" :style="{zIndex: '99999'}" @on-click="handleBack2Top">
      <div class="back2top">返回顶端</div>
    </BackTop>

    <Layout>
      <Header class="layout-header-bar">
        <Menu mode="horizontal" active-name="post" @on-select="handleDropDown">
          <div class="layout-logo">
            <img class="layout-logo" src="../assets/logo.png" @click="handleLogoClick"/>
<!--            <span style="color: orange" @click="handleLogoClick">BytesDooIT</span>-->
          </div>

          <div class="layout-nav">
            <MenuItem name="post" to="Post">
              <Icon type="ios-heart" color="pink"></Icon>
              好文
            </MenuItem>
            <MenuItem name="video" to="Video">
              <Icon type="logo-youtube" color="orange"></Icon>
              好片
            </MenuItem>
            <MenuItem name="live" to="Live">
              <Icon type="ios-mic" color="#aaaaaa"></Icon>
              直播
            </MenuItem>
            <MenuItem name="recruitment" to="Recruitment">
              <Icon type="ios-megaphone" color="#00FF99"></Icon>
              招聘
            </MenuItem>
            <MenuItem name="interview" to="Interview">
              <Icon type="md-people" color="#00CCFF"></Icon>
              面试
            </MenuItem>
          </div>
          <Submenu v-if="is_login" name="3">
            <template slot="title">
              <Avatar class="user-avatar" ref="avatar" size="large">
                {{user_data.username}}
              </Avatar>
            </template>
            <MenuItem name="home">
              <Icon type="md-person"></Icon>
              个人中心
            </MenuItem>
            <MenuGroup title="好文">
              <MenuItem name="new_post">
                <Icon type="ios-add-circle" color="orange"></Icon>
                发布文章
              </MenuItem>
              <MenuItem name="3-2" disabled>
                <Icon type="ios-add-circle"></Icon>
                文章管理
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="好片">
              <MenuItem name="3-3" disabled>
                <Icon type="ios-cloud-upload" color="#00CC99"></Icon>
                视频投稿
              </MenuItem>
              <MenuItem name="3-5" disabled>
                <Icon type="ios-cloud-upload"></Icon>
                投稿管理
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="其他">
              <MenuItem name="logout">
                <Icon type="md-log-out"></Icon>
                退出
              </MenuItem>
            </MenuGroup>
          </Submenu>

          <div class="layout-nav-right" v-if="!is_login">
            <Button ghost type="warning" to="/Login">登录</Button>
            <Button type="warning" to="/Register">注册</Button>
          </div>
        </Menu>
      </Header>

      <Content :style="{margin: '88px 20px 0', flex: '1'}">
        <transition enter-active-class="fadeIn" mode="out-in" translate="yes" leave-active-class="fadeOut">
          <router-view v-if="init_flag" class="animated"></router-view>
        </transition>
      </Content>

      <Footer class="layout-footer-center">2019 &copy; BytesDooIT</Footer>

    </Layout>
  </div>

</template>

<script>
  import Logo from '@/components/Logo'

  export default {
    name: "Index",
    components: {
      Logo
    },
    data() {
      return {
        init_flag: false,
        is_login: false,
        user_data: {}
      };
    },
    methods: {
      handleLogoClick() {
        this.$router.go(0);
      },

      /**
       * 点击返回顶部按钮
       */
      handleBack2Top() {
        this.$Message.success({
          background: true,
          content: '欢迎回来~'
        })
      },
      /**
       * 检查是否已登录
       */
      check_login() {
        this.$Loading.start();
        this.$axios.get('api/user/session/')
          .then(res => {
            this.$Loading.finish();
            this.is_login = res.data.data.is_login;
            if (this.is_login === true) {
              this.user_data = res.data.data;
              if (this.user_data.is_active === false) {
                this.$Message.error({background: true, content: '请查收邮件并激活账号'})
              }
            }
          })
          .catch(err => {
            // console.log(err);
            this.$Loading.error();
            this.$Message['error']({
              background: true,
              content: '电波无法到达'
            });
          });
      },
      /**
       * 处理头像下拉菜单选择
       */
      handleDropDown(name) {
        console.log(name);
        switch (name) {
          case 'home':
            this.$router.push('/Home');
            break;
          case 'logout':
            this.handleLogOut();
            break;
          case 'new_post':
            if (this.is_login === true && this.user_data.is_active === true) {
              this.$router.push('/NewPost');
            } else {
              this.$Message.error({
                background: true,
                content: '账号未激活'
              })
            }
            break;
        }
      },
      /**
       * 处理退出登录
       */
      handleLogOut() {
        this.$Loading.start();
        console.log(1);
        this.$axios.delete('api/user/session/')
          .then(res => {
            this.$Loading.finish();
            this.$router.go(0);
          })
          .catch(err => {
            this.$Loading.error();
            this.$Message['error']({
              background: true,
              content: '电波无法到达'
            });
          });
      },
    },
    created() {
      this.init_flag = true;
      this.check_login();
    },
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: scroll;

    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .layout-logo {
    width: 200px;
    float: left;
    padding-top: 3px;

    color: #fff;
    font-size: 30px
  }

  .layout-nav {
    width: 500px;
    margin: 0 auto;
  }

  .layout-nav-right {
    border-radius: 3px;
    top: 8px;
    float: right;
  }

  .layout-footer-center {
    text-align: center;
  }

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf;
  }

  .back2top {
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }

  .layout-header-bar{
    /*position: 'fixed', width: '100%', zIndex: '99999'}*/
    background: #fff;
    box-shadow: 0 2px 2px rgba(0,0,0,.1);
    position: fixed;
    width: 100%;
    z-index: 9999;
    opacity: 90%;
  }
</style>
