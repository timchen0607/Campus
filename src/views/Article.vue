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
            :to="'/' + groupID + '/' + articleID + '/newComment'"
          >
            <i class="icofont-pencil-alt-5"></i> 新增回覆
          </router-link>
        </div>
        <div class="article-main">
          <h3 class="article-title" v-text="article.title"></h3>
          <h4 class="article-subTitle">
            <span v-text="article.type"></span>
            <span v-text="article.authorName"></span>
            <span v-text="article.timeStamp"></span>
            <span
              class="article-del"
              @click="handleArtDel"
              v-if="userID === article.author || activeAuth > 1"
            >
              <i class="icofont-ui-delete"></i>
            </span>
          </h4>
          <pre class="article-content" v-text="article.content"></pre>
        </div>
        <div class="article-notify">
          <input type="checkbox" v-model="notify" id="notify" />
          <label for="notify" class="notify" @click="handleNotify">
            開啟文章通知
          </label>
        </div>
        <div
          class="article-comment"
          v-for="(item, index) in replyList"
          :key="item.key"
        >
          <div
            class="article-floor"
            v-text="replyList.length - index + 'F'"
          ></div>
          <div class="article-comment-main">
            <h4 class="article-subTitle">
              <span v-text="item.authorName"></span>
              <span v-text="item.timeStamp"></span>
              <span
                class="article-del"
                @click="handleReplyDel(item.key)"
                v-if="userID === item.author || activeAuth > 1"
              >
                <i class="icofont-ui-delete"></i>
              </span>
              <span
                :class="[
                  'article-love',
                  { active: item.loves.indexOf(userID) >= 0 },
                ]"
                v-else
              >
                <i class="icofont-thumbs-up"></i> {{ item.loveCount }}
              </span>
            </h4>
            <pre class="article-content" v-text="item"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import {
  userCheck,
  groupCheck,
  getRealData,
  getFD,
  setFD,
  delFD,
} from "../assets/config";

export default {
  name: "Article",
  data() {
    return {
      loading: true,
      article: null,
      notify: false,
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
        .then((res) => {
          this.notify = res.notify
            ? res.notify.indexOf(this.userID) >= 0
            : false;
          this.article = res;
        })
        .then(() => {
          getRealData("/comment/" + this.groupID + "/" + this.articleID).on(
            "value",
            (res) => {
              this.replyList.length = 0;
              if (!res.val()) return;
              Object.keys(res.val()).forEach((key) => {
                let temp = res.val()[key];
                temp.key = key;
                temp.loveCount = temp.loves ? temp.loves.split(",").length : 0;
                this.replyList.unshift(temp);
              });
            }
          );
        })
        .then(() => (this.loading = false));
    },
    handleNotify() {
      const path =
        "/article/" + this.groupID + "/" + this.articleID + "/notify";
      const index = this.article.notify
        ? this.article.notify.indexOf(this.userID)
        : -2;
      const temp = this.article.notify
        ? this.article.notify.split(",")
        : [this.userID];
      console.log(temp);
      if (index === -1) temp.push(this.userID);
      if (index > -1) {
        const idx = temp.indexOf(this.userID);
        temp.splice(idx, 1);
      }
      console.log(temp);
      setFD(path, temp.join());
      this.article.notify = temp.join();
    },
    handleArtDel() {
      const delFlag = confirm("確定要刪除?刪除後無法恢復資料。");
      if (!delFlag) return;
      delFD("/article/" + this.groupID + "/" + this.articleID).then(() => {
        this.handlerLogs("Delete", this.groupID, this.articleID);
        alert("刪除成功!");
        router.push("/" + this.groupID);
      });
    },
    handleReplyDel() {
      const delFlag = confirm("確定要刪除?刪除後無法恢復資料。");
      if (!delFlag) return;
      // delFD("/article/" + this.groupID + "/" + this.articleID).then(() => {
      //   this.handlerLogs("Delete", this.groupID, this.articleID);
      //   alert("刪除成功!");
      //   router.push("/" + this.groupID);
      // });
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
  &-main {
    margin: 1rem 0;
  }
  &-title {
    padding: min(1.5vw, 0.5rem);
    font-size: min(5vw, 2.5rem);
    color: $c_dark;
    background-color: #43b883;
  }
  &-subTitle {
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
  &-del,
  &-love {
    flex: 1;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_danger;
    }
  }
  &-love {
    &:hover,
    &.active {
      color: $c_light;
      background-color: $c_primary;
    }
  }
  &-content {
    max-width: 100%;
    padding: min(1.5vw, 0.5rem);
    font-size: min(4vw, 1.5rem);
    line-height: min(5vw, 2rem);
    border: 2px solid $c_secondary;
    box-sizing: border-box;
    overflow-x: auto;
  }
  &-notify {
    text-align: right;
    margin-bottom: 1rem;
  }
  &-comment {
    display: flex;
    align-items: stretch;
    margin-top: 0.3rem;
    &-main {
      width: 0;
      flex: 1;
    }
  }
  &-floor {
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
