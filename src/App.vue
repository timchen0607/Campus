<template>
  <!-- <div class="signOut">
    <router-view />
  </div> -->
  <div class="signIn">
    <header class="header">
      <div class="container">
        <h1 class="header-title">Campus-Web</h1>
        <h2 class="header-subTitle">班級名稱B</h2>
      </div>
    </header>
    <div class="container">
      <router-view :setPersonalInfo="setPersonalInfo" />
    </div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import { firebaseConfig } from "./assets/config";

export default {
  name: "App",
  data() {
    return {
      userID: "",
      userName: "",
      groupID: "",
      groupName: "",
      groupList: [],
    };
  },
  created() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  },
  methods: {
    setPersonalInfo(obj) {
      console.log(obj);
      this.userID = obj.uid;
      this.userName = obj.email;
      this.groupID = obj.groupID;
      this.groupName = obj.groupName;
      this.groupList = obj.list;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./assets/scss/_variables";

.header {
  position: sticky;
  top: 0;
  padding: 1rem 0.5rem;
  background-color: $c_dark;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    font-size: 2rem;
    color: $c_light;
  }
  &-subTitle {
    font-size: 1.5rem;
    color: $c_secondary;
  }
}
</style>
