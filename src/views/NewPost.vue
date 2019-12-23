<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <Modal
      v-model="show_modal"
      title="发布文章"
    >
      <table>
        <tr>
          <td>文章标签：</td>
          <td>
            <Tag v-for="item in tags" :key="item" :name="item" closable @on-close="handleCloseTag">{{item}}</Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAddTag">添加标签</Button>
          </td>
        </tr>
        <br>
        <tr>
          <!--  todo  -->
          <td>文章分类：</td>
          <td>
            <Tag v-for="item in category" :key="item" :name="item" closable @on-close="handleCloseCategory">{{item}}</Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAddCategory">添加分类</Button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <CheckboxGroup @on-change="handleCategoryCheckChange">
              <Checkbox v-for="item in prev_category" :key="item.category_id" :label="item.category_name"></Checkbox>
            </CheckboxGroup>
          </td>
        </tr>
      </table>
      <div slot="footer">
        <Button type="text" @click="show_modal=!show_modal">取消</Button>
        <Button type="warning" :loading="loading" @click="handleModalClickOk">发布文章</Button>
      </div>
    </Modal>

    <div style="padding-bottom: 10px">
      <Row>
        <Col span="2">
          <!--          TODO  文章管理 -->
          <Button type="text" icon="md-arrow-round-back" size="large">文章管理</Button>
        </Col>
        <Col span="18">
          <Input v-model="title" size="large" placeholder="输入文章标题"></Input>
        </Col>
        <Col span="2">
          <!--          TODO  保存草稿 -->
          <Button size="large" type="warning" long ghost disabled>保存草稿</Button>
        </Col>
        <Col span="2">
          <Button size="large" long type="warning" @click="show_modal=!show_modal">发布文章</Button>
        </Col>
      </Row>
    </div>

    <mavon-editor
      v-model="content"
      ref="md"
      style="z-index: 90"
      @save="handleSave"
    >
    </mavon-editor>
  </div>
</template>

<script>
  export default {
    name: "NewPost",
    data() {
      return {
        title: '',  // 标题
        content: '',  // 正文

        show_modal: false,  // 发布文章添加标签、分类的对话框
        loading: false,  // 是否加载中

        is_login: false,  // 是否已登录
        user_data: {},  // 用户数据

        tags: [],  // 已添加的标签
        tmp_tag: '',  // 临时变量

        prev_category: [],  // 用户之前的分类
        category: [],  // 分类
        tmp_category: '',  // 临时变量
      }
    },
    methods: {
      /**
       * 添加分类
       */
      handleAddCategory() {
        let max_len = 3;
        if (this.tags.length >= max_len) {
          this.$Message.error({background: true, content: `最多 ${max_len} 个分类哟~`});
          return;
        }

        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.category[this.category.length],
                autofocus: true,
                placeholder: '输入分类名'
              },
              on: {
                input: (val) => {
                  this.tmp_category = val;
                }
              }
            })
          },
          onOk: () => {
            this.category.push(this.tmp_category);
            this.tmp_category = ''
          },
        });
      },
      /**
       * 选中之前的分类
       */
      handleCategoryCheckChange(item) {
        this.category.push(item[0]);
        // console.log(this.category)
      },
      /**
       * 删除分类
       */
      handleCloseCategory(event, name) {
        this.category.pop();
      },
      /**
       * 添加标签
       */
      handleAddTag() {
        let max_len = 5;
        if (this.tags.length >= max_len) {
          this.$Message.error({background: true, content: `最多 ${max_len} 个标签哟~`});
          return;
        }

        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.tags[this.tags.length],
                autofocus: true,
                placeholder: '输入标签名'
              },
              on: {
                input: (val) => {
                  this.tmp_tag = val;
                }
              }
            })
          },
          onOk: () => {
            this.tags.push(this.tmp_tag);
            this.tmp_tag = ''
          },
        });
      },
      /**
       * 删除标签
       */
      handleCloseTag(event, name) {
        this.tags.pop();
      },
      /**
       * 对话框 ok 点击事件
       */
      handleModalClickOk() {
        this.handleSubmit();
      },
      /**
       * ctrl + s 保存时候触发
       * TODO 保存为草稿
       * value -> markdown content
       * html -> html content render
       */
      handleSave(value, html) {
        this.$Message.success({
          background: true,
          content: '已保存'
        });
      },
      /**
       * 发布文章, is_draft = false
       */
      handleSubmit() {
        this.loading = true;
        this.$Loading.start();
        this.$axios.post('api/post/', {
          title: this.title,
          content: this.content,
          is_draft: false,
          tags: this.tags,
          category: this.category

        }).then(res => {
          this.loading = false;
          this.$Loading.finish();
          console.log(res);
          if (res.data.status_code === -1) {
            this.$Message.error({background: true, content: '你还什么都没写哟'});
          } else {
            this.$Message.success({background: true, content: res.data.msg});
          }

        }).catch(err => {
          this.loading = false;
          this.$Loading.error();
          this.$Message['error']({
            background: true,
            content: '电波无法到达'
          });
        });
      },
      /**
       * 获取用户的 post 分类列表
       */
      getUserPostCategory() {
        this.loading = true;
        this.$axios.get('api/post/category/', {
          params: {user_id: this.user_data.user_id}
        }).then(res => {
          this.prev_category = res.data.data;
          this.$Loading.finish();

        }).catch(err => {
          this.$Loading.error();
          this.$Message['error']({
            background: true,
            content: '电波无法到达'
          });
        });

        this.loading = false;
      },
      /**
       * 检查是否已登录
       */
      check_login() {
        this.$Loading.start();
        this.$axios.get('api/user/session/')
          .then(res => {
            this.$Loading.finish();
            this.is_login = res.data.data.is_login;
            if (this.is_login === true) {
              this.user_data = res.data.data;
              if (this.user_data.is_active === false) {
                this.$Message.error({background: true, content: '请查收邮件并激活账号'})
              }
            }

            this.getUserPostCategory();
          })
          .catch(err => {
            // console.log(err);
            this.$Loading.error();
            this.$Message['error']({
              background: true,
              content: '电波无法到达'
            });
          });
      },
    },
    created() {
      this.check_login();
    },
  }
</script>

<style scoped>

</style>
