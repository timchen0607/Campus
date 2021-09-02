<template>
  <div class="error main">
    <div class="container">
      <i class="icofont-swoosh-left"></i>
      <i class="icofont-swoosh-right"></i>
      <i class="icofont-check"></i>
      <i class="icofont-ban"></i>
      <i class="icofont-close"></i>
    </div>
  </div>
</template>

<script>
import { userCheck } from "../assets/config";

export default {
  name: "Error",
  props: {
    userID: String,
  },
  created() {
    userCheck(this.userID);
  },
};
</script>

<style lang="scss"></style>
