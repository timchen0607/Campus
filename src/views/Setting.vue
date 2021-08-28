<template>
  <div class="setting">
    <div class="container">
      <h3 class="setting-title">個人資料設定</h3>
      <h4 class="setting-subTitle" v-text="userName"></h4>
      <hr />
      <h3 class="setting-title">個人密碼修改</h3>
      <div class="setting-inputgroup">
        <input type="password" class="setting-input" v-model="oldPW" />
        <p class="setting-placeholder">請輸入舊的密碼</p>
      </div>
      <div class="setting-inputgroup">
        <input type="password" class="setting-input" v-model="newPW" />
        <p class="setting-placeholder">請輸入新的密碼</p>
      </div>
      <div class="setting-inputgroup">
        <input type="password" class="setting-input" v-model="chkPW" />
        <p class="setting-placeholder">請確認新的密碼</p>
      </div>
      <p class="setting-alert" v-if="alert" v-text="alert"></p>
      <button class="setting-btn setting-btn-locked" v-if="locked">
        修改中...
      </button>
      <button class="setting-btn" @click="handleUpdatePW" v-else>
        修改
      </button>
      <hr />
      <h3 class="setting-title">聯繫管理員</h3>
      <h4 class="setting-subTitle">陳政丰</h4>
      <h4 class="setting-subTitle">10961112@gm.nfu.edu.tw</h4>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Setting",
  data() {
    return {
      oldPW: "",
      newPW: "",
      chkPW: "",
      alert: "",
      locked: false,
    };
  },
  props: {
    account: String,
    userName: String,
    setGroupInfo: Function,
  },
  created() {
    this.setGroupInfo(0, "個人資料");
  },
  methods: {
    handleUpdatePW() {
      if (
        this.oldPW.length < 6 ||
        this.newPW.length < 6 ||
        this.chkPW.length < 6
      ) {
        this.alert = "密碼長度需大於六字元!";
        return;
      }
      if (this.newPW !== this.chkPW) {
        this.alert = "兩次密碼輸入不相同!";
        return;
      }
      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.account,
        this.oldPW
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          this.locked = true;
          user
            .updatePassword(this.newPW)
            .then(() => {
              this.oldPW = "";
              this.newPW = "";
              this.chkPW = "";
              this.alert = "";
              this.locked = false;
              alert("密碼修改成功!");
            })
            .catch(() => (this.alert = "發生不知名錯誤!請聯繫管理員"));
        })
        .catch(() => (this.alert = "舊密碼輸入錯誤!驗證失敗!"));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.setting {
  min-height: calc(100vh - 72px);
  background-color: $c_primary;
  .container {
    min-height: inherit;
    padding: min(1rem, 1vw);
    background-color: $c_light;
    text-align: center;
  }
  &-title {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
  &-subTitle {
    margin: 1rem 0;
    font-size: 1.3rem;
  }
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
    top: 0px;
    left: 20px;
    padding: 0 10px;
    font-size: 1.1rem;
    color: $c_primary;
    background-color: #fff;
    transform: translateY(-50%);
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
