<template>
  <!-- <div class="signOut">
    <router-view />
  </div> -->
  <div class="signIn">
    <header class="header">
      <div class="container">
        <h1 class="header-title">Campus-Web</h1>
        <h2 class="header-subTitle" v-if="userID">
          <span v-text="groupName"></span>
          <span class="header-setting" @click="showMenu = !showMenu">
            &#x2699;
          </span>
          <div :class="['header-menu', { show: showMenu }]">
            <ul>
              <li v-for="item in groupList" :key="item.key">{{ item.name }}</li>
            </ul>
            <hr />
            <ul>
              <li>Logs</li>
              <li>Setting</li>
              <li>Log Out</li>
            </ul>
          </div>
        </h2>
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
      showMenu: false,
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
    font-size: 2.5rem;
    color: $c_light;
  }
  &-subTitle {
    position: relative;
    font-size: 1.5rem;
    color: $c_secondary;
  }
  &-setting {
    display: inline-block;
    margin-left: 1rem;
    padding: 0.4rem;
    cursor: pointer;
    transition: transform 0.5s;
    &:hover {
      color: $c_warning;
      transform: rotate(180deg);
    }
  }
  &-menu {
    position: absolute;
    top: calc(100% + 1.2rem);
    right: 0.5rem;
    padding: 1rem;
    color: $c_success;
    background-color: $c_secondary-light;
    border: 1px solid $c_secondary;
    transform: translateY(-130%);
    transition: transform 0.5s;
    hr {
      border: 1px solid $c_secondary;
    }
    &.show {
      transform: translateY(0%);
    }
  }
}
</style>
