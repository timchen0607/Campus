<template>
  <div class="setting main">
    <div class="container">
      <div class="loading" v-if="loading">
        <h3 class="loading-title skeleton"></h3>
        <h4 class="loading-subTitle skeleton"></h4>
        <span class="btn skeleton" v-for="x in 4" :key="x">&nbsp;</span>
        <hr class="loading-hr" />
        <div class="loading-content skeleton"></div>
      </div>
      <div v-else>
        <div class="setting-control">
          <h3 class="setting-title">個人資料管理</h3>
          <h4 class="setting-subTitle" v-text="account"></h4>
          <h4 class="setting-subTitle" v-text="userName"></h4>
          <span :class="['btn', { active: mode === 0 }]" @click="mode = 0">
            聯絡管理員
          </span>
          <span :class="['btn', { active: mode === 1 }]" @click="mode = 1">
            變更密碼
          </span>
          <span :class="['btn', { active: mode === 2 }]" @click="mode = 2">
            文章通知
          </span>
        </div>
        <hr class="setting-hr" />
        <div v-if="mode === 0">
          <p class="setting-subTitle">陳政丰</p>
          <p class="setting-subTitle">10961112@gm.nfu.edu.tw</p>
        </div>
        <div v-if="mode === 1">
          <div class="modify-inputgroup">
            <input type="password" class="modify-input" v-model="oldPW" />
            <p class="modify-placeholder">請輸入舊的密碼</p>
          </div>
          <div class="modify-inputgroup">
            <input type="password" class="modify-input" v-model="newPW" />
            <p class="modify-placeholder">請輸入新的密碼</p>
          </div>
          <div class="modify-inputgroup">
            <input type="password" class="modify-input" v-model="chkPW" />
            <p class="modify-placeholder">請確認新的密碼</p>
          </div>
          <p class="modify-alert" v-if="alert" v-text="alert"></p>
          <button class="btn locked" v-if="locked">
            修改中...
          </button>
          <button class="btn" v-else @click="handleModifyPW">
            修改
          </button>
        </div>
        <div v-if="mode === 2">
          <div>
            <input type="checkbox" v-model="notify" id="notify" />
            <label for="notify" class="notify">
              接收新文章通知(建議勾選避免錯過作業與公告)
            </label>
          </div>
          <button class="btn locked" v-if="locked">
            儲存中...
          </button>
          <button class="btn" v-else @click="handleModifyNotify">
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import router from "../router";
import { userCheck, getFD } from "../assets/config";

export default {
  name: "Setting",
  data() {
    return {
      loading: true,
      mode: 0, // 顯示模式
      oldPW: "", // 舊密碼
      newPW: "", // 新密碼
      chkPW: "", // 密碼確認
      alert: "", // 錯誤提示
      notify: null, // 通知開關
      errorCount: 0, //操作次數
      locked: false, // 鎖定按鈕
    };
  },
  props: {
    userID: String,
    account: String,
    userName: String,
    handlerData: Function,
    handlerLogs: Function,
  },
  created() {
    userCheck(this.userID)
      .then(() => getFD("member/" + this.userID + "/notify"))
      .then((res) => {
        this.handlerData("activeAuth", 0);
        this.handlerData("activeGroupName", "個人資料");
        this.handlerLogs("Setting", "System");
        this.notify = res;
        this.loading = false;
      })
      .catch((path) => router.replace(path));
  },
  methods: {
    handleModifyPW() {
      this.errorCount += 1;
      if (this.errorCount > 5) {
        alert("嘗試次數過多!");
        return;
      }
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
      if (this.oldPW === this.newPW) {
        this.alert = "新密碼不可與舊密碼相同!";
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
          return user.updatePassword(this.newPW);
        })
        .then(() => {
          this.oldPW = "";
          this.newPW = "";
          this.chkPW = "";
          this.alert = "";
          this.handlerLogs("ModifyPW", "System");
          this.errorCount = 0;
          this.locked = false;
          alert("密碼修改成功!");
        })
        .catch(() => (this.alert = "驗證失敗!"));
    },
    handleModifyNotify() {
      this.errorCount += 1;
      if (this.errorCount > 5) {
        alert("嘗試次數過多!");
        return;
      }
      const signOutFlag = this.notify ? true : confirm("確定要取消通知嗎?");
      if (!signOutFlag) return;
      this.locked = true;
      firebase
        .database()
        .ref("member/" + this.userID + "/notify")
        .set(this.notify);
      alert("通知狀態修改成功!");
      this.locked = false;
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
  &-title {
    margin: 0.5rem 0;
    height: 2rem;
  }
  &-subTitle {
    margin: 1rem 0;
    height: 1.5rem;
  }
  &-hr {
    margin: 1rem 0;
  }
  &-content {
    height: 15rem;
  }
}

.setting {
  text-align: center;
  &-title {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
  &-subTitle {
    margin: 1rem 0;
    font-size: 1.3rem;
  }
  &-hr {
    margin: 1rem 0;
  }
}
.modify {
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
}
.notify {
  display: inline-block;
  padding: 0.5rem;
  font-size: 1.2rem;
}
</style>
