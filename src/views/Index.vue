<template>

  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Menu mode="horizontal" theme="dark">
          <div class="layout-logo">
            <span>BytesDooIT</span>
          </div>

          <div class="layout-nav">
            <MenuItem name="post">
              <Icon type="ios-heart"/>
              好文
            </MenuItem>
            <MenuItem name="video">
              <Icon type="logo-youtube"/>
              好片
            </MenuItem>
            <MenuItem name="live">
              <Icon type="ios-mic"/>
              直播
            </MenuItem>
            <MenuItem name="recruitment">
              <Icon type="ios-megaphone"/>
              招聘
            </MenuItem>
            <MenuItem name="interview">
              <Icon type="md-people"/>
              面试
            </MenuItem>
          </div>

          <div class="layout-nav-right">
            <div v-if="is_login">
              <Dropdown style="margin-left: 20px" @on-click="handleDropDown">
                <Avatar style="color: #f56a00;background-color: #fde3cf" ref="avatar" size="large">
                  {{user_data.username}}
                </Avatar>

                <DropdownMenu slot="list">
                  <DropdownItem name="home">
                    <Icon type="md-person"/>
                    个人中心
                  </DropdownItem>
                  <DropdownItem name="packet">
                    <Icon type="md-briefcase"/>
                    我的口袋
                  </DropdownItem>
                  <DropdownItem divided name="logout">
                    <Icon type="md-log-out"/>
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

      <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
        <Logo style="margin: 0 auto"></Logo>
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
        is_login: false,
        user_data: {}
      };
    },
    methods: {
      /**
       * 检查是否已登录
       */
      check_login() {
        this.$Loading.start();
        this.$axios.get('api/user/session/')
          .then(res => {
            this.$Loading.finish();
            this.is_login = res.data.data.is_login;
            this.user_data = res.data.data;
            this.$Message['info']({
              background: true,
              content: res.data.msg
            });
          })
          .catch(err => {
            console.log(err);
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
            console.log(name);
            break;
          case 'logout':
            this.handleLogOut();
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
      this.check_login();
    },
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
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
    float: right;
    top: 8px;
    left: 20px;
  }

  .layout-footer-center {
    text-align: center;
  }
</style>
