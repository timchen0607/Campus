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
      <div class="newArt" v-else>
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
        <p class="newArt-label">圖片預覽</p>
        <div class="newArt_lightBoxList">
          <a href="#pic01">
            <img src="../assets/error.png" />
          </a>
          <a href="#pic02">
            <img src="../assets/logo.png" />
          </a>
          <a href="#pic03">
            <img src="https://upload.cc/i1/2019/11/09/fogIDC.png" />
          </a>
          <a href="#pic04">
            <img src="https://upload.cc/i1/2019/11/09/ZU0vln.png" />
          </a>
          <a href="#pic05">
            <img src="https://upload.cc/i1/2019/11/09/v2i65J.png" />
          </a>
          <a href="#pic06">
            <img src="https://upload.cc/i1/2019/11/09/EB69Xj.png" />
          </a>
          <a href="#pic07">
            <img src="https://upload.cc/i1/2019/11/09/Rn1Zji.png" />
          </a>
          <a href="#pic08">
            <img src="https://upload.cc/i1/2019/11/09/H1zVUS.png" />
          </a>
        </div>
        <div class="newArt_lightBoxImg">
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
        <button class="controller_btn newArt_btn" @click="newArticle">
          發布
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase/app";
import { userCheck, groupCheck } from "../assets/config";

export default {
  name: "NewArticle",
  data() {
    return {
      loading: true,
      newArtTitle: "", // 新文章標題
      newArtContent: "", // 新文章內容
      limit: 4, // 圖片上限
    };
  },
  props: {
    userID: String,
    groupList: Array,
  },
  created() {
    userCheck(this.userID);
    groupCheck(this.$route.params.groupID, this.groupList);
    this.loading = false;
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
  &-label {
    margin: min(3vw, 1rem) 0 min(2vw, 0.5rem);
    font-size: min(1.2rem, 3vw);
    text-align-last: left;
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
  &_lightBoxList {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & > a {
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
  }
  &_lightBoxImg > a {
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
  &_btn {
    min-width: 150px;
    margin-top: min(2vw, 1rem);
  }
}
.lightBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
