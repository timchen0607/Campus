<template>
  <div class="signIn" v-if="!loading">
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
    <button class="btn locked" v-if="locked">登入中...</button>
    <button class="btn" @click="handleSignIn" v-else>登入</button>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import router from "../router";
import { getFD } from "../assets/config";

export default {
  name: "SignIn",
  data() {
    return {
      loading: false,
      email: "", // 會員信箱
      password: "", // 會員密碼
      keepOn: false, // 保持登入狀態
      alert: "", // 錯誤提示
      signInCount: 0, //登入次數
      locked: false, // 鎖定登入按鈕
      prevRoute: null,
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
      this.loading = true;
      this.alert = "";
      this.locked = true;
      let auth = null;
      getFD("/member/" + uid)
        .then((res) => {
          this.handlerData("userID", uid);
          this.handlerData("account", this.email);
          this.handlerData("userName", res.name);
          auth = res.auth;
          return getFD("/group/");
        })
        .then((res) => {
          const temp = [];
          Object.keys(auth).forEach((key) => {
            if (auth[key] > 0)
              temp.push({ key: key, name: res[key], auth: auth[key] });
          });
          this.handlerData("groupList", temp);
          if (this.prevRoute.path !== "/") {
            router.replace(this.prevRoute);
          } else {
            router.replace("/" + Object.keys(auth)[0]);
          }
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
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
  .btn {
    width: min(300px, 60vw);
    margin: 1rem 0;
  }
}
</style>
