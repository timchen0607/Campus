<template>
  <div class="article" v-if="article">
    <button class="article_back" @click="goArtList">&#8630;返回文章列表</button>
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
    <div
      class="article_comment"
      v-for="(item, key, index) in article.comment"
      :key="key"
    >
      <div class="article_floor" v-text="index + 1 + 'F'"></div>
      <div class="article_comment_main">
        <h4 class="article_subTitle">
          <span v-text="item.authorName"></span>
          <span v-text="item.timeStamp"></span>
          <span
            class="article_del"
            @click="delArticle(articleID, key)"
            v-if="userID === item.author || auth > 1"
          >
            &#128465;
          </span>
        </h4>
        <pre class="article_content" v-text="item.content"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";

export default {
  name: "Article",
  props: {
    userID: String,
    groupID: String,
    articleID: String,
    article: Object,
    auth: Number,
    delArticle: Function,
  },
  methods: {
    goArtList() {
      router.push("/" + this.groupID + "/");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

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
    padding: min(1.5vw, 0.5rem);
    font-size: min(4vw, 1.5rem);
    line-height: min(5vw, 2rem);
    border: 2px solid $c_secondary;
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
