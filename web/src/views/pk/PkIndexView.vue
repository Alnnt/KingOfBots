<template>
  <PlayGround v-if="$store.state.pk.status === 'playing'"/>
  <MatchGround v-if="$store.state.pk.status === 'matching'"/>
  <ResultBoard v-if="$store.state.pk.loser !== 'none'"/>
</template>

<script setup>
import PlayGround from "@/components/PlayGround"
import MatchGround from "@/components/MatchGround"
import ResultBoard from "@/components/ResultBoard"
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const socketUrl = `ws://localhost:8090/websocket/${store.state.user.token}`;
store.commit("updateLoser", "none");

let socket = null;
onMounted(() => {
  store.dispatch("initOpponent");
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log("connected!");
    store.commit("updateSocket", socket);
  }

  socket.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if (data.event === "start-matching") {
      store.commit("updateOpponent", {
        username: data.opponent_username,
        photo: data.opponent_photo
      });
      setTimeout(() => {
        store.commit("updateStatus", "playing");
      }, 2000);
      store.commit("updateGame", data.game);
    }
    else if (data.event === "move") {
      console.log(data);
      const game = store.state.pk.gameObject;
      const [snake0, snake1] = game.snakes;
      snake0.set_direction(data.a_direction);
      snake1.set_direction(data.b_direction);
    }
    else if (data.event === "result") {
      console.log(data);
      const game = store.state.pk.gameObject;
      const [snake0, snake1] = game.snakes;

      if (data.loser === "all" || data.loser === "A") {
        snake0.status = "die";
      }
      if (data.loser === "all" || data.loser === "B") {
        snake1.status = "die";
      }
      store.commit("updateLoser", data.loser)
    }
  }

  socket.onclose = () => {
    console.log("disconnected!");
  }
})

onUnmounted(() => {
  socket.close();
  store.commit("updateStatus", "matching");
})

</script>

<style scoped>

</style>