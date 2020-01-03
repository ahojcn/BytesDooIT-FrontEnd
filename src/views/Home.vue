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

      <Divider></Divider>

      <div>
        <Row :gutter="16">
          <Col :lg="4">
            <Card title="管理" icon="md-settings" :padding="0">
              <CellGroup>
                <Cell v-for="(item, index) in settings" :key="item.index" :title="item.title"></Cell>
              </CellGroup>
            </Card>
          </Col>
          <Col :lg="20">
            <transition enter-active-class="fadeIn" mode="out-in" translate="yes" leave-active-class="fadeOut">
              <router-view v-if="init_flag" class="animated"></router-view>
            </transition>
          </Col>
        </Row>
      </div>

      <Tabs>
        <TabPane label="文章管理" icon="ios-heart">
          <div>
            <List item-layout="vertical">
              <ListItem v-for="(item, index) in posts" :key="item.post_id">
                <ListItemMeta>
                  <div slot="title">
                    <Tag v-if="item.is_draft" color="pink">草稿</Tag>
                    <Tag v-if="!item.is_draft" color="green">已发布</Tag>
                    {{item.title}}
                  </div>
                  <div slot="description">
                    {{item.content.substring(0, 100)}}
                  </div>
                </ListItemMeta>

                <template slot="action">
                  <li>
                    <img src="../assets/latiao.png" style="width: 15px"/>
                    {{item.food_count}}
                  </li>
                  <li>
                    <Icon type="md-thumbs-up"></Icon>
                    {{item.like_count}}
                  </li>
                  <li>
                    <Icon type="ios-chatbubbles-outline"></Icon>
                    <!-- todo 评论数 -->
                    暂无
                  </li>

                  <li>
                    <a href="">编辑</a>
                  </li>
                  <li>
                    <a href="">删除</a>
                  </li>
                </template>
              </ListItem>
            </List>

            <div style="text-align: center;">
              <div style="display: inline;">
                <Page :total="total_post" @on-change="handlePageIndexChange" :page-size="page_size" show-elevator
                      show-elevator></Page>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane label="投稿管理" disabled icon="logo-youtube">
          <div>
            标签二的内容
          </div>
        </TabPane>
        <TabPane label="简历管理" disabled icon="logo-tux">
          <div>
            标签三的内容
          </div>
        </TabPane>
        <TabPane label="笔试安排" disabled icon="logo-tux">
          <div>
            标签三的内容
          </div>
        </TabPane>
        <TabPane label="面试安排" disabled icon="logo-tux">
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

        settings: [
          {index: 0, title: '文章管理'},
          {index: 1, title: '视频管理'},
          {index: 2, title: '直播管理'},
          {index: 3, title: '简历管理'},
          {index: 4, title: '面试安排'},
        ],

        page_index: 1,  // 当前页
        page_size: 9,  // 每页多少个 post
        total_page: 1,  // 总共分多少页
        total_post: 0,  // 总共多少篇 post
        posts: [],  // post 列表
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
      /**
       * 获取自己的 post 草稿
       */
      getAllPost() {
        this.$Loading.start();
        this.$axios.get('api/post/draft/', {
          params: {
            page_index: this.page_index,
            page_size: this.page_size,
          }
        }).then(res => {
          console.log(res);
          if (res.data.status_code === 0) {
            this.posts = res.data.data.posts;
            this.page_index = res.data.data.page_index;
            this.page_size = res.data.data.page_size;
            this.total_page = res.data.data.total_page;
            this.total_post = res.data.data.total_post;
          }
        }).catch(err => {
          console.log(err)
        });
      },
      /**
       * 当页码发生改变
       */
      handlePageIndexChange(i) {
        this.page_index = i;
        this.getAllPost();
      },
    },
    mounted() {
      this.init_flag = true;
      this.check_login();

      this.getAllPost();

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
