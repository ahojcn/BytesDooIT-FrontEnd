<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <Row>
      <Col span="5">
        <Card :padding="0" :bordered="false" style="width: 300px;">
          <div slot="title">
            <Icon type="ios-heart" color="pink"></Icon>
            好文
          </div>

          <div slot="extra">
            <Tag color="warning">{{total_post}}</Tag>
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
      <Col span="19">
        <Card shadow>
          <div slot="title">
            <Avatar class="user-avatar" ref="avatar">
              {{cur_post.username}}
            </Avatar>
            <b>{{cur_post.username}}</b>
          </div>

          <div slot="extra">
            发布：{{new Date(cur_post.create_datetime).toLocaleDateString()}}
            <br>
            更新：{{new Date(cur_post.update_datetime).toLocaleDateString()}}
          </div>

          <div>
            <div>
              <h1>{{cur_post.title}}</h1>
              <!-- TODO 显示文章 tags categories -->
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
      }
    },
    methods: {
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
      /**
       * 切换点击事件
       */
      handleOnClickCell(i) {
        this.cur_post = this.posts[i];
        this.select_index = i;
      },
    },

    mounted() {
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
