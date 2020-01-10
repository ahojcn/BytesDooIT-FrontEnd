<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <!--  带 post id 过来的时候显示单个文章  -->
    <Drawer :style="{position: 'fixed', zIndex: '99999', opacity: '0.95'}"
            placement="right"
            width="95"
            :closable="false"
            v-model="show_one_post">
      <Card shadow>
        <div slot="title">
          <div style="text-align: center;">
            <div style="display: inline;">
              <Avatar :src="one_post.user_data.avatar" class="user-avatar" ref="avatar" size="large"></Avatar>
              <span style="color: #fb7299; font-weight: 700">
                    {{one_post.user_data.username}}
              </span>
            </div>
          </div>
        </div>

        <div slot="extra">
          <Button type="warning" size="large" @click="jumpToIndex">返回首页</Button>
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

          <Divider orientation="left">正文</Divider>

          <mavon-editor
            class="md"
            style="min-height: 500px; z-index: 90"
            :boxShadowStyle="'0 0px 0px 0 rgba(0, 0, 0, 0)'"
            :previewBackground="'#fff'"
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

          <Divider orientation="left">EOF</Divider>
        </div>
      </Card>
    </Drawer>

    <Row :gutter="16">
      <!--   左边栏   -->
      <Col :lg="4">
        <Card :padding="0" :bordered="false" style="width: auto">
          <div slot="title">
            <Icon type="ios-heart" color="pink"></Icon>
            好文
          </div>

          <div slot="extra">
            <span>{{total_post}}</span>
          </div>

          <Input size="large" v-model="search_key" autofocus search placeholder="搜索"></Input>

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
                  <span style="color: orange">{{p.like_count}}</span>赞
                  <span style="color: orange">{{p.food_count}}</span>辣条
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
      <Col :lg="20">
        <Card shadow>
          <div slot="title">
            <div style="text-align: center;">
              <div style="display: inline;">
                <Avatar :src="cur_post.user_data.avatar" class="user-avatar" ref="avatar" size="large"></Avatar>
                <span style="color: #fb7299; font-weight: 700">
                    {{cur_post.user_data.username}}
                  </span>

                <Badge :text="'LV ' + cur_post.user_data.level" type="info">
                                      <span slot="text">
                                         LV <b>{{cur_post.user_data.level}}</b>
                                      </span>
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <div style="text-align: center;">
              <div style="display: inline; ">
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

            <div style="text-align: center;">
              <div style="display: inline;">
                <Row>
                  <Col :span="10">&nbsp;</Col>
                  <Col :span="2">
                    <!-- 投喂辣条 -->
                    <Poptip trigger="hover">
                      <div slot="content">
                        送给作者一包辣条！<br>不能反悔！<br>
                        我的辣条
                        <span style="color: orange">{{user_data.food_num}}</span>
                      </div>
                      <a>
                        <img src="../assets/latiao.png" style="width: 30px" alt="辣条"
                             @click="giveLaTiao(cur_post.post_id)">
                      </a>
                    </Poptip>
                    <br>
                    <span style="color: orange">{{cur_post.food_count}}</span>辣条
                  </Col>
                  <Col :span="2">
                    <!-- 点赞 -->
                    <Poptip trigger="hover">
                      <div slot="content">
                        写得好，赞一个
                      </div>
                      <a style="color: pink">
                        <Icon type="md-thumbs-up" size="35" @click="likePost(cur_post.post_id)"></Icon>
                      </a>
                    </Poptip>
                    <br>
                    <span style="color: orange">{{cur_post.like_count}}</span>赞
                  </Col>
                  <Col :span="10">&nbsp;</Col>
                </Row>
              </div>
            </div>

            <Divider orientation="left">正文</Divider>

            <mavon-editor
              class="md"
              style="min-height: 100px; z-index: 90"
              :value="cur_post.content"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :boxShadowStyle="'0 0px 0px 0 rgba(0, 0, 0, 0)'"
              :previewBackground="'#fff'"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
              :navigation="true"
              :readmodel="true"
            ></mavon-editor>

            <Divider orientation="left">EOF</Divider>
          </div>
        </Card>

        <div style="padding-top: 20px">
          <Card>
            <div slot="title">
              <div style="text-align: center;">
                <Icon type="ios-arrow-back" size="30"></Icon>
                <span style="font-size: 25px">评论</span>
                <Icon type="ios-arrow-forward" size="30"></Icon>
              </div>
            </div>

            <div>
              <List size="small">
                <ListItem v-for="(item, index) in comments.comments" :key="index">
                  <ListItemMeta :description="item.description">
                    <template slot="avatar">
                      <Avatar icon="ios-person" size="large" :src="item.avatar"></Avatar>
                    </template>

                    <template slot="title">
                      <mavon-editor
                        style="min-height: 100px; z-index: 90"
                        :boxShadowStyle="'0 0px 0px 0 rgba(0, 0, 0, 0)'"
                        :previewBackground="'#fff'"
                        :value="item.content"
                        :subfield="false"
                        :defaultOpen="'preview'"
                        :toolbarsFlag="false"
                        :editable="false"
                        :scrollStyle="true"
                        :ishljs="true"
                        :readmodel="true"
                      ></mavon-editor>
                    </template>
                  </ListItemMeta>

                  <template slot="action">
                    <Button type="text" @click="handleLikeComment(item.id, true)">
                      <Icon type="ios-thumbs-up" size="20"></Icon>
                      {{item.like_count}}
                    </Button>
                    <Button type="text" @click="handleLikeComment(item.id, false)">
                      <Icon type="md-thumbs-down" size="20"></Icon>
                      {{item.unlike_count}}
                    </Button>
                  </template>
                </ListItem>
              </List>

              <div style="text-align: center; padding-bottom: 20px; margin-top: 20px">
                <div style="display: inline;">
                  <Page size="small" :total="comments.total_post" :page-size="comments.page_size" show-elevator
                        @on-change="handleCommentPageIndexChange"></Page>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div v-if="is_login" style="padding-top: 20px">
          <Card>
            <div style="text-align: center">
              <Tag size="large" color="#FFA2D3">写了 {{comment_len}} 字，能写 {{comment_max_len}} 字</Tag>
            </div>

            <mavon-editor
              v-model="comment_content"
              ref="md"
              style="min-height: 10px; flex-direction: column; margin: 10px"
              :editable="is_login"
              :toolbarsFlag="false"
              :previewBackground="'#fff'"
              :boxShadowStyle="'0 0px 0px 0 rgba(0, 0, 0, 0)'"
              :shortCut="false"
              placeholder="留个友善的评论意思下，支持 Markdown 语法 ~"
              @change="handleCommentChange"
            >
            </mavon-editor>

            <div style="text-align: center">
              <Button type="primary" @click="handleSubmitComment">我说完了，提交吧</Button>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getUserInfo} from '@/api/user';
  import {giveFood, giveLike, getAllPost} from '@/api/post';
  import {newComment, getComment, likeComment} from '@/api/comment';

  export default {
    name: "Post",
    data() {
      return {
        loading: true,
        user_data: {},
        is_login: false,

        page_index: 1,  // 当前页
        page_size: 9,  // 每页多少个 post
        total_page: 1,  // 总共分多少页
        total_post: 0,  // 总共多少篇 post

        select_index: 0,  // 当前选中的 cell 的 index

        posts: [],  // post 列表
        cur_post: {
          user_data: {},
        },  // 当前展示的 post

        search_key: '',  // 搜索关键词
        posts_backup: [],  // 开始搜索时，备份之前的 posts，当搜索结束后重新给值

        show_one_post: false,  // 当网页参数有 post id 时候，显示单个文章
        one_post: {
          user_data: {},
        },  // 单个 post 内容

        comment_content: '',  // 评论内容
        comment_max_len: 512,  // 评论最大长度

        comments: {
          page_index: 1,
        },  // 获取的当前文章的评论
      }
    },
    watch: {
      // 当 cur_post 发生改变的时候
      cur_post: function () {
        this.getComment();
      }
    },
    computed: {
      comment_len: {
        get() {
          return this.comment_content.length;
        }
      }
    },
    methods: {
      handleLikeComment(id, like) {
        this.$Loading.start();
        likeComment({
          id: id,
          like: like,
        }).then(res => {
          if (res.status_code === 0) {
            this.$Loading.finish();
            this.$Message.success(res.msg);
          } else {
            this.$Loading.error();
            this.$Message.error(res.msg);
          }
          this.getComment();
        });
      },
      // 获取 cur_post 的评论数据
      getComment() {
        this.$Loading.start();
        getComment({
          post_id: this.cur_post.post_id,
          page_index: this.comments.page_index
        }).then(res => {
          this.$Loading.finish();
          this.comments = res.data;
        });
      },
      // 提交评论
      handleSubmitComment() {
        if (this.comment_content.length === 0) {
          this.$Message.info('说点什么再提交吧~');
          return
        }

        this.$Loading.start();
        newComment({
          post_id: this.cur_post.post_id,
          content: this.comment_content
        }).then(res => {
          this.$Loading.finish();
          if (res.status_code === 0) {
            this.$Message.success(res.msg);
            this.comment_content = '';
            this.getComment();  // 更新评论信息
          } else {
            this.$Loading.error();
            this.$Message.error(res.msg);
          }
        });
      },
      // 评论页码发生改变
      handleCommentPageIndexChange(i) {
        this.comments.page_index = i;
        this.getComment();
      },
      // 评论内容改变时，检查是否超过长度，触发提示
      handleCommentChange(value) {
        if (value.length >= this.comment_max_len) {
          this.$Message.warning({background: true, content: '说太多啦~删一些吧！'});
        }
      },
      // 投喂辣条
      giveLaTiao(post_id) {
        this.$Loading.start();

        giveFood({
          post_id: post_id
        }).then(res => {
          this.$Loading.finish();

          if (res.status_code === -1) {
            this.$Message.error({background: true, content: res.msg});
          } else if (res.status_code === 0) {
            this.$Message.success({background: true, content: '投喂成功'});
            // 更新文章信息
            this.getPosts();
          }
        });
      },
      // 给文章点赞
      likePost(post_id) {
        this.$Loading.start();

        giveLike({
          post_id: post_id
        }).then(res => {
          this.$Loading.finish();

          if (res.status_code === -1) {
            this.$Message.error({background: true, content: res.msg});
          } else if (res.status_code === 0) {
            this.$Message.success({background: true, content: '点赞成功'});
            // 更新文章信息
            this.getPosts();
          }
        });
      },
      // 跳转到首页
      jumpToIndex() {
        this.$router.push('/Post');
        this.$router.go(0);
      },
      // search
      searchPost(keywords) {
        let ret = [];
        if (keywords === '') {
          return this.posts;
        } else {
          this.posts.forEach(item => {
            if (item.title.indexOf(keywords) !== -1
              || item.content.indexOf(keywords) !== -1) {
              ret.push(item);
            }
          });
        }
        return ret;
      },
      /*
       * on-page-size-change
       * 当 page size 改变
       */
      handlePageSizeChange(new_page_size) {
        this.page_size = new_page_size;
        this.getPosts();
      },
      // 当页码发生改变
      handlePageIndexChange(i) {
        this.page_index = i;
        this.getPosts();
      },
      // 分页获取 post
      getPosts() {
        this.$Loading.start();
        getAllPost({
          page_index: this.page_index,
          page_size: this.page_size,
        }).then(res => {
          this.$Loading.finish();
          if (res.status_code === 0) {
            this.posts = res.data.posts;
            this.page_index = res.data.page_index;
            this.page_size = res.data.page_size;
            this.total_page = res.data.total_page;
            this.total_post = res.data.total_post;
          }
          this.cur_post = this.posts[this.select_index];

          this.loading = false;
        });
      },
      // 切换点击事件
      handleOnClickCell(i) {
        this.cur_post = this.posts[i];
        this.select_index = i;
      },
      // 获取单个 post
      getOnePost(post_id) {
        this.$Loading.start();
        getAllPost({post_id: post_id}).then(res => {
          this.$Loading.finish();
          if (res.data.posts.length === 0) {
            this.$Message.error({background: true, content: '无相关文章'});
            this.show_one_post = false;
          } else {
            this.one_post = res.data.posts[0];
          }
        });
      },
    },

    mounted() {
      this.$Loading.start();
      getUserInfo().then(res => {
        this.$Loading.finish();
        this.is_login = res.data.is_login;
        if (this.is_login === true) {
          this.user_data = res.data;
          if (this.user_data.is_active === false) {
            this.$Message.error({background: true, content: '请查收邮件并激活账号'})
          }
        }

      });

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
