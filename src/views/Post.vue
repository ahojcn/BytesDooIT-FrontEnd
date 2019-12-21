<template>
  <div>

    <BackTop :height="100" :bottom="200" @on-click="handleBack2Top">
      <div class="back2top">返回顶端</div>
    </BackTop>

    <div v-for="p in posts">
      <Col span="8" :gutter="16">
        <Card class="post-card" :bordered="false">
          <p slot="title">{{p.title}}</p>

          <p>正文：{{p.content}}</p>

          <div slot="extra">
            <Avatar class="user-avatar" ref="avatar">
              {{p.username}}
            </Avatar>
          </div>
        </Card>
      </Col>
    </div>

    <div style="text-align: center;">
      <div style="display: inline;">
        <Page :total="total_post" :page-size="page_size" show-sizer show-total show-elevator
              @on-page-size-change="handlePageSizeChange" @on-change="handlePageIndexChange"></Page>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Post",
    data() {
      return {
        page_index: 1,
        page_size: 9,
        total_page: 1,
        total_post: 0,

        posts: [],
      }
    },
    methods: {
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
       * on-page-size-change
       * 当 page size 改变
       */
      handlePageSizeChange(new_page_size) {
        this.page_size = new_page_size;
        this.getPosts();
      },
      /**
       * 当页码发生改变
       */
      handlePageIndexChange(i) {
        this.page_index = i;
        this.getPosts();
      },
      /**
       * 分页获取 post
       */
      getPosts() {
        this.$Loading.start();
        this.$axios.get('api/post/', {
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
          console.log(res)
        }).catch(err => {
          this.$Loading.error();
          // console.log(err)
        });
      }
    },
    mounted() {
      this.getPosts();
    }
  }
</script>

<style scoped>

  .post-card {
    margin: 20px;
  }

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

  .back2top{
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }

</style>
