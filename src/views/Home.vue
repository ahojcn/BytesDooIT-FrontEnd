<template>
  <div>

    <Affix :offset-top="100">
      <Card class="user-card" shadow :bordered="false">
        <div slot="title">
          <Avatar size="large" class="user-avatar">{{user_data.username}}</Avatar>
          <span><b>{{user_data.username}}</b></span>

          <Poptip style="float: right" v-if="!user_data.is_active" trigger="hover" placement="right">
            <div slot="content">
              <Steps :current="1" direction="vertical" status="error">
                <Step title="注册"></Step>
                <Step title="验证邮箱"></Step>
              </Steps>
            </div>
            <Button type="error" @click="handleActive">激活账号</Button>
          </Poptip>
        </div>

        邮箱：{{user_data.email}}<br>
        性别：{{user_data.gender}}<br>
        签名：{{user_data.description}}<br>
        等级：LV {{user_data.level}}<br>
        经验：EXP {{user_data.exp_val}}<br>
        辣条：{{user_data.food_num}} 个<br>
        注册时间：{{new Date(user_data.reg_datetime).toLocaleDateString()}}<br>
        最近登录：{{new Date(user_data.last_login_datetime).toLocaleDateString()}}<br>

        <Circle
          :size="250"
          :trail-width="4"
          :stroke-width="5"
          :percent="75"
          stroke-linecap="square"
          stroke-color="#43a3fb">
          <div class="demo-Circle-custom">
            <h1>42,001,776</h1>
            <p>消费人群规模</p>
            <span>
                总占人数
                <i>75%</i>
            </span>
          </div>
        </Circle>

      </Card>
    </Affix>

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
    }
  }
</script>

<style scoped>

  .user-card {
    width: 300px;
  }

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

</style>
