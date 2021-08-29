<template>
  <Header
    :userID="userID"
    :activeAuth="activeAuth"
    :activeGroupName="activeGroupName"
    :groupList="groupList"
    :handlerData="handlerData"
  />
  <router-view
    :userID="userID"
    :account="account"
    :userName="userName"
    :setGroupInfo="setGroupInfo"
    :handlerData="handlerData"
  />
</template>

<script>
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import Header from "./components/Header.vue";
import { firebaseConfig } from "./assets/config";

export default {
  name: "App",
  data() {
    return {
      userID: "", // 會員ID
      account: "", // 會員登入帳號
      userName: "", // 會員名稱
      activeAuth: 0, // 當前群組權限
      activeGroupName: "", // 當前群組名稱
      groupList: [], // 有權限的群組列表
    };
  },
  created() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  },
  components: {
    Header,
  },
  methods: {
    handlerData(dataName, data) {
      if (dataName) this[dataName] = data;
    },
    setGroupInfo(gid, name = null) {
      if (name !== null) {
        this.activeGroupName = name;
      } else {
        this.activeGroupName = "這邊還沒處理錯誤錯誤錯誤";
      }
    },
  },
};
</script>
