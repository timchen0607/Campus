<template>
  <div class="signIn">
    <img src="../assets/logo.png" alt="Campus Logo" />
    <div class="signIn-inputgroup">
      <input type="email" class="signIn-input" v-model="email" ref="email" />
      <p :class="['signIn-placeholder', { 'signIn-active': email }]">
        輸入您的電子郵件
      </p>
    </div>
    <div class="signIn-inputgroup">
      <input
        type="password"
        class="signIn-input"
        v-model="password"
        ref="password"
      />
      <p :class="['signIn-placeholder', { 'signIn-active': password }]">
        輸入您的密碼
      </p>
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
      locked: false,
      email: "a0963573232@gmail.com",
      password: "000000",
      alert: "",
    };
  },
  props: {
    userID: String,
    setPersonalInfo: Function,
    setGroupInfo: Function,
  },
  methods: {
    handleSignIn() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        return;
      }
      if (this.email.length < 4) {
        this.alert = "請輸入您的電子郵件!";
        this.$refs.email.focus();
        return;
      }
      if (this.password.length < 4) {
        this.alert = "請輸入您的密碼!";
        this.$refs.password.focus();
        return;
      }
      this.locked = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((res) => {
          this.alert = "";
          this.handlePersonalInfo(res.user.uid);
        })
        .catch(() => {
          this.alert = "登入失敗!帳號密碼錯誤!";
          this.password = "";
          this.$refs.password.focus();
          this.locked = false;
        });
    },
    handlePersonalInfo(uid) {
      firebase
        .database()
        .ref("/member/" + uid)
        .once("value", (res) => {
          const obj = { uid: uid, name: res.val().name, list: res.val().auth };
          this.setPersonalInfo(obj);
          const groupID =
            this.$route.params.groupID || Object.keys(obj.list)[0];
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
    background-color: #fff;
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
