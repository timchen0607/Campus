<template>
  <div class="newArticle main">
    <div class="container">
      <div class="loading" v-if="loading">
        <div class="skeleton loading-input"></div>
        <div class="skeleton loading-text"></div>
        <div class="skeleton loading-input"></div>
        <div class="lightBox">
          <div class="skeleton loading-img"></div>
          <div class="skeleton loading-img"></div>
          <div class="skeleton loading-img"></div>
          <div class="skeleton loading-img"></div>
        </div>
        <div class="skeleton loading-btn"></div>
      </div>
      <router-link class="btn" v-if="!loading" :to="'/' + groupID">
        <i class="icofont-swoosh-left"></i>返回文章列表
      </router-link>
      <div class="newArt" v-if="!loading">
        <p class="newArt-label">文章類型(必填)</p>
        <div class="newArt-type" v-for="(item, index) in types" :key="index">
          <span
            :class="['btn', { active: newArtType === item }]"
            v-if="index < 2 || activeAuth > 1"
            @click="newArtType = item"
            v-text="item"
          ></span>
        </div>
        <p class="newArt-label">標題(必填)</p>
        <input
          type="text"
          class="newArt-input"
          maxlength="30"
          v-model="newArtTitle"
        />
        <p class="newArt-label">內文(必填)</p>
        <textarea
          cols="30"
          rows="10"
          maxlength="500"
          class="newArt-input"
          v-model="newArtContent"
        ></textarea>
        <p
          class="newArt-label"
          v-text="'上傳圖片(非必要，上限 ' + limit + ' 張)'"
        ></p>
        <input
          type="file"
          class="newArt-input"
          multiple="multiple"
          accept="image/*"
        />
        <p class="newArt-label">圖片預覽(施工中)</p>
        <div class="lightBox">
          <a href="#pic01" class="newArt-thumb">
            <img src="../assets/error.png" />
          </a>
          <a href="#pic02" class="newArt-thumb">
            <img src="../assets/logo.png" />
          </a>
          <a href="#pic03" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/fogIDC.png" />
          </a>
          <a href="#pic04" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/ZU0vln.png" />
          </a>
          <a href="#pic05" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/v2i65J.png" />
          </a>
          <a href="#pic06" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/EB69Xj.png" />
          </a>
          <a href="#pic07" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/Rn1Zji.png" />
          </a>
          <a href="#pic08" class="newArt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/H1zVUS.png" />
          </a>
        </div>
        <div class="newArt-img">
          <a href="#" id="pic01">
            <img src="../assets/error.png" />
          </a>
          <a href="#" id="pic02">
            <img src="../assets/logo.png" />
          </a>
          <a href="#" id="pic03">
            <img src="https://upload.cc/i1/2019/11/09/fogIDC.png" />
          </a>
          <a href="#" id="pic04">
            <img src="https://upload.cc/i1/2019/11/09/ZU0vln.png" />
          </a>
          <a href="#" id="pic05">
            <img src="https://upload.cc/i1/2019/11/09/v2i65J.png" />
          </a>
          <a href="#" id="pic06">
            <img src="https://upload.cc/i1/2019/11/09/EB69Xj.png" />
          </a>
          <a href="#" id="pic07">
            <img src="https://upload.cc/i1/2019/11/09/Rn1Zji.png" />
          </a>
          <a href="#" id="pic08">
            <img src="https://upload.cc/i1/2019/11/09/H1zVUS.png" />
          </a>
        </div>
        <button class="btn newArt-submit" @click="release">發布</button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { userCheck, groupCheck, setFD, getDT } from "../assets/config";

export default {
  name: "NewArticle",
  data() {
    return {
      loading: true,
      types: ["請益", "分享", "作業", "公告"],
      newArtType: "請益", // 新文章類型
      newArtTitle: "", // 新文章標題
      newArtContent: "", // 新文章內容
      limit: 4, // 圖片上限
    };
  },
  computed: {
    groupID() {
      return this.$route.params.groupID;
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
        this.loading = false;
      })
      .catch((path) => router.replace(path));
  },
  methods: {
    release() {
      if (!this.newArtTitle.trim() || !this.newArtContent.trim()) {
        alert("標題與內容皆不可為空!");
        return;
      }
      if (this.newArtTitle.length > 30 || this.newArtContent.length > 500) {
        alert("標題或內容長度超過上限!");
        return;
      }
      const newArtFlag = confirm("確定要發布?文章發布後不可修改。");
      if (!newArtFlag) return;
      let content = this.newArtContent;
      while (content.indexOf("\n\n\n") > -1) {
        content = content.replaceAll("\n\n\n", "\n\n");
      }
      const obj = {
        author: this.userID,
        authorName: this.userName,
        content: content,
        notify: this.userID,
        reply: 0,
        timeStamp: getDT(),
        title: this.newArtTitle,
        type: this.newArtType,
      };
      setFD("/article/" + this.groupID, obj)
        .then((res) => this.handlerLogs("Release", this.groupID, res.key))
        .then(() => router.push("/" + this.groupID));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.loading {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  &-input {
    height: 2.5rem;
    margin: 1rem 0;
  }
  &-text {
    height: 10rem;
    margin: 1rem 0;
  }
  &-img {
    width: 130px;
    height: 130px;
    margin: 0.5rem;
  }
  &-btn {
    width: 150px;
    height: 2.5rem;
    margin: 1rem auto;
  }
}
.newArt {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  &-label {
    margin: min(3vw, 1rem) 0 min(2vw, 0.5rem);
    font-size: min(1.2rem, 3vw);
    text-align-last: left;
  }
  &-type {
    display: inline-block;
  }
  &-input {
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
  &-thumb {
    width: 150px;
    height: 150px;
    display: block;
    padding: 0.5rem;
    box-sizing: border-box;
    & > img {
      width: 100%;
      height: 100%;
      object-position: center center;
      object-fit: cover;
    }
    &:hover {
      background-color: $c_secondary-light;
    }
  }
  &-img > a {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000066;
    z-index: -1;
    transition: opacity 0.5s;
    opacity: 0;
    &:target {
      z-index: 101;
      opacity: 1;
    }
    & > img {
      max-width: 100%;
      max-height: 100%;
      object-position: center center;
      object-fit: contain;
    }
  }
  &-submit {
    min-width: 150px;
    margin: min(2vw, 1rem) 0;
  }
}
.lightBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
