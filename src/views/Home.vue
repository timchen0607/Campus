<template>
  <div class="home">
    <div class="container list">
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
    <div class="container article" v-if="articleID">
      <Article
        :userID="userID"
        :groupID="groupID"
        :articleID="articleID"
        :article="article"
        :auth="auth"
        :delArticle="delArticle"
      />
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import router from "../router";
import Article from "./Article.vue";
import { sortDT } from "../assets/config";

export default {
  name: "Home",
  data() {
    return {
      articleList: [],
      groupLogs: [],
      article: {},
      articleLogs: [],
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
    setGroupInfo: Function,
  },
  created() {
    if (this.groupID) {
      firebase
        .database()
        .ref("/article/" + this.groupID)
        .on("value", (res) => this.loadData(res.val()));
    }
    if (this.articleID) {
      firebase
        .database()
        .ref("/article/" + this.groupID + "/" + this.articleID)
        .on("value", (res) => (this.article = res.val()));
    }
  },
  components: {
    Article,
  },
  watch: {
    groupID: async function() {
      firebase
        .database()
        .ref("/article/" + this.groupID)
        .on("value", (res) => this.loadData(res.val()));
    },
    articleID: async function() {
      firebase
        .database()
        .ref("/article/" + this.groupID + "/" + this.articleID)
        .on("value", (res) => (this.article = res.val()));
    },
  },
  methods: {
    loadData(result) {
      this.articleList.length = 0;
      this.groupLogs.length = 0;
      if (!result) return;
      Object.keys(result).forEach((key) => {
        let temp = result[key];
        temp.key = key;
        temp.reply = temp.comment ? Object.keys(temp.comment).length : 0;
        delete temp.comment;
        delete temp.logs;
        this.articleList.push(temp);
      });
      this.articleList = sortDT(this.articleList);
      this.setGroupInfo(this.groupID);
      firebase
        .database()
        .ref("/member/" + this.userID + "/auth/" + this.groupID)
        .on("value", (res) => (this.auth = res.val()));
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
      // this.pushLogs("delete");
      if (key) return;
      router.replace("/" + this.groupID);
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
}
.list {
  min-height: inherit;
  padding: min(1rem, 1vw);
  background-color: $c_light;
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: inherit;
  padding: min(1rem, 1vw);
  background-color: $c_light;
}
</style>
