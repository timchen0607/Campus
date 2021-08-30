<template>
  <div class="error main">
    <div class="container">
      <i class="icofont-swoosh-left"></i>
      <i class="icofont-swoosh-right"></i>
      <i class="icofont-login"></i>
      <i class="icofont-logout"></i>
      <i class="icofont-history"></i>
      <i class="icofont-check"></i>
      <i class="icofont-ban"></i>
      <i class="icofont-close"></i>
      <i class="icofont-pencil-alt-5"></i>
      <i class="icofont-gear"></i>
      <i class="icofont-thumbs-up"></i>
      <i class="icofont-ui-delete"></i>
      <i class="icofont-user-alt-2"></i>
      <i class="icofont-paper"></i>
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
