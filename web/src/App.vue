<template>
  <NavBar />
  <router-view/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  components: {
    NavBar
  }
}

</script>

<style>
body {
  /* TODO 因未知原因，此二者不可颠倒位置 */
  background: url("@/assets/images/background.png") fixed center;
  background-size: cover;
}

@media screen and (max-width: 1280px) {
  body {
    background-position-x: calc(50% - 25vh);
  }
}
</style>