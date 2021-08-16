<template>
  <div class="home">
    <div v-for="item in article" :key="item.key">
      <router-link :to="'/' + groupID + '/' + item.key">
        <div>
          <div v-text="item.reply"></div>
          <div>
            <div v-text="item.title"></div>
            <div>
              <div v-text="item.authorName"></div>
              <div v-text="item.timeStamp"></div>
            </div>
            <div>&#128465;</div>
          </div>
        </div>
      </router-link>
    </div>
    {{}}
    <hr />
    {{ article[0] }}
    <hr />
    {{ logs }}
    <hr />
    {{ this.$route.params.groupID }}
    <hr />
    {{ this.$route.params.articleID }}
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { sortDT } from "../assets/config";

export default {
  name: "Home",
  data() {
    return {
      article: [],
      logs: [],
    };
  },
  computed: {
    groupID() {
      return this.userID ? this.$route.params.groupID : null;
    },
  },
  props: {
    userID: String,
    setGroupInfo: Function,
  },
  created() {
    firebase
      .database()
      .ref("/group/" + this.groupID)
      .on("value", (res) => this.loadData(res.val()));
  },
  watch: {
    groupID: async function() {
      firebase
        .database()
        .ref("/group/" + this.groupID)
        .on("value", (res) => this.loadData(res.val()));
    },
  },
  methods: {
    loadData(result) {
      if (!result) return;
      this.article.length = 0;
      this.logs.length = 0;
      if (result.article) {
        this.data = JSON.parse(JSON.stringify(result.article));
        Object.keys(result.article).forEach((key) => {
          let temp = result.article[key];
          temp.key = key;
          temp.reply = temp.comment ? Object.keys(temp.comment).length : 0;
          delete temp.comment;
          delete temp.logs;
          this.article.push(temp);
        });
        this.article = sortDT(this.article);
      }
      if (result.logs) {
        this.logs = JSON.parse(JSON.stringify(result.logs));
      }
      this.setGroupInfo(result.name);
    },
  },
};
</script>
