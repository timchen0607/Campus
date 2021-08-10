<template>
  <div class="signIn">
    <img src="../assets/logo.png" alt="Campus Logo" />
    <div class="signIn-inputgroup">
      <input type="email" class="signIn-input" v-model="email" />
      <p :class="['signIn-placeholder', { 'signIn-active': email }]">
        輸入您的電子郵件
      </p>
    </div>
    <div class="signIn-inputgroup">
      <input type="password" class="signIn-input" v-model="password" />
      <p :class="['signIn-placeholder', { 'signIn-active': password }]">
        輸入您的密碼
      </p>
    </div>
    <p class="signIn-alert" v-if="alert" v-text="alert"></p>
    <button class="signIn-btn">登入</button>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      alert: "",
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.signIn {
  padding: 2rem 1rem;
  text-align: center;
  &-inputgroup {
    position: relative;
    width: min(500px, 90vw);
    margin: 1rem auto;
  }
  &-input {
    width: min(500px, 90vw);
    padding: 12px;
    font-size: 1.5rem;
    border: 1px solid $c_secondary;
    border-radius: 10px;
    background-color: transparent;
    box-sizing: border-box;
    &:focus {
      padding: 10px;
      border: 3px solid $c_primary;
      outline: none;
    }
  }
  &-placeholder {
    position: absolute;
    top: 50%;
    left: 10px;
    color: $c_secondary;
    font-size: 1.5rem;
    transition: 0.2s;
    transform: translateY(-50%);
    z-index: -1;
  }
  &-input:focus + &-placeholder,
  &-active {
    top: 0px;
    left: 20px;
    padding: 0 10px;
    font-size: 1.1rem;
    background-color: #fff;
    color: $c_primary;
    z-index: 1;
  }
  &-alert {
    font-size: 1.5rem;
    color: $c_danger;
    &::before {
      content: "※";
    }
  }
  &-btn {
    display: block;
    width: min(500px, 90vw);
    margin: 1rem auto;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: $c_light;
    background-color: $c_secondary;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.5s;
    &:hover {
      background-color: $c_danger;
    }
  }
}
</style>
