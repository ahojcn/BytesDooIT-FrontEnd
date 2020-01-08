<template>
  <div>

    <Card class="user-card" :bordered="false">
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

    </Card>

    <Divider dashed size="small"></Divider>

    <div>
      <Row :gutter="16">
        <Col :lg="4">
          <Card title="管理" icon="md-settings" :padding="0">
            <CellGroup>
              <Cell v-for="(item, index) in settings" :to="item.path" :selected="select_index === item.name"
                    :key="item.index" :name="item.name" :title="item.title"></Cell>
            </CellGroup>
          </Card>
        </Col>
        <Col :lg="20">
          <transition mode="out-in"
                      enter-active-class="animated bounceInRight"
                      leave-active-class="animated bounceOutRight">
            <router-view></router-view>
          </transition>
        </Col>
      </Row>
    </div>

  </div>
</template>

<script>
  import {getUserInfo, active} from '@/api/user';

  export default {
    name: "Home",
    data() {
      return {
        user_data: {},
        is_login: false,

        settings: [
          {index: 0, title: '文章管理', name: 'HomePost', selected: false, path: '/Home/Post'},
          {index: 1, title: '视频管理', name: 'HomeVideo', selected: false, path: '/Home/Video'},
          {index: 2, title: '直播管理', name: 'HomeLive', selected: false, path: '/Home/Live'},
          {index: 3, title: '简历管理', name: 'HomeResume', selected: false, path: '/Home/Resume'},
          {index: 4, title: '面试安排', name: 'HomeInterview', selected: false, path: '/Home/Interview'},
        ],
      }
    },
    computed: {
      select_index: {
        get() {
          return this.$route.name;
        },
        set(val) {
        }
      },
    },
    methods: {
      /**
       * 激活账号点击事件
       */
      handleActive() {
        this.$Loading.start();

        active().then(res => {
          this.$Loading.finish();
          if (res.status_code === 0) {
            this.$Message.success({background: true, content: res.msg})
          } else {
            this.$Message.error({background: true, content: res.msg})
          }

        }).catch(err => {
          this.$Loading.error();
          this.$Message.error({background: true, content: '电波无法到达'});

        });
      },
    },
    mounted() {
      this.$Loading.start();
      getUserInfo().then(res => {
        this.$Loading.finish();
        this.is_login = res.data.is_login;
        if (this.is_login === false) {
          this.$router.push('/');
        }
        this.user_data = res.data;

      }).catch(err => {
        this.$Loading.error();
        this.$Message.error({background: true, content: '电波无法到达'});

      });
    },
  }
</script>

<style scoped>

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

</style>
