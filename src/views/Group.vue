<template>
  <div class="group main">
    <div class="container">
      <div class="loading" v-if="loading">AAAAAAAAAAAA</div>
      <div class="list" v-else>
        <div class="list-control">
          <span :class="['btn', { active: track }]" @click="track = !track">
            <i class="icofont-check" v-if="track"></i> 追蹤中的文章
          </span>
          <router-link class="btn" :to="'/' + groupID + '/newArticle'">
            新增文章
          </router-link>
        </div>
        <div v-for="item in artList" :key="item.key">
          <router-link class="list_link" :to="'/' + groupID + '/' + item.key">
            <div
              :class="{
                list_reply: true,
                l1: item.reply < 10,
                l2: item.reply >= 10,
                l3: item.reply >= 30,
                l4: item.reply >= 50,
              }"
              v-text="item.reply"
            ></div>
            <div class="list_main">
              <div class="list_title" v-text="item.title"></div>
              <div class="list_subTitle">
                <span v-text="item.authorName"></span>
                <span v-text="item.timeStamp"></span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { userCheck, groupCheck, getRealData } from "../assets/config";

export default {
  name: "Group",
  data() {
    return {
      loading: true,
      track: false, // 顯示追蹤中文章
      artList: [], // 文章列表
    };
  },
  computed: {
    groupID() {
      return this.$route.params.groupID;
    },
  },
  props: {
    userID: String,
    userName: String,
    activeAuth: Number,
    groupList: Array,
    handlerData: Function,
    handlerLogs: Function,
  },
  created() {
    userCheck(this.userID)
      .then(() => groupCheck(this.groupID, this.groupList))
      .then((res) => {
        this.handlerData("activeAuth", res.auth);
        this.handlerData("activeGroupName", res.name);
        this.handleGroup();
        this.loading = false;
      })
      .catch((path) => router.replace(path));
  },
  watch: {
    groupID: function() {
      this.handleGroup();
      // this.pushLogs("Home", "View");
    },
  },
  methods: {
    handleGroup() {
      getRealData("/article/" + this.groupID).on("value", (res) => {
        this.artList.length = 0;
        Object.keys(res.val()).forEach((key) =>
          this.artList.unshift(res.val()[key])
        );
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.loading {
}

.list {
  &-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
