<template>
  <div class="group main">
    <div class="container">
      <div class="loading" v-if="loading">
        <div class="list-link" v-for="x in 8" :key="x">
          <div class="list-reply l1 skeleton">00</div>
          <div class="list-main">
            <div class="loading-title skeleton"></div>
            <div class="loading-text skeleton"></div>
          </div>
        </div>
      </div>
      <div class="list" v-else>
        <div class="main-control">
          <span :class="['btn', { active: track }]" @click="track = !track">
            <i class="icofont-check" v-if="track"></i> 追蹤中的文章
          </span>
          <router-link class="btn" :to="'/' + groupID + '/newArticle'">
            <i class="icofont-pencil-alt-5"></i> 新增文章
          </router-link>
        </div>
        <div v-for="item in artList" :key="item.key">
          <router-link
            v-if="handleTrack(item.notify)"
            class="list-link"
            :to="'/' + groupID + '/' + item.key"
          >
            <div
              :class="{
                'list-reply': true,
                l1: item.reply < 10,
                l2: item.reply >= 10,
                l3: item.reply >= 30,
                l4: item.reply >= 50,
              }"
              v-text="item.reply"
            ></div>
            <div class="list-main">
              <div class="list-title" v-text="item.title"></div>
              <div class="list-subTitle">
                <span v-text="item.type"></span>
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
      })
      .catch((path) => router.replace(path));
  },
  watch: {
    groupID: function() {
      if (!this.userID || !this.groupID) return;
      groupCheck(this.groupID, this.groupList)
        .then((res) => {
          this.handlerData("activeAuth", res.auth);
          this.handlerData("activeGroupName", res.name);
          this.handleGroup();
        })
        .catch((path) => router.replace(path));
    },
  },
  methods: {
    handleGroup() {
      if (this.prevRoute.params.groupID !== this.groupID)
        this.handlerLogs("View", this.groupID);
      getRealData("/article/" + this.groupID).on("value", (res) => {
        this.artList.length = 0;
        this.loading = false;
        if (!res.val()) return;
        Object.keys(res.val()).forEach((key) => {
          let temp = res.val()[key];
          temp.key = key;
          this.artList.unshift(temp);
        });
      });
    },
    handleTrack(notify) {
      if (!this.track) return true;
      if (!notify) return false;
      if (notify.indexOf(this.userID) < 0) return false;
      return true;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.loading {
  &-title {
    height: min(8vw, 3rem);
  }
  &-text {
    height: min(6vw, 2rem);
  }
}

.list {
  &-link {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    padding: min(2vw, 1rem);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background 0.5s;
    &:hover {
      background-color: $c_secondary-light;
    }
  }
  &-reply {
    width: min(15vw, 100px);
    margin-right: min(2vw, 1rem);
    padding: min(3vw, 1rem) 0;
    color: $c_light;
    font-size: min(10vw, 3rem);
    text-align: center;
    border-radius: 5px;
    &.l1 {
      background-color: $c_warning;
    }
    &.l2 {
      background-color: $c_danger;
    }
    &.l3 {
      background-color: $c_danger-dark;
    }
    &.l4 {
      background-color: $c_dark;
    }
  }
  &-main {
    width: 0;
    flex: 1;
  }
  &-title {
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(5vw, 2rem);
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: $c_success;
    overflow: hidden;
  }
  &-subTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: min(1.5vw, 0.5rem);
    color: $c_dark;
    font-size: min(3vw, 1rem);
    background-color: $c_secondary;
  }
}
</style>
