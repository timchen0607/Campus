<template>
  <div>
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
              <li v-for="item in groupList" :key="item.key">
                <router-link
                  class="group_item"
                  :to="'/' + item.key"
                  v-text="item.name"
                >
                </router-link>
              </li>
            </ul>
            <hr />
            <ul>
              <li>Setting</li>
              <li>Log Out</li>
            </ul>
          </div>
        </h2>
      </div>
    </header>
    <div>
      <SignIn v-if="!userID" :setPersonalInfo="setPersonalInfo" />
      <router-view
        v-else
        :userID="userID"
        :userName="userName"
        :setGroupInfo="setGroupInfo"
      />
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import SignIn from "./views/SignIn.vue";
import { firebaseConfig } from "./assets/config";

export default {
  name: "App",
  data() {
    return {
      showMenu: false,
      userID: "",
      userName: "",
      groupName: "",
      groupList: [],
      groupMap: {},
    };
  },
  created() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  },
  components: {
    SignIn,
  },
  methods: {
    setPersonalInfo(obj) {
      this.userID = obj.uid;
      this.userName = obj.name;
      firebase
        .database()
        .ref("/group/")
        .once("value", (res) => {
          Object.keys(obj.list).forEach((key) => {
            this.groupMap = res.val();
            if (obj.list[key] > 0)
              this.groupList.push({ key: key, name: res.val()[key] });
          });
        });
    },
    setGroupInfo(gid) {
      this.groupName = this.groupMap[gid];
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
  z-index: 100;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    font-size: min(8vw, 2.5rem);
    color: $c_light;
    text-decoration: none;
  }
  &-subTitle {
    position: relative;
    font-size: min(5vw, 1.5rem);
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
    min-width: min(30vw, 160px);
    padding: 1rem;
    color: $c_success;
    background-color: $c_secondary-light;
    border: 1px solid $c_secondary;
    transform: translateY(-200%);
    transition: transform 0.5s;
    .group_item {
      display: block;
      padding: 0.5rem;
      color: $c_dark;
      border-radius: 6px;
      text-decoration: none;
      &.router-link-active {
        color: $c_light;
        background-color: $c_primary-dark;
      }
    }
    hr {
      border: 1px solid $c_secondary;
    }
    &.show {
      transform: translateY(0%);
    }
  }
}
</style>
