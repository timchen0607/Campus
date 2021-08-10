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
      <router-view />
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
import "firebase/auth";
import "firebase/database";
import { firebaseConfig, groupMap } from "./assets/config";

export default {
  name: "App",
  data() {
    return {
      userID: "EJahKp2a8ERMWR5wxqAkLGQj7SC3",
      groupID: "",
      groupName: "",
      groupList: [],
    };
  },
  created() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    this.handleSignIn();
    firebase
      .database()
      .ref()
      .once("value", (res) => {
        groupMap.forEach((key) => {
          if (res.val()[key]["auth"][this.userID] > 0)
            this.groupList.push({ key: key, name: res.val()[key]["name"] });
        });
        this.groupID = this.groupList[0].key;
        this.groupName = this.groupList[0].name;
      });
  },
  methods: {
    handleSignIn() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        var email = "a0963573232@gmail.com";
        var password = "000000";
        if (email.length < 4) {
          alert("Please enter an email address.");
          return;
        }
        if (password.length < 4) {
          alert("Please enter a password.");
          return;
        }
        // Sign in with email and pass.
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log("Sign In");
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === "auth/wrong-password") {
              alert("Wrong password.");
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
      }
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
