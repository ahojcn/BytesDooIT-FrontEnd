<template>
  <div>

    <div v-for="p in posts">
      <Col span="8" :gutter="16">
        <Card class="post-card" :bordered="false">
          <p slot="title">{{p.title}}</p>

          <p>正文：{{p.content}}</p>

          <p slot="extra">{{p.username}}</p>
        </Card>
      </Col>
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

        posts: [],
      }
    },
    methods: {
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

</style>
