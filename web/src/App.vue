<template>
  <div>Bot昵称：{{ botName }}</div>
  <div>Bot战力：{{ botRating }}</div>
  <router-view/>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';

export default {
  name:"App",
  setup: () => {
    let botName = ref("");
    let botRating = ref("");
    $.ajax({
      url: "http://localhost:8090/pk/getbotinfo/",
      type: "get",
      success: resp => {
        botName.value = resp.name;
        botRating.value = resp.rating;
      }
    })
    return{
      botName,
      botRating
    }
  }

}
</script>

<style>
body {
  background: url("@/assets/background.png");
  background-size: cover;
}
</style>
