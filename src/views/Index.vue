<template>

  <div class="layout">
    <!--  返回顶部按钮  -->
    <BackTop :height="100" :bottom="100" :style="{zIndex: '99999'}" @on-click="handleBack2Top">
      <div ref="rocket" class="rocket-con" @mouseout="rocketStop" @mouseover="rocketFly"></div>
    </BackTop>

    <Layout class="card-background">
      <!--      <Header class="layout-header-bar">-->
      <Menu theme="primary" class="layout-nav-menu" mode="horizontal" active-name="post" @on-select="handleDropDown">
        <div class="layout-logo">
          <a>
            <span style="color: orange" @click="handleLogoClick">BytesDooIT</span>
          </a>
        </div>

        <div class="layout-nav">
          <MenuItem name="post" to="/Post">
            <Icon type="ios-heart" color="pink"></Icon>
            好文
          </MenuItem>
          <MenuItem name="video" to="/Video">
            <Icon type="logo-youtube" color="orange"></Icon>
            好片
          </MenuItem>
          <MenuItem name="live" to="/Live">
            <Icon type="ios-microphone"></Icon>
            直播
          </MenuItem>
          <MenuItem name="recruitment" to="/Recruitment">
            <Icon type="ios-megaphone" color="#00FF99"></Icon>
            招聘
          </MenuItem>
          <MenuItem name="interview" to="/Interview">
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
          <MenuItem name="new_post">
            <Icon type="md-add-circle" color="orange"></Icon>
            发布文章
          </MenuItem>
          <MenuItem name="3-3" disabled>
            <Icon type="ios-cloud-upload"></Icon>
            视频投稿
          </MenuItem>
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
      <!--      </Header>-->

      <Content class="layout-content">
        <transition mode="out-in"
                    enter-active-class="animated fadeInDown"
                    leave-active-class="animated fadeOutDown">
          <router-view></router-view>
        </transition>
      </Content>

      <Footer class="layout-footer-center">2019 &copy; BytesDooIT</Footer>

    </Layout>
  </div>

</template>

<script>
  import {getUserInfo, logout} from '@/api/user';
  import Logo from '@/components/Logo';

  export default {
    name: "Index",
    components: {
      Logo
    },
    data() {
      return {
        is_login: false,
        user_data: {}
      };
    },
    methods: {
      handleLogoClick() {
        this.$router.go(0);
      },

      // 鼠标移动到火箭上时
      rocketFly() {
        this.$refs.rocket.classList.add('fly');
      },
      // 鼠标从火箭上移开时
      rocketStop() {
        this.$refs.rocket.classList.remove('fly');
      },
      // 点击返回顶部按钮
      handleBack2Top() {
        this.$Message.success({background: true, content: '欢迎回来~'});
      },
      // 处理头像下拉菜单选择
      handleDropDown(name) {
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
              this.$Message.error({background: true, content: '账号未激活'});
            }
            break;
        }
      },
      // 处理退出登录
      handleLogOut() {
        this.$Loading.start();
        logout().then(res => {
          this.$Loading.finish();
          this.$router.go(0);
        });

      },
    },

    created() {
      this.$Loading.start();
      getUserInfo().then(res => {
        this.$Loading.finish();
        this.is_login = res.data.is_login;
        if (this.is_login === true) {
          this.user_data = res.data;
          if (this.user_data.is_active === false) {
            this.$Message.error({background: true, content: '请查收邮件并激活账号'})
          }
        }
      });

      this.$axios.get('api/user/test/').then(res => {
        console.log(res)
      });

    },
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
  }

  .card-background {
    font-weight: 700;
    background-image: url('../assets/navbk.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }

  .layout {
    border-top: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: scroll;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .layout-content {
    /*{margin: '88px 20px 0', flex: '1', opacity: '0.93'}*/
    margin: 88px 20px 0;
    flex: 1;
    opacity: 0.85;
  }

  .layout-logo {
    width: 200px;
    float: left;
    /*padding-top: 3px;*/
    padding-left: 5%;

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
    padding-right: 80px;
    float: right;
  }

  .layout-footer-center {
    text-align: center;
    font-weight: 700;
    color: #ffffff;
    background-image: url('../assets/navbk.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf;
  }

  /*.back2top {*/
  /*  padding: 10px;*/
  /*  border-radius: 2px;*/
  /*}*/

  .rocket-con {
    position: fixed;
    background: url(../assets/rocket_top.png);
    width: 150px;
    height: 175px;
    cursor: pointer;
    z-index: 99;
    bottom: 50px;
    left: 50%;
    margin-left: 400px
  }

  .fly {
    animation: fly .4s steps(1) infinite;
    background-image: url(../assets/rocket_frame.png)
  }

  @keyframes fly {
    0% {
      background-position-x: 0
    }
    25% {
      background-position-x: -150px
    }
    50% {
      background-position-x: -300px
    }
    75% {
      background-position-x: -450px
    }
    to {
      background-position-x: -600px
    }
  }

  .layout-nav-menu {
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, .1);*/
    box-shadow: 0 1px 30px;
    position: fixed;
    width: 100%;
    z-index: 9999;
    /*opacity: 90%;*/
    background-image: url('../assets/navbk.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }
</style>
