<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <Row>
      <Col span="5">
        <Card title="好文" icon="ios-heart" :padding="0" :bordered="false" style="width: 300px;">
          <div slot="extra">
            <Tag color="warning">{{total_post}}</Tag>
          </div>

          <Input size="large" search placeholder="搜索"></Input>

          <CellGroup>

            <div v-for="(p, index) in posts">
              <Cell>
                <div>
                  {{p.title}}
                </div>
                <div slot="label">
                  {{p.content}}
                </div>
                <div slot="extra">
                  <Avatar class="user-avatar" ref="avatar">
                    {{p.username}}
                  </Avatar>
                </div>
              </Cell>
            </div>
          </CellGroup>

          <div style="text-align: center; padding-bottom: 20px; margin-top: 20px">
            <div style="display: inline;">
              <Page size="small" :total="total_post" :page-size="page_size" show-elevator
                    @on-page-size-change="handlePageSizeChange" @on-change="handlePageIndexChange"></Page>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="19">
        <Card shadow>
          <div slot="title">
            <Avatar class="user-avatar" ref="avatar">
              {{cur_post.username}}
            </Avatar>
            <b>{{cur_post.title}}</b>
          </div>

          <div>
            <mavon-editor
              class="md"
              :value="cur_post.content"
              :subfield = "false"
              :defaultOpen = "'preview'"
              :toolbarsFlag = "false"
              :editable="false"
              :scrollStyle="true"
              :ishljs = "true"
              :navigation="true"
            ></mavon-editor>
          </div>
        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
  export default {
    name: "Post",
    data() {
      return {
        loading: true,

        page_index: 1,
        page_size: 9,
        total_page: 1,
        total_post: 0,

        posts: [],
        cur_post: {},  // 当前展示的 post
      }
    },
    methods: {
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

          let post_id = this.$route.query.post_id;
          this.cur_post = this.posts[0];  // 默认显示第一篇
          if (post_id !== undefined || post_id !== null) {  // 有参数，查找文章 list 中是否有这篇文章
            for (let i = 0; i < this.posts.length; i++) {
              if (this.posts[i].post_id === post_id) {
                this.cur_post = this.posts;
                break;
              }
            }
          }

          this.loading = false;
        }).catch(err => {
          this.$Loading.error();
        });
      },
    },
    mounted() {
      this.getPosts();
    }
  }
</script>

<style scoped>
  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

</style>
