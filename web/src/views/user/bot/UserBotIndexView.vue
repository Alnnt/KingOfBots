<template>
<ContentField>我的Bot</ContentField>
</template>

<script setup>
import ContentField from '@/components/ContentField.vue'
import $ from 'jquery'
import { useStore } from "vuex";

const store = useStore();

$.ajax({
  url: "http://localhost:8090/user/bot/remove",
  type: "post",
  data: {
    bot_id: 2

  },
  headers: {
    Authorization: "Bearer " + store.state.user.token
  },
  success(resp) {
    console.log(resp);
  },
  error(resp) {
    console.log(resp);
  }
})
</script>

<style scoped>

</style>