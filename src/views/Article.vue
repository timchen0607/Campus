<template>
  <div class="Article">
    <img alt="Vue logo" src="../assets/logo.png" />
    <p>{{ $route.params.groupID }}</p>
  </div>
</template>

<script>
export default {
  name: "Article",
};
</script>
