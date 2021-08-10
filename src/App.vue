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

var firebaseConfig = {
  apiKey: "AIzaSyDtYB7XthyeF9hIlrfXiMKf9bQMOPqVX9U",
  authDomain: "campus-f09a1.firebaseapp.com",
  databaseURL: "https://campus-f09a1-default-rtdb.firebaseio.com",
  projectId: "campus-f09a1",
  storageBucket: "campus-f09a1.appspot.com",
  messagingSenderId: "916588820563",
  appId: "1:916588820563:web:addd06471b111a90232ea6",
  measurementId: "G-4ZX5YS7MYG",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default {
  name: "App",
  methods: {
    handleSignUp() {
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
      // Create user with email and pass.
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            alert("The password is too weak.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    },
    handleSignIn() {
      console.log(1111);
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
            console.log("success");
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
