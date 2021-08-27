<template>
  <div class="logs">
    <div class="container">
      <div class="logList" v-for="(item, key) in logList" :key="key">
        <div
          :class="['logList_action', item.action]"
          v-text="item.action"
        ></div>
        <div class="logList_main">
          <div class="logList_title" v-text="item.page"></div>
          <div class="logList_subTitle">
            <span v-text="item.userName" :title="item.userID"></span>
            <span v-text="item.device"></span>
            <span v-text="item.timeStamp"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Logs",
  data() {
    return {
      logList: null,
    };
  },
  props: {
    userID: String,
    userName: String,
    setGroupInfo: Function,
  },
  created() {
    firebase
      .database()
      .ref("/logs/" + this.$route.params.groupID)
      .once("value", (res) => (this.logList = res.val()));
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.logs {
  min-height: calc(100vh - 72px);
  background-color: $c_primary;
  .container {
    min-height: inherit;
    padding: min(1rem, 1vw);
    background-color: $c_light;
  }
}

.logList {
  display: flex;
  align-items: center;
  margin-bottom: min(2vw, 0.5rem);
  &_action {
    width: min(15vw, 100px);
    margin-right: min(2vw, 1rem);
    padding: min(2vw, 0.5rem) 0;
    color: $c_light;
    font-size: min(4vw, 1.5rem);
    text-align: center;
    border-radius: 5px;
    &.View {
      background-color: $c_primary;
    }
    &.Reply {
      background-color: $c_primary-dark;
    }
    &.Release {
      background-color: $c_warning;
    }
    &.Delete {
      background-color: $c_danger-dark;
    }
  }
  &_main {
    flex: 1;
  }
  &_title {
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(3vw, 1.2rem);
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: $c_success;
    overflow: hidden;
  }
  &_subTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(3vw, 1rem);
    background-color: $c_secondary;
  }
}
</style>
