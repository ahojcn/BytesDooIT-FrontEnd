<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <!--  带 post id 过来的时候显示单个文章  -->
    <Drawer :style="{position: 'fixed', zIndex: '99999', opacity: '0.95'}"
            placement="right"
            width="95"
            :closable="false"
            :scrollable="true"
            v-model="show_one_post">
      <Card shadow>
        <div slot="title">
          <div>
            <div style="text-align: center;">
              <div style="display: inline;">
                <Avatar class="user-avatar" ref="avatar" size="large">
                  {{one_post.username}}
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        <div slot="extra">
          <Button type="info" size="large" @click="jumpToIndex">返回首页</Button>
        </div>

        <div>
          <div style="text-align: center;">
            <div style="display: inline;">
              <h1>{{one_post.title}}</h1>

              发布：{{new Date(one_post.create_datetime).toLocaleDateString()}}
              <br>
              更新：{{new Date(one_post.update_datetime).toLocaleDateString()}}
              <br>

              <Tag :fade="false" color="primary" v-for="item in one_post.tags" :key="item.id">{{item.name}}</Tag>
              <Tag :fade="false" color="warning" v-for="item in one_post.category" :key="item.id">{{item.name}}
              </Tag>
            </div>
          </div>

          <mavon-editor
            class="md"
            style="min-height: 500px; z-index: 90"
            :value="one_post.content"
            :subfield="false"
            :defaultOpen="'preview'"
            :toolbarsFlag="false"
            :editable="false"
            :scrollStyle="true"
            :ishljs="true"
            :navigation="true"
            :readmodel="true"
          ></mavon-editor>
        </div>
      </Card>
    </Drawer>

    <Row :gutter="16">
      <!--   左边栏   -->
      <Col :lg="5">
        <Card :padding="0" :bordered="false" style="width: auto">
          <div slot="title">
            <Icon type="ios-heart" color="pink"></Icon>
            好文
          </div>

          <div slot="extra">
            <span>{{total_post}}</span>
          </div>

          <Input size="large" v-model="search_key" autofocus search placeholder="根据标题搜索"></Input>

          <CellGroup ref="cellgroup" @on-click="handleOnClickCell" style="min-height: 500px">
            <div v-for="(p, index) in searchPost(search_key)">
              <!-- :ref="'cell' + index" -->
              <Cell :name="index" :selected="select_index === index">
                <div>
                  {{p.title}}
                </div>
                <div slot="label">
                  {{p.content.substring(0, 30)}}
                </div>
                <div slot="extra">
                  <Tag color="pink">
                    <Icon type="md-thumbs-up"></Icon>
                    {{p.like_count}}
                  </Tag>
                  <Tag type="border" color="warning">
                    <Icon type="logo-snapchat" color="orange"></Icon>
                    {{p.food_count}}
                  </Tag>
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

      <!--   文章内容   -->
      <Col :lg="19">
        <Card shadow>
          <div slot="title">
            <div>
              <div style="text-align: center;">
                <div style="display: inline;">
                  <Avatar class="user-avatar" ref="avatar" size="large">
                    {{cur_post.username}}
                  </Avatar>
                  {{cur_post.username}}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style="text-align: center;">
              <div style="display: inline;">
                <h1>{{cur_post.title}}</h1>

                发布：{{new Date(cur_post.create_datetime).toLocaleDateString()}}
                <br>
                更新：{{new Date(cur_post.update_datetime).toLocaleDateString()}}
                <br>

                <Tag :fade="false" color="primary" v-for="item in cur_post.tags" :key="item.id">{{item.name}}</Tag>
                <Tag :fade="false" color="warning" v-for="item in cur_post.category" :key="item.id">{{item.name}}
                </Tag>
              </div>
            </div>

            <mavon-editor
              class="md"
              style="min-height: 500px; z-index: 90"
              :value="cur_post.content"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
              :navigation="true"
              :readmodel="true"
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

        page_index: 1,  // 当前页
        page_size: 9,  // 每页多少个 post
        total_page: 1,  // 总共分多少页
        total_post: 0,  // 总共多少篇 post

        select_index: 0,  // 当前选中的 cell 的 index

        posts: [],  // post 列表
        cur_post: {},  // 当前展示的 post

        search_key: '',  // 搜索关键词
        posts_backup: [],  // 开始搜索时，备份之前的 posts，当搜索结束后重新给值

        show_one_post: false,  // 当网页参数有 post id 时候，显示单个文章
        one_post: {},  // 单个 post 内容
      }
    },
    methods: {
      /**
       * 跳转到首页
       */
      jumpToIndex() {
        this.$router.push('/Post');
        this.$router.go(0);
      },
      /**
       * search
       */
      searchPost(keywords) {
        let ret = [];
        if (keywords === '') {
          return this.posts;
        } else {
          this.posts.forEach(item => {
            if (item.title.indexOf(keywords) !== -1) {
              ret.push(item);
            }
          });
        }
        return ret;
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
          this.cur_post = this.posts[0];

          this.loading = false;
        }).catch(err => {
          this.$Message.error({background: true, content: '小蜜蜂飞不过去'});
        });
      },
      /**
       * 切换点击事件
       */
      handleOnClickCell(i) {
        this.cur_post = this.posts[i];
        this.select_index = i;
      },
      /**
       * 获取单个 post
       */
      getOnePost(post_id) {
        this.$axios.get('api/post/', {
          params: {post_id: post_id}
        }).then(res => {
          if (res.data.data.posts.length === 0) {
            this.$Message.error({background: true, content: '无相关文章'});
            this.show_one_post = false;
          } else {
            this.one_post = res.data.data.posts[0];
          }

        }).catch(err => {
          this.$Message.error({background: true, content: '小蜜蜂飞不过去'});
        })
      },
    },

    mounted() {
      let post_id = this.$route.query.post_id;
      if (post_id !== undefined && post_id !== null) {
        this.show_one_post = !this.show_one_post;
        this.getOnePost(post_id);
      }

      this.getPosts();
    },
  }
</script>

<style scoped>

  .user-avatar {
    color: #f56a00;
    background-color: #fde3cf
  }

</style>
