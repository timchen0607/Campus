<template>
  <div class="signIn">
    <img src="../assets/logo.png" alt="Campus Logo" />
    <div class="signIn-inputgroup">
      <input type="email" class="signIn-input" v-model="email" ref="email" />
      <p :class="['signIn-placeholder', { 'signIn-active': email }]">
        輸入您的學號
      </p>
    </div>
    <div class="signIn-inputgroup">
      <input
        type="password"
        class="signIn-input"
        v-model="password"
        @keyup.enter="handleSignIn"
        ref="password"
      />
      <p :class="['signIn-placeholder', { 'signIn-active': password }]">
        輸入您的密碼
      </p>
    </div>
    <div class="signIn-inputgroup">
      <input type="checkbox" v-model="keepOn" id="keepOn" />
      <label for="keepOn">保持登入狀態(請勿在公用電腦使用)</label>
    </div>
    <p class="signIn-alert" v-if="alert" v-text="alert"></p>
    <button class="signIn-btn signIn-btn-locked" v-if="locked">
      登入中...
    </button>
    <button class="signIn-btn" @click="handleSignIn" v-else>
      登入
    </button>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import router from "../router";

export default {
  name: "SignIn",
  data() {
    return {
      alert: "", // 錯誤提示
      signInCount: 0, //登入次數
      locked: false, // 鎖定登入按鈕
      email: "", // 會員信箱
      password: "", // 會員密碼
      keepOn: false,
      FA: firebase.auth(),
    };
  },
  computed: {
    FAP() {
      return this.keepOn
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION;
    },
  },
  props: { handlerData: Function },
  created() {
    this.FA.onAuthStateChanged((user) => {
      if (user) this.handlePersonalInfo(user.uid);
    });
  },
  methods: {
    handleSignIn() {
      if (this.FA.currentUser) {
        this.FA.signOut();
        return;
      }
      if (this.signInCount > 5) {
        this.alert = "登入失敗!無此帳號或密碼錯誤!";
        this.password = "";
        this.$refs.password.focus();
        this.locked = false;
        return;
      }
      if (this.email.length < 6) {
        this.alert = "請輸入您的學號!";
        this.$refs.email.focus();
        return;
      }
      if (this.password.length < 6) {
        this.alert = "請輸入您的密碼!";
        this.$refs.password.focus();
        return;
      }
      if (this.email.indexOf("@") < 0) this.email += "@gm.nfu.edu.tw";
      this.locked = true;
      this.signInCount += 1;
      this.FA.setPersistence(this.FAP).then(() => {
        return this.FA.signInWithEmailAndPassword(this.email, this.password)
          .then((res) => this.handlePersonalInfo(res.user.uid))
          .catch(() => {
            this.alert = "登入失敗!無此帳號或密碼錯誤!";
            this.password = "";
            this.$refs.password.focus();
            this.locked = false;
          });
      });
    },
    handlePersonalInfo(uid) {
      this.alert = "";
      this.locked = true;
      firebase
        .database()
        .ref("/member/" + uid)
        .once("value", (res) => {
          const auth = res.val().auth;
          this.handlerData("userID", uid);
          this.handlerData("account", this.email);
          this.handlerData("userName", res.val().name);
          firebase
            .database()
            .ref("/group/")
            .once("value", (r) => {
              const temp = [];
              Object.keys(auth).forEach((key) => {
                if (auth[key] > 0) temp.push({ key: key, name: r.val()[key] });
              });
              this.handlerData("groupList", temp);
            });
          const groupID = this.$route.params.groupID || Object.keys(auth)[0];
          const articleID = this.$route.params.articleID || "";
          router.replace("/" + groupID + "/" + articleID);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.signIn {
  padding: 2rem 1rem;
  text-align: center;
  &-inputgroup {
    position: relative;
    width: min(500px, 90vw);
    margin: 1rem auto;
  }
  &-input {
    width: min(500px, 90vw);
    padding: 12px;
    font-size: 1.5rem;
    border: 1px solid $c_secondary;
    border-radius: 10px;
    background-color: transparent;
    box-sizing: border-box;
    &:focus {
      padding: 10px;
      border: 3px solid $c_primary;
      outline: none;
    }
  }
  &-placeholder {
    position: absolute;
    top: 50%;
    left: 10px;
    color: $c_secondary;
    font-size: 1.5rem;
    transition: 0.2s;
    transform: translateY(-50%);
    z-index: -1;
  }
  &-input:focus + &-placeholder,
  &-active {
    top: 0px;
    left: 20px;
    padding: 0 10px;
    font-size: 1.1rem;
    background-color: $c_light;
    color: $c_primary;
    z-index: 1;
  }
  &-alert {
    font-size: 1.5rem;
    color: $c_danger;
    &::before {
      content: "※";
    }
  }
  &-btn {
    display: block;
    width: min(500px, 90vw);
    margin: 1rem auto;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: $c_light;
    background-color: $c_danger;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    &-locked {
      background-color: $c_secondary;
      cursor: wait;
    }
  }
}
</style>
