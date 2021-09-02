<template>
  <div class="article main">
    <div class="container">
      <div class="loading" v-if="loading">
        <div class="article-main">
          <h3 class="article-title"></h3>
          <h4 class="article-subTitle skeleton"></h4>
          <pre class="article-content"></pre>
        </div>
        <div class="article-comment popular">
          <div class="article-floor popular"></div>
          <div class="article-comment-main">
            <h4 class="article-subTitle skeleton"></h4>
            <pre class="article-content"></pre>
          </div>
        </div>
        <div class="article-comment" v-for="x in 5" :key="x">
          <div class="article-floor skeleton"></div>
          <div class="article-comment-main">
            <h4 class="article-subTitle skeleton"></h4>
            <pre class="article-content"></pre>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="main-control">
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
            <span class="article-date" v-text="article.timeStamp"></span>
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
        <div class="main-control">
          <span v-if="popCmt.likeCnt >= 5">熱門留言</span>
          <span></span>
          <div class="article-notify">
            <input type="checkbox" v-model="notify" id="notify" />
            <label for="notify" @click="handleNotify"> 開啟文章通知</label>
          </div>
        </div>
        <div class="article-comment popular" v-if="popCmt.likeCnt >= 5">
          <div class="article-floor popular" v-text="popCmt.index"></div>
          <div class="article-comment-main">
            <h4 class="article-subTitle">
              <span v-text="popCmt.authorName"></span>
              <span class="article-date" v-text="popCmt.timeStamp"></span>
              <span
                class="article-del"
                @click="handleCmtDel(popCmt.key)"
                v-if="userID === popCmt.author || activeAuth > 1"
              >
                <i class="icofont-ui-delete"></i>
              </span>
              <span
                :class="['article-like', { active: popCmt.liked }]"
                @click="handleLikes(popCmt.key, popCmt.likes)"
                v-else
              >
                <i class="icofont-thumbs-up"></i> {{ popCmt.likeCnt }}
              </span>
            </h4>
            <pre class="article-content" v-text="popCmt.content"></pre>
          </div>
        </div>
        <div class="article-comment" v-for="item in cmtList" :key="item.key">
          <div class="article-floor" v-text="item.index"></div>
          <div class="article-comment-main">
            <h4 class="article-subTitle">
              <span v-text="item.authorName"></span>
              <span class="article-date" v-text="item.timeStamp"></span>
              <span
                class="article-del"
                @click="handleCmtDel(item.key)"
                v-if="userID === item.author || activeAuth > 1"
              >
                <i class="icofont-ui-delete"></i>
              </span>
              <span
                :class="['article-like', { active: item.liked }]"
                @click="handleLikes(item.key, item.likes)"
                v-else
              >
                <i class="icofont-thumbs-up"></i> {{ item.likeCnt }}
              </span>
            </h4>
            <pre class="article-content" v-text="item.content"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import swal from "sweetalert";
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
      article: null, // 文章內容
      notify: false, // 是否接收通知
      notifyCnt: 0, // 通知狀態修改次數
      lastLiked: "", // 上個喜歡的留言
      likedCnt: 0, // 重複點擊喜歡次數
      cmtList: [], // 回覆列表
      popCmt: { likeCnt: 0 }, // 最受歡迎回覆
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
      getFD("/article/" + this.groupID + "/" + this.articleID)
        .then((res) => {
          if (!res) throw new Error();
          this.handlerLogs("View", this.groupID, this.articleID);
          console.log();
          this.notify = res.notify
            ? res.notify.indexOf(this.userID) >= 0
            : false;
          this.article = res;
        })
        .then(() => {
          getRealData("/comment/" + this.groupID + "/" + this.articleID).on(
            "value",
            (res) => {
              this.cmtList.length = 0;
              if (!res.val()) return;
              Object.keys(res.val()).forEach((key, index) => {
                let temp = res.val()[key];
                temp.key = key;
                temp.index = index + 1 + "F";
                temp.likeCnt = temp.likes ? temp.likes.split(",").length : 0;
                temp.liked =
                  temp.likes && temp.likes.indexOf(this.userID) >= 0
                    ? true
                    : false;
                if (temp.likeCnt >= 5 && temp.likeCnt >= this.popCmt.likeCnt)
                  this.popCmt = temp;
                this.cmtList.unshift(temp);
              });
            }
          );
        })
        .then(() => (this.loading = false))
        .catch(() => router.replace("/Error"));
    },
    handleNotify() {
      this.notifyCnt++;
      if (this.notifyCnt > 5) {
        swal("操作太頻繁!", "", "warning");
        return;
      }
      const TAN = this.article.notify;
      const path =
        "/article/" + this.groupID + "/" + this.articleID + "/notify";
      const index = TAN ? TAN.indexOf(this.userID) : -2;
      const temp = TAN ? TAN.split(",") : [this.userID];
      if (index === -1) temp.push(this.userID);
      if (index > -1) {
        const idx = temp.indexOf(this.userID);
        temp.splice(idx, 1);
      }
      setFD(path, temp.join());
      this.article.notify = temp.join();
      this.handlerLogs("Notify", this.groupID, this.articleID, !this.notify);
    },
    handleLikes(key, likes) {
      if (this.lastLiked === key) this.likedCnt++;
      if (this.likedCnt > 5) {
        swal("操作太頻繁!", "", "warning");
        return;
      }
      this.lastLiked = key;
      const path = `/comment/${this.groupID}/${this.articleID}/${key}/likes`;
      const index = likes ? likes.indexOf(this.userID) : -2;
      const temp = likes ? likes.split(",") : [this.userID];
      if (index === -1) temp.push(this.userID);
      if (index > -1) {
        const idx = temp.indexOf(this.userID);
        temp.splice(idx, 1);
      }
      setFD(path, temp.join());
      this.handlerLogs("Like", this.groupID, this.articleID, key);
    },
    handleArtDel() {
      swal({
        title: "確定要刪除?刪除後無法恢復資料。",
        icon: "info",
        buttons: true,
        dangerMode: true,
      }).then((flag) => {
        if (!flag) return;
        delFD("/article/" + this.groupID + "/" + this.articleID).then(() => {
          this.handlerLogs("Delete", this.groupID, this.articleID);
          swal("刪除成功!", "", "success");
          router.push("/" + this.groupID);
        });
      });
    },
    handleCmtDel(key) {
      swal({
        title: "確定要刪除?刪除後無法恢復資料。",
        icon: "info",
        buttons: true,
        dangerMode: true,
      }).then((flag) => {
        if (!flag) return;
        delFD(
          "/comment/" + this.groupID + "/" + this.articleID + "/" + key
        ).then(() => {
          this.handlerLogs("Delete", this.groupID, this.articleID, key);
          swal("刪除成功!", "", "success");
          router.push("/" + this.groupID);
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.loading .article {
  &-title {
    height: min(6.5vw, 3rem);
  }
  &-subTitle {
    height: min(4.5vw, 1.5rem);
  }
  &-content {
    height: 4rem;
  }
}

.article {
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
      flex: 1;
      padding: min(1.5vw, 0.5rem);
    }
  }
  &-date {
    flex: 2;
  }
  &-del,
  &-like {
    text-align: center;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_danger;
    }
  }
  &-like {
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
  &-comment {
    display: flex;
    align-items: stretch;
    margin-top: 0.3rem;
    &-main {
      width: 0;
      flex: 1;
    }
    &.popular {
      margin-bottom: 1.5rem;
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
    &.popular {
      background-color: $c_warning;
    }
  }
}
</style>
