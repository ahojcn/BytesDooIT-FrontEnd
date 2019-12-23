<template>

  <div class="layout">
    <!--  返回顶部按钮  -->
    <BackTop :height="100" :bottom="200" @on-click="handleBack2Top">
      <div class="back2top">返回顶端</div>
    </BackTop>

    <Layout>
      <Header :style="{position: 'fixed', width: '100%', zIndex: '99999', opacity: '0.9'}">
        <Menu mode="horizontal" theme="dark" active-name="post">
          <div class="layout-logo">
            <span style="color: orange" @click="handleLogoClick">BytesDooIT</span>
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
              <Icon type="ios-mic" color="#fff"></Icon>
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

          <div class="layout-nav-right">
            <div v-if="is_login">
              <Dropdown style="margin-left: 20px" @on-click="handleDropDown">
                <Avatar class="user-avatar" ref="avatar" size="large">
                  {{user_data.username}}
                </Avatar>

                <DropdownMenu slot="list">
                  <DropdownItem name="new_post">
                    <Icon type="ios-add-circle" color="orange"></Icon>
                    发布文章
                  </DropdownItem>
                  <DropdownItem>
                    <Icon type="ios-cloud-upload" color="#00CC99"></Icon>
                    视频投稿
                  </DropdownItem>

                  <DropdownItem divided name="home">
                    <Icon type="md-person"></Icon>
                    个人中心
                  </DropdownItem>
                  <DropdownItem name="packet">
                    <Icon type="md-briefcase"></Icon>
                    我的口袋
                  </DropdownItem>

                  <DropdownItem divided name="logout">
                    <Icon type="md-log-out"></Icon>
                    退出
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

            </div>

            <div v-if="!is_login">
              <Button ghost type="text" to="/Login">登录</Button>
              <Button ghost type="warning" to="/Register">注册</Button>
            </div>
          </div>

        </Menu>
      </Header>

      <Content :style="{margin: '88px 20px 0', minHeight: '1000px'}">
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
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #515a6e;
    border-radius: 3px;
    float: left;
    top: 8px;
    left: 20px;

    color: #fff;
    font-size: 30px
  }

  .layout-nav {
    width: 500px;
    margin: 0 auto;
  }

  .layout-nav-right {
    background: #515a6e;
    border-radius: 3px;
    top: 8px;
    left: 20px;
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
</style>
