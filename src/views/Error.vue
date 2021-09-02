<template>
  <div class="error main">
    <div class="container">
      <i class="icofont-ban"></i>
      <ul>
        <li>如果您看到這個頁面可能代表：</li>
        <li><i class="icofont-swoosh-right"></i> 您先前訪問的資源已被刪除</li>
        <li><i class="icofont-swoosh-right"></i> 您訪問所需的權限不足</li>
        <li><i class="icofont-swoosh-right"></i> 資料載入過程中發生不明錯誤</li>
        <li><i class="icofont-swoosh-right"></i> 您直接連進來這個頁面？！</li>
        <li>如有任何問題，請與管理員聯繫。</li>
        <li>
          <router-link class="btn" to="/">
            <i class="icofont-swoosh-left"></i>回首頁
          </router-link>
        </li>
      </ul>

      <!-- <i class="icofont-error"></i> -->
    </div>
  </div>
</template>

<script>
import router from "../router";
import { userCheck } from "../assets/config";

export default {
  name: "Error",
  props: {
    userID: String,
    handlerData: Function,
    handlerLogs: Function,
  },
  created() {
    userCheck(this.userID)
      .then(() => {
        this.handlerData("activeAuth", 0);
        this.handlerData("activeGroupName", "未知錯誤");
        this.handlerLogs("Error", "System");
      })
      .catch((path) => router.replace(path));
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.icofont-ban {
  display: block;
  font-size: min(50vw, 20rem);
  color: $c_danger;
  text-align: center;
}
.icofont-swoosh-right {
  color: $c_danger-dark;
}
ul {
  max-width: 300px;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 2rem;
  a {
    display: block;
    text-align: center;
  }
}
</style>
