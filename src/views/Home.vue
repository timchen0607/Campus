<template>
  <div class="home"></div>
</template>

<script>
export default {
  name: "Home",
  // methods: {
  //   newComment() {
  //     if (!this.newArtComment.trim()) {
  //       alert("內容不可為空!");
  //       return;
  //     }
  //     if (this.newArtComment.length > 500) {
  //       alert("內容長度超過上限!");
  //       return;
  //     }
  //     const newArtFlag = confirm("確定要回覆?回覆後不可修改。");
  //     if (!newArtFlag) return;
  //     let content = this.newArtComment;
  //     while (content.indexOf("\n\n\n") > -1) {
  //       content = content.replaceAll("\n\n\n", "\n\n");
  //     }
  //     const obj = {
  //       author: this.userID,
  //       authorName: this.userName,
  //       content: content,
  //       timeStamp: getDT(),
  //       type: "text",
  //     };
  //     const newReply = firebase
  //       .database()
  //       .ref("/article/" + this.groupID + "/" + this.articleID + "/comment")
  //       .push(obj);
  //     this.newArtComment = "";
  //     this.pushLogs(this.articleID + "/" + newReply.key, "Reply");
  //   },
  // },
};
</script>
