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
    :activeAuth="activeAuth"
    :groupList="groupList"
    :setGroupInfo="setGroupInfo"
    :handlerData="handlerData"
    :handlerLogs="handlerLogs"
  />
</template>

<script>
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import Header from "./components/Header.vue";
import { firebaseConfig, pushFD, getDT } from "./assets/config";

export default {
  name: "App",
  data() {
    const deviceList = ["Android", "webOS", "iPhone", "iPad"];
    const device =
      deviceList.find((e) => navigator.userAgent.match(e)) || "PC/Others";
    return {
      userID: "", // 會員ID
      account: "", // 會員登入帳號
      userName: "", // 會員名稱
      activeAuth: 0, // 當前群組權限
      activeGroupName: "", // 當前群組名稱
      groupList: [], // 有權限的群組列表
      device: device, // 會員登入設備
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
    handlerLogs(action, gid, aid = null, key = null) {
      const obj = {
        userID: this.userID,
        userName: this.userName,
        timeStamp: getDT(),
        group: gid,
        article: aid,
        comment: key,
        action: action,
        device: this.device,
      };
      pushFD("/logs/" + gid, obj);
    },
    setGroupInfo(name = null) {
      if (name !== null) {
        this.activeGroupName = name;
      } else {
        this.activeGroupName = "這邊還沒處理錯誤錯誤錯誤";
      }
    },
  },
};
</script>
