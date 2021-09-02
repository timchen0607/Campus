<template>
  <div class="NewComment main">
    <div class="container">
      <div class="loading" v-if="loading">
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
      <div class="main-control" v-if="!loading">
        <router-link class="btn" :to="'/' + groupID + '/' + articleID">
          <i class="icofont-swoosh-left"></i>返回文章內容
        </router-link>
        <button class="btn" @click="handleTips">
          <i class="icofont-paper"></i> Tips
        </button>
      </div>
      <div class="newCmt" v-if="!loading">
        <p class="newCmt-label">回覆內容(必填)</p>
        <textarea
          cols="30"
          rows="10"
          maxlength="500"
          class="newCmt-input"
          v-model="newCmt"
        ></textarea>
        <p
          class="newCmt-label"
          v-text="'上傳圖片(非必要，上限 ' + limit + ' 張)'"
        ></p>
        <input
          type="file"
          class="newCmt-input"
          multiple="multiple"
          accept="image/*"
        />
        <p class="newCmt-label">圖片預覽(施工中)</p>
        <div class="lightBox">
          <a href="#pic01" class="newCmt-thumb">
            <img src="../assets/error.png" />
          </a>
          <a href="#pic02" class="newCmt-thumb">
            <img src="../assets/logo.png" />
          </a>
          <a href="#pic03" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/fogIDC.png" />
          </a>
          <a href="#pic04" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/ZU0vln.png" />
          </a>
          <a href="#pic05" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/v2i65J.png" />
          </a>
          <a href="#pic06" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/EB69Xj.png" />
          </a>
          <a href="#pic07" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/Rn1Zji.png" />
          </a>
          <a href="#pic08" class="newCmt-thumb">
            <img src="https://upload.cc/i1/2019/11/09/H1zVUS.png" />
          </a>
        </div>
        <div class="newCmt-img">
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
        <button class="btn newCmt-submit" @click="reply">送出</button>
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
  getFD,
  setFD,
  pushFD,
  getDT,
} from "../assets/config";

export default {
  name: "NewComment",
  data() {
    return {
      loading: true,
      newCmt: "", // 新回覆內容
      limit: 4, // 圖片上限
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
        this.loading = false;
      })
      .catch((path) => router.replace(path));
  },
  methods: {
    handleTips() {
      swal(
        "Tips",
        "可以將程式碼貼至 CodePile 或 CodePen，方便其他人閱覽或編輯。",
        "info",
        {
          buttons: {
            codepile: {
              text: "CodePile",
              value: "codepile",
            },
            codepen: {
              text: "CodePen",
              value: "codepen",
            },
            OK: true,
          },
        }
      ).then((res) => {
        if (res === "codepile") window.open("https://www.codepile.net/");
        if (res === "codepen") window.open("https://codepen.io/");
      });
    },
    reply() {
      if (!this.newCmt.trim()) {
        swal("內容不可為空!", "", "error");
        return;
      }
      if (this.newCmt.length > 500) {
        swal("標題或內容長度超過上限!", "", "error");
        return;
      }
      swal({
        title: "確定要回覆?送出後不可修改。",
        icon: "info",
        buttons: true,
        dangerMode: true,
      }).then((flag) => {
        if (!flag) return;
        let comment = this.newCmt;
        while (comment.indexOf("\n\n\n") > -1)
          comment = comment.replaceAll("\n\n\n", "\n\n");
        const obj = {
          author: this.userID,
          authorName: this.userName,
          content: comment,
          likes: "",
          timeStamp: getDT(),
        };
        pushFD("/comment/" + this.groupID + "/" + this.articleID, obj)
          .then((res) => {
            this.handlerLogs("Reply", this.groupID, this.articleID, res.key);
            return getFD(`/article/${this.groupID}/${this.articleID}/reply`);
          })
          .then((res) =>
            setFD(
              `/article/${this.groupID}/${this.articleID}/reply`,
              (res += 1)
            )
          )
          .then(() => router.push("/" + this.groupID + "/" + this.articleID));
      });
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

.newCmt {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
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
