<template>
  <div class="article main">
    <div class="container">
      <div class="loading" v-if="loading">AAAAAAAAAAAA</div>
      <div v-else>
        <div class="article-control">
          <router-link class="btn" v-if="!loading" :to="'/' + groupID">
            <i class="icofont-swoosh-left"></i>返回文章列表
          </router-link>
          <router-link
            class="btn"
            :to="'/' + groupID + '/' + articleID + '/newReply'"
          >
            <i class="icofont-pencil-alt-5"></i> 新增回覆
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { userCheck, groupCheck, getRealData, getFD } from "../assets/config";

export default {
  name: "Article",
  data() {
    return {
      loading: true,
      article: null,
      replyList: [],
    };
  },
  computed: {
    groupID() {
      return this.$route.params.groupID;
    },
    articleID() {
      return this.$route.params.articleID;
    },
  },
  props: {
    userID: String,
    userName: String,
    activeAuth: Number,
    groupList: Array,
    handlerData: Function,
    handlerLogs: Function,
  },
  created() {
    userCheck(this.userID)
      .then(() => groupCheck(this.groupID, this.groupList))
      .then((res) => {
        this.handlerData("activeAuth", res.auth);
        this.handlerData("activeGroupName", res.name);
        this.handleArticle();
      })
      .catch((path) => router.replace(path));
  },
  methods: {
    handleArticle() {
      this.handlerLogs("View", this.groupID, this.articleID);
      getFD("/article/" + this.groupID + "/" + this.articleID)
        .then((res) => (this.article = res))
        .then(() => {
          getRealData("/comment/" + this.groupID + "/" + this.articleID).on(
            "value",
            (res) => {
              console.log(res.val());
              // this.artList.length = 0;
              // if (!res.val()) return;
              // Object.keys(res.val()).forEach((key) => {
              //   let temp = res.val()[key];
              //   temp.key = key;
              //   this.artList.unshift(temp);
              // });
            }
          );
        })
        .then(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.article {
  &-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &_title {
    padding: min(1.5vw, 0.5rem);
    font-size: min(5vw, 2.5rem);
    color: $c_dark;
    background-color: #43b883;
  }
  &_subTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $c_dark;
    font-size: min(3vw, 1rem);
    background-color: gainsboro;
    & > * {
      flex: 2;
      padding: min(1.5vw, 0.5rem);
    }
  }
  &_del {
    flex: 1;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_danger;
    }
  }
  &_content {
    width: 100%;
    padding: min(1.5vw, 0.5rem);
    font-size: min(4vw, 1.5rem);
    line-height: min(5vw, 2rem);
    border: 2px solid $c_secondary;
    box-sizing: border-box;
    resize: none;
    outline: none;
    &.new {
      background-color: $c_secondary-light;
    }
  }
  &_comment {
    display: flex;
    align-items: stretch;
    margin-top: 0.3rem;
    &_main {
      flex: 1;
    }
  }
  &_floor {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10vw;
    max-width: 4rem;
    margin-right: 0.5rem;
    font-size: min(4vw, 1.5rem);
    background-color: $c_secondary-light;
  }
}
</style>
