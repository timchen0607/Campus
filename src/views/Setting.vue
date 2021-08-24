<template>
  <div class="Setting">
    Setting
  </div>
</template>

<script>
// import firebase from "firebase/app";
// import "firebase/auth";
// import router from "../router";

export default {
  name: "Setting",
  data() {
    return {};
  },
  props: {
    userID: String,
    userName: String,
    setGroupInfo: Function,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";
</style>
