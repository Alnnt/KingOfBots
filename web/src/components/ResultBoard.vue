<template>
  <div class="result-board">
    <div class="result-board-text" v-if="$store.state.pk.loser === 'all'">
      Draw
    </div>
    <!-- pk.a_id是int型，user.id是string型 -->
    <div class="result-board-text" v-else-if="$store.state.pk.loser === 'A' && $store.state.pk.a_id === parseInt($store.state.user.id)">
      Lose
    </div>
    <div class="result-board-text" v-else-if="$store.state.pk.loser === 'B' && $store.state.pk.b_id === parseInt($store.state.user.id)">
      Lose
    </div>
    <div class="result-board-text" v-else>
      Win
    </div>
    <div class="result-board-btn">
      <button type="button" class="btn btn-warning btn-lg" @click="restart">再来！</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
const restart = () => {
  store.commit("updateStatus", "matching");
  store.commit("updateLoser", "none");
  store.dispatch("initOpponent");
}
</script>

<style scoped>
div.result-board {
  height: 30vh;
  min-height: 200px;
  width: 30vw;
  background-color: rgba(50, 50, 50, 0.5);
  border-radius: 5px;
  position: absolute;
  top: 30vh;
  left: 35vw;
  text-align: center;
}

div.result-board-text {
  color: white;
  font-size: 50px;
  font-weight: 600;
  font-style: italic;
  padding-top: 5vh;
}

div.result-board-btn {
  padding-top: 7vh;
}
</style>