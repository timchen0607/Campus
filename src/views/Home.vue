<template>
  <div class="home main">
    <div class="article" v-if="!!Object.keys(article).length && !newArtShow">
      <button class="article_back" @click="goArtList">
        &#8630;返回文章列表
      </button>
      <h3 class="article_title" v-text="article.title"></h3>
      <h4 class="article_subTitle">
        <span v-text="article.authorName"></span>
        <span v-text="article.timeStamp"></span>
        <span
          class="article_del"
          @click="delArticle(articleID)"
          v-if="userID === article.author || auth > 1"
        >
          &#128465;
        </span>
      </h4>
      <pre class="article_content" v-text="article.content"></pre>
      <div class="article_comment">
        <div
          class="article_floor"
          v-text="article.comment ? article.comment.length + 1 + 'F' : '1F'"
        ></div>
        <div class="article_comment_main">
          <h4 class="article_subTitle">
            <span v-text="userName"></span>
            <span class="article_del" @click="newComment">
              點我送出回覆
            </span>
          </h4>
          <textarea
            cols="30"
            rows="3"
            maxlength="500"
            class="article_content new"
            placeholder="請於此處輸入回覆內容"
            v-model="newArtComment"
          ></textarea>
        </div>
      </div>
      <div
        class="article_comment"
        v-for="(item, index) in article.comment"
        :key="item.key"
      >
        <div
          class="article_floor"
          v-text="article.comment.length - index + 'F'"
        ></div>
        <div class="article_comment_main">
          <h4 class="article_subTitle">
            <span v-text="item.authorName"></span>
            <span v-text="item.timeStamp"></span>
            <span
              class="article_del"
              @click="delArticle(articleID, item.key)"
              v-if="userID === item.author || auth > 1"
            >
              &#128465;
            </span>
          </h4>
          <pre class="article_content" v-text="item.content"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase/app";
// import "firebase/auth";
// import router from "../router";
// import { getDT, sortDT } from "../assets/config";

export default {
  name: "Home",
  data() {
    return {
      articleList: [],
      article: {},
      auth: 0,
    };
  },
  computed: {
    groupID() {
      return this.userID ? this.$route.params.groupID : null;
    },
    articleID() {
      return this.userID ? this.$route.params.articleID : null;
    },
  },
  props: {
    userID: String,
    userName: String,
    groupMap: Object,
    setGroupInfo: Function,
  },
  // created() {
  //   // if (!this.groupID) return;
  //   // this.handleGroupID();
  //   // this.pushLogs("Home", "View");
  //   // if (!this.articleID) return;
  //   // this.handleArticleID();
  //   // this.pushLogs(this.articleID, "View");
  // },
  // watch: {
  //   groupID: async function() {
  //     this.handleGroupID();
  //     this.pushLogs("Home", "View");
  //   },
  //   articleID: async function() {
  //     this.handleArticleID();
  //     this.pushLogs(this.articleID, "View");
  //   },
  // },
  // methods: {
  //   handleArticleID() {
  //     firebase
  //       .database()
  //       .ref("/article/" + this.groupID + "/" + this.articleID)
  //       .on("value", (res) => {
  //         this.newArtComment = "";
  //         this.article = {};
  //         if (!res.val()) return;
  //         this.article = res.val();
  //         if (!this.article.comment) return;
  //         let temp = this.article.comment;
  //         this.article.comment = [];
  //         Object.keys(temp).forEach((key) => {
  //           temp[key].key = key;
  //           this.article.comment.unshift(temp[key]);
  //         });
  //       });
  //   },
  //   newComment() {
  //     if (!this.newArtComment.trim()) {
  //       alert("內容不可為空!");
  //       return;
  //     }
  //     if (this.newArtComment.length > 500) {
  //       alert("內容長度超過上限!");
  //       return;
  //     }
  //     const newArtFlag = confirm("確定要回覆?回覆後不可修改。");
  //     if (!newArtFlag) return;
  //     let content = this.newArtComment;
  //     while (content.indexOf("\n\n\n") > -1) {
  //       content = content.replaceAll("\n\n\n", "\n\n");
  //     }
  //     const obj = {
  //       author: this.userID,
  //       authorName: this.userName,
  //       content: content,
  //       timeStamp: getDT(),
  //       type: "text",
  //     };
  //     const newReply = firebase
  //       .database()
  //       .ref("/article/" + this.groupID + "/" + this.articleID + "/comment")
  //       .push(obj);
  //     this.newArtComment = "";
  //     this.pushLogs(this.articleID + "/" + newReply.key, "Reply");
  //   },
  //   delArticle(aID, key = null) {
  //     const delFlag = confirm("確定要刪除?刪除後無法恢復此資料。");
  //     if (!delFlag) return;
  //     let url = "/article/" + this.groupID + "/" + aID;
  //     url += key ? "/comment/" + key : "";
  //     firebase
  //       .database()
  //       .ref(url)
  //       .remove();
  //     const page = key ? this.articleID + "/" + key : this.articleID;
  //     this.pushLogs(page, "Delete");
  //     if (key) return;
  //     router.replace("/" + this.groupID);
  //   },
  // },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.article {
  padding: min(2vw, 1rem);
  &_back {
    margin-bottom: min(1rem, 1vw);
    padding: 0.3rem 1.5rem;
    font-size: min(1.2rem, 3vw);
    border: none;
    border-bottom: 4px solid $c_danger-dark;
    outline: none;
    transition: background-color 0.5s;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_danger-dark;
    }
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
