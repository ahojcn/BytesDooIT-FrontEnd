<template>
  <div>
    <!--  loading  -->
    <Spin size="large" fix v-if="loading"></Spin>

    <!--  发布文章添加 tag、category 对话框  -->
    <Modal
      v-model="show_modal"
      title="发布文章"
      :mask-closable="false"
      :closable="false"
    >
      <table>
        <tr>
          <td style="width: 100px">文章标签：</td>
          <td>
            <Tag v-for="item in tags" :key="item" :name="item" closable @on-close="handleCloseTag">{{item}}</Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAddTag">添加标签</Button>
          </td>
        </tr>
        <br>
        <tr>
          <td style="width: 100px">文章分类：</td>
          <td>
            <Tag v-for="item in category" :key="item" :name="item" closable @on-close="handleCloseCategory">{{item}}
            </Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAddCategory">添加分类</Button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <CheckboxGroup v-model="category" @on-change="handleCategoryCheckChange">
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


    <!--  发布成功的对话框  -->
    <Modal
      v-model="show_success_modal"
      :mask-closable="false"
      :closable="false"
    >
      <div slot="header">
        <Icon type="md-checkmark-circle-outline" color="orange" size="20"></Icon>
        <span style="font-size: 20px"><b>发布成功</b></span>
      </div>

      <div>
        <table>
          <tr>
            <td>标题：</td>
            <td>{{success_modal_show_data.title}}</td>
          </tr>
          <tr>
            <td>时间：</td>
            <td>{{new Date(success_modal_show_data.create_datetime).toLocaleDateString()}}</td>
          </tr>
          <tr>
            <td>标签：</td>
            <td v-for="(item, index) in success_modal_show_data.tags">
              <Tag color="magenta">{{item.name}}</Tag>
            </td>
          </tr>
          <tr>
            <td>分类：</td>
            <td v-for="(item, index) in success_modal_show_data.category">
              <Tag color="magenta">{{item.name}}</Tag>
            </td>
          </tr>
        </table>
      </div>

      <div slot="footer">
        <Button type="primary" ghost to="/Home/Post" size="large">文章管理</Button>
        <Button type="warning" size="large" @click="jumpToIndexWithPostId">去看看</Button>
      </div>
    </Modal>


    <div style="padding-bottom: 10px">
      <Row>
        <Col span="2">
          <Button ghost to="/Home/Post" size="large" long>文章管理</Button>
        </Col>
        <Col span="18">
          <Input v-model="title" size="large" placeholder="输入文章标题"></Input>
        </Col>
        <Col span="2">
          <Button long size="large" ghost @click="handleSave">保存草稿</Button>
        </Col>
        <Col :span="2">
          <Button long size="large" type="warning" @click="show_modal=!show_modal">发布文章</Button>
        </Col>
      </Row>
    </div>

    <mavon-editor
      v-model="content"
      ref="md"
      style="z-index: 90; display: flex; min-height: 100vh; flex-direction: column;"
      @save="handleSave"
      @imgAdd="uploadPostImage"
      @imgDel="delPostImage"
    >
    </mavon-editor>
  </div>
</template>

<script>
  import {getUserInfo} from '@/api/user';
  import {uploadImg, selfPost, newPost, getPostCategory} from '@/api/post';

  export default {
    name: "NewPost",
    data() {
      return {
        title: '',  // 标题
        content: '',  // 正文

        show_modal: false,  // 发布文章添加标签、分类的对话框
        show_success_modal: false,  // 成功发布后的信息展示对话框
        loading: false,  // 是否加载中

        is_login: false,  // 是否已登录
        user_data: {},  // 用户数据

        tags: [],  // 已添加的标签
        tmp_tag: '',  // 临时变量

        prev_category: [],  // 用户之前的分类
        category: [],  // 分类
        tmp_category: '',  // 临时变量

        success_modal_show_data: {},  // 成功后对话框显示的数据

        post_id: null,

        img_files: [],  // 文章中上传的图片
      }
    },
    methods: {
      // 上传图片
      uploadPostImage(pos, file) {
        this.$Loading.start();
        this.$Message.info({background: true, content: '上传 img 中...'});
        let formdata = new FormData();
        formdata.append('img', file);
        this.img_files[pos] = file;
        uploadImg(formdata).then(res => {
          this.$Loading.finish();
          if (res.status_code === 0) {
            // 将返回的url替换到文本原位置![...](0) -> ![...](url)
            this.$refs.md.$img2Url(pos, res.data.img_url);
            this.$Message.success({background: true, content: res.msg});
          } else {
            this.$Message.error({background: true, content: res.data.msg});
            this.delPostImage(pos);  // 删除添加的图片
          }
        });
      },
      // 删除图片
      delPostImage(pos) {
        delete this.img_files[pos];
      },
      /* ctrl + s 保存时候触发
       * 点击保存草稿触发
       * 网页定时器保存触发 */
      handleSave(value, html) {
        this.$Loading.start();
        newPost({
          title: this.title,
          content: this.content,
          tags: this.tags,
          category: this.category,
          is_draft: true,
          post_id: this.post_id
        }).then(res => {
          this.$Loading.finish();
          if (res.status_code === 0) {
            this.post_id = res.data.post_id;
            this.$Message.success({background: true, content: res.msg});
          } else {
            this.$Message.error({background: true, content: res.msg});
          }
        });
      },
      // 发布成功后跳转到首页，并带上 post id
      jumpToIndexWithPostId() {
        this.$router.push(`/Post?post_id=${this.success_modal_show_data.post_id}`)
      },
      // 添加分类
      handleAddCategory() {
        let max_len = 3;
        if (this.category.length >= max_len) {
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
            if (this.category.includes(this.tmp_category)) {
              return;
            }
            this.category.push(this.tmp_category);
            this.tmp_category = ''
          },
        });
      },
      // 之前的分类选中 / 取消选中的时候
      handleCategoryCheckChange(item) {
        let max_len = 3;
        if (this.category.length > max_len) {
          this.$Message.error({background: true, content: `最多 ${max_len} 个分类哟~`});
          this.category.pop();
        }
      },
      // 删除分类
      handleCloseCategory(event, name) {
        this.category.pop();
      },
      // 添加标签
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
      // 删除标签
      handleCloseTag(event, name) {
        this.tags.pop();
      },
      // 对话框 ok 点击事件
      handleModalClickOk() {
        this.handleSubmit();
      },
      // 发布文章, is_draft = false
      handleSubmit() {
        this.loading = true;
        this.$Loading.start();
        newPost({
          title: this.title,
          content: this.content,
          is_draft: false,
          tags: this.tags,
          category: this.category
        }).then(res => {
          this.loading = false;
          this.$Loading.finish();
          if (res.status_code === -1) {
            this.$Message.error({background: true, content: res.msg});
            this.show_modal = !this.show_modal;
          } else {
            this.$Message.success({background: true, content: res.msg});
            this.success_modal_show_data = res.data;
            this.show_modal = !this.show_modal;
            this.show_success_modal = !this.show_success_modal;
          }
        });
      },
      // 获取用户的 post 分类列表
      getUserPostCategory() {
        this.loading = true;
        this.$Loading.start();
        getPostCategory({user_id: this.user_data.user_id}).then(res => {
          this.prev_category = res.data;
          this.$Loading.finish();
        });
        this.loading = false;
      },
    },

    created() {
      this.$Loading.start();
      getUserInfo().then(res => {
        this.$Loading.finish();
        this.is_login = res.data.is_login;
        if (this.is_login === true) {
          this.user_data = res.data;
          if (this.user_data.is_active === false) {
            this.$Message.error({background: true, content: '请查收邮件并激活账号'})
          }
          this.getUserPostCategory();
        } else {
          this.$router.push({path: '/'});
        }
      });

      // 判断有无 post_id
      let post_id = this.$route.query.post_id;
      if (post_id !== undefined) {
        // 获取此文相关内容
        this.$Loading.start();
        selfPost({post_id: post_id, is_edit: true}).then(res => {
          this.$Loading.finish();
          if (res.data.posts.length === 0) {
            this.$Message.error({background: true, content: '无相关文章'});
            this.$router.go(-1);
          } else {
            let post = res.data.posts[0];
            this.title = post.title;
            this.content = post.content;
          }
        });

      }
    },
  }
</script>

<style scoped>

</style>
