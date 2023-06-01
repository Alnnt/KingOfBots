<template>
  <div class="container">
    <div class="row">
      <div class="col-3">
        <div class="card">
          <div class="card-body">
            <img :src="$store.state.user.photo" alt="">
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="card">
          <div class="card-header">
            <span class="title">我的Bot</span>
            <button type="button" class="btn btn-primary float-end">创建Bot</button>
          </div>
          <div class="card-body">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import $ from "jquery"
import { useStore } from "vuex"

const store = useStore();
const refresh_bots = () => {
  $.ajax({
    url: "http://localhost:8090/user/bot/getlist",
    type: "get"
  })
}
</script>

<style scoped>
.card {
  margin-top: 20px;
}

img {
  width: 100%
}

.title {
  font-size: 130%;
}
</style>