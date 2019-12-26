<template>
  <div>

    <Card class="user-card" shadow :bordered="false">
      <div slot="title">
        <div style="text-align: center;">
          <div style="display: inline;">
            <Avatar class="user-avatar" ref="avatar" size="large">
              {{user_data.username}}
            </Avatar>
            <span style="color: #fb7299; font-weight: 700">
                    {{user_data.username}}
                  </span>

            <Badge :text="'LV ' + user_data.level" type="info">
                                      <span slot="text">
                                         LV <b>{{user_data.level}}</b>
                                      </span>
            </Badge>
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <div style="display: inline;">
          <Button v-if="!user_data.is_active" @click="handleActive" type="error" size="large">未激活</Button>
        </div>
      </div>

      <div>
        邮箱：{{user_data.email}}<br>
        性别：{{user_data.gender}}<br>
        签名：{{user_data.description}}<br>
        等级：LV {{user_data.level}}<br>
        经验：EXP {{user_data.exp_val}}<br>
        辣条：{{user_data.food_num}} 个<br>
        注册时间：{{new Date(user_data.reg_datetime).toLocaleDateString()}}<br>
        最近登录：{{new Date(user_data.last_login_datetime).toLocaleDateString()}}<br>
      </div>

      <Tabs>
        <TabPane label="文章管理" icon="logo-apple">
          <div>
            111
          </div>
        </TabPane>
        <TabPane label="投稿管理" icon="logo-windows">
          <div>
            标签二的内容
          </div>
        </TabPane>
        <TabPane label="简历管理" icon="logo-tux">
          <div>
            标签三的内容
          </div>
        </TabPane>
        <TabPane label="笔试安排" icon="logo-tux">
          <div>
            标签三的内容
          </div>
        </TabPane>
        <TabPane label="面试安排" icon="logo-tux">
          <div>
            标签三的内容
          </div>
        </TabPane>
      </Tabs>

    </Card>

  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        init_flag: false,
        user_data: {},
        is_login: false,
      }
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
            if (this.is_login === false) {
              this.$router.push('/')
            }
            this.user_data = res.data.data;
          })
          .catch(err => {
            this.$Loading.error();
            this.$Message['error']({
              background: true,
              content: '电波无法到达'
            });
          });
      },
      /**
       * 激活账号点击事件
       */
      handleActive() {
        this.$Loading.start();
        this.$axios.post('api/user/active/')
          .then(res => {
            this.$Loading.finish();
            if (res.data.status_code === 0) {
              this.$Message.success({
                background: true,
                content: res.data.msg
              })
            } else {
              this.$Message.error({
                background: true,
                content: res.data.msg
              })
            }
          })
          .catch(err => {
            this.$Loading.error();
            this.$Loading.error();
            this.$Message['error']({
              background: true,
              content: '电波无法到达'
            });
          })
      },
    },
    mounted() {
      this.check_login();

      // todo
      // console.log(this.$route.query['tab']);
    }
  }
</script>

<style scoped>

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

</style>
