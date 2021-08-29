<template>
  <header class="header">
    <div class="container">
      <h1 class="header-title">
        <div class="header-icon"><img src="../assets/logo.png" /></div>
        Campus
      </h1>
      <h2 class="header-subTitle" v-if="userID">
        <span v-text="activeGroupName"></span>
        <span class="header-setting" @click="showMenu = !showMenu">
          &#x2699;
        </span>
        <div :class="['header-menu', { show: showMenu }]">
          <ul>
            <li v-for="item in groupList" :key="item.key">
              <router-link
                class="header-menu-item"
                :to="'/' + item.key"
                v-text="item.name"
              ></router-link>
            </li>
          </ul>
          <hr />
          <ul>
            <li>
              <router-link class="header-menu-item" :to="'/Setting'">
                <i class="icofont-user-alt-2"></i>個人資料
              </router-link>
            </li>
            <li v-if="activeAuth > 2">
              <router-link class="header-menu-item" :to="'/Logs'">
                <i class="icofont-paper"></i>使用紀錄
              </router-link>
            </li>
            <li>
              <span class="header-menu-item" @click="signOut">
                <i class="icofont-logout"></i>登出
              </span>
            </li>
          </ul>
        </div>
      </h2>
    </div>
  </header>
</template>

<script>
import firebase from "firebase/app";
import router from "../router";

export default {
  name: "Header",
  data() {
    return { showMenu: false };
  },
  props: {
    userID: String,
    activeAuth: Number,
    activeGroupName: String,
    groupList: Array,
    handlerData: Function,
  },
  methods: {
    signOut() {
      const signOutFlag = confirm("確定要登出嗎?");
      if (!signOutFlag) return;
      this.handlerData("userID", "");
      firebase.auth().signOut();
      router.replace("/");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.header {
  position: sticky;
  top: 0;
  padding: 1rem 0.5rem;
  background-color: $c_dark;
  z-index: 10;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-title {
    display: flex;
    align-items: center;
    font-size: min(8vw, 2.5rem);
    color: $c_light;
    text-decoration: none;
  }
  &-icon {
    width: 40px;
    height: 40px;
    margin-right: 0.5rem;
    & > img {
      width: 100%;
      height: 100%;
      object-position: center center;
      object-fit: contain;
    }
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
    &-item {
      display: block;
      padding: 0.5rem;
      color: $c_dark;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      &:hover,
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
