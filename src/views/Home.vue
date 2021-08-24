<template>
  <div class="home">
    <div class="container">
      <div class="controller" v-if="!articleID || !article">
        <button
          class="controller_btn controller_left"
          v-if="newArtShow"
          @click="newArtShow = !newArtShow"
        >
          &#8630;返回文章列表
        </button>
        <button class="controller_btn" v-if="auth > 2">
          📜使用紀錄
        </button>
        <button
          class="controller_btn"
          v-if="!newArtShow"
          @click="newArtShow = !newArtShow"
        >
          ✍發布文章
        </button>
      </div>
      <div class="newArticle" v-if="(!articleID || !article) && newArtShow">
        <p class="newArticle_label">標題</p>
        <input
          type="text"
          class="newArticle_title"
          maxlength="30"
          v-model="newArtTitle"
        />
        <p class="newArticle_label">內文</p>
        <textarea
          cols="30"
          rows="5"
          maxlength="500"
          class="newArticle_content"
          v-model="newArtContent"
        ></textarea>
        <button class="controller_btn newArticle_btn" @click="newArticle">
          發布
        </button>
      </div>
      <div class="list" v-if="!articleID || !article">
        <div v-for="item in articleList" :key="item.key">
          <router-link class="list_link" :to="'/' + groupID + '/' + item.key">
            <div
              :class="{
                list_reply: true,
                l1: item.reply < 10,
                l2: item.reply >= 10,
                l3: item.reply >= 30,
                l4: item.reply >= 50,
              }"
              v-text="item.reply"
            ></div>
            <div class="list_main">
              <div class="list_title" v-text="item.title"></div>
              <div class="list_subTitle">
                <span v-text="item.authorName"></span>
                <span v-text="item.timeStamp"></span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="article" v-if="articleID && article">
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
              <span></span>
              <span class="article_del">
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
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import router from "../router";
import { getDT, sortDT } from "../assets/config";

export default {
  name: "Home",
  data() {
    return {
      articleList: [],
      article: {},
      auth: 0,
      newArtShow: false,
      newArtTitle: "",
      newArtContent: "",
      newArtComment: "",
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
    setGroupInfo: Function,
  },
  created() {
    if (!this.groupID) return;
    this.handleGroupID();
    if (!this.articleID) return;
    this.handleArticleID();
  },
  watch: {
    groupID: async function() {
      this.handleGroupID();
    },
    articleID: async function() {
      this.handleArticleID();
    },
  },
  methods: {
    handleGroupID() {
      firebase
        .database()
        .ref("/article/" + this.groupID)
        .on("value", (res) => {
          this.articleList.length = 0;
          this.setGroupInfo(this.groupID);
          if (!res.val()) return;
          Object.keys(res.val()).forEach((key) => {
            let temp = res.val()[key];
            temp.key = key;
            temp.reply = temp.comment ? Object.keys(temp.comment).length : 0;
            delete temp.comment;
            delete temp.logs;
            this.articleList.push(temp);
          });
          this.articleList = sortDT(this.articleList);
          firebase
            .database()
            .ref("/member/" + this.userID + "/auth/" + this.groupID)
            .on("value", (res) => (this.auth = res.val()));
        });
    },
    handleArticleID() {
      firebase
        .database()
        .ref("/article/" + this.groupID + "/" + this.articleID)
        .on("value", (res) => {
          this.article = res.val();
          if (!res.val() || !this.article.comment) return;
          let temp = this.article.comment;
          this.article.comment = [];
          Object.keys(temp).forEach((key) => {
            temp[key].key = key;
            this.article.comment.unshift(temp[key]);
          });
        });
    },
    pushLogs() {},
    newArticle() {
      if (!this.newArtTitle.trim() || !this.newArtContent.trim()) {
        alert("標題與內容皆不可為空!");
        return;
      }
      if (this.newArtTitle.length > 30 || this.newArtContent.length > 500) {
        alert("標題或內容超過上限!");
        return;
      }
      const newArtFlag = confirm("確定要發布?文章發布後不可修改。");
      if (!newArtFlag) return;
      const obj = {
        author: this.userID,
        authorName: this.userName,
        content: this.newArtContent,
        timeStamp: getDT(),
        title: this.newArtTitle,
        type: "text",
      };
      firebase
        .database()
        .ref("/article/" + this.groupID)
        .push(obj);
      this.newArtShow = false;
      this.newArtTitle = "";
      this.newArtContent = "";
      // this.pushLogs();
    },
    delArticle(aID, key = null) {
      const delFlag = confirm("確定要刪除?刪除後無法恢復此資料。");
      if (!delFlag) return;
      let url = "/article/" + this.groupID + "/" + aID;
      url += key ? "/comment/" + key : "";
      firebase
        .database()
        .ref(url)
        .remove();
      // this.pushLogs();
      if (key) return;
      router.replace("/" + this.groupID);
    },
    goArtList() {
      router.push("/" + this.groupID + "/");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";
.home {
  position: relative;
  min-height: calc(100vh - 72px);
  background-color: $c_primary;
  .container {
    min-height: inherit;
    padding: min(1rem, 1vw);
    background-color: $c_light;
  }
}

.controller {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: min(2vw, 1rem);
  &_btn {
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
  &_left {
    margin-right: auto;
  }
}

.newArticle {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  &_label {
    margin-top: min(2vw, 1rem);
    font-size: min(1.2rem, 3vw);
    text-align-last: left;
  }
  &_title,
  &_content {
    width: 100%;
    padding: 0.5rem;
    font-size: min(1.2rem, 3vw);
    background-color: $c_secondary-light;
    border: none;
    border-bottom: 3px solid $c_danger-dark;
    box-sizing: border-box;
    outline: none;
    resize: none;
  }
  &_btn {
    min-width: 150px;
    margin-top: min(2vw, 1rem);
  }
}

.list {
  margin-top: min(2vw, 1rem);
  &_link {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: min(2vw, 1rem);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background 0.5s;
    &:hover {
      background-color: $c_secondary-light;
    }
  }
  &_reply {
    width: min(15vw, 100px);
    margin-right: min(2vw, 1rem);
    padding: min(3vw, 1rem) 0;
    color: $c_light;
    font-size: min(10vw, 3rem);
    text-align: center;
    border-radius: 5px;
    &.l1 {
      background-color: $c_warning;
    }
    &.l2 {
      background-color: $c_danger;
    }
    &.l3 {
      background-color: $c_danger-dark;
    }
    &.l4 {
      background-color: $c_dark;
    }
  }
  &_main {
    width: 0;
    flex: 1;
  }
  &_title {
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(5vw, 2rem);
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: $c_success;
    overflow: hidden;
  }
  &_subTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(3vw, 1rem);
    background-color: $c_secondary;
  }
  &_del {
    margin-right: min(2vw, 1rem);
    padding: min(2vw, 1rem);
    font-size: min(10vw, 3rem);
    color: $c_danger;
    border: 1px solid $c_danger;
    border-radius: 5px;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      color: $c_light;
      background-color: $c_danger;
    }
  }
}

.article {
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
