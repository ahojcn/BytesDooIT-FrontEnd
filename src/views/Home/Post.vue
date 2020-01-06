<template>
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
            <br>
            创建：{{new Date(item.create_datetime).toLocaleDateString()}} |
            更新：{{new Date(item.update_datetime).toLocaleDateString()}}
          </div>
        </ListItemMeta>

        <template slot="action">
          <li>
            <img src="../../assets/latiao.png" style="width: 15px"/>
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
        </template>

        <template slot="extra">
          <ButtonGroup>
            <Button ghost type="primary" @click="handleEditorPost(item)">编辑</Button>
            <Button ghost type="error" @click="handleDeletePost(item)">删除</Button>
          </ButtonGroup>
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
</template>

<script>
  export default {
    name: "HomePost",
    data() {
      return {
        init_flag: false,
        user_data: {},
        is_login: false,

        page_index: 1,  // 当前页
        page_size: 5,  // 每页多少个 post
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
       * 删除文章按钮点击
       */
      handleDeletePost(post) {
        this.$Modal.confirm({
          title: '确认删除？',
          content: `${post.title}`,
          onOk: () => {
            this.$Loading.start();
            this.$axios.post('/api/post/draft/', {
              post_id: post.post_id,
            }).then(res => {
              this.$Loading.finish();
              if (res.data.status_code === 0) {
                this.$Message.success({background: true, content: res.data.msg});

                this.getAllPost();
              } else {
                console.log(res);
                this.$Message.error({background: true, content: res.data.msg})
              }
            }).catch(err => {
              console.log(err);
              this.$Loading.error();
              this.$Message.error({background: true, content: '电波无法到达'})
            })
          },
          onCancel: () => {
            this.$Message.info('Clicked cancel');
          }
        });
      },
      /**
       * 编辑文章按钮点击
       */
      handleEditorPost(post) {
        this.$router.push({path: '/NewPost', query: {post_id: post.post_id}});
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
          this.$Loading.finish();
          if (res.data.status_code === 0) {
            this.posts = res.data.data.posts;
            this.page_index = res.data.data.page_index;
            this.page_size = res.data.data.page_size;
            this.total_page = res.data.data.total_page;
            this.total_post = res.data.data.total_post;
          }
        }).catch(err => {
          this.$Loading.error();
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
    }
  }
</script>

<style scoped>

</style>
