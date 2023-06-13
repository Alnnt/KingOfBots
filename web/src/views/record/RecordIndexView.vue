<template>
<ContentField>
  <table class="table table-striped table-hover">
    <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>对战结果</th>
      <th>对战时间</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="record in records" :key="record.record.id">
        <td>
          <img :src="record.a_photo" alt="" class="record-user-photo">
          <span class="record-user-username">{{ record.a_username }}</span>
        </td>
        <td>
          <img :src="record.b_photo" alt="" class="record-user-photo">
          <span class="record-user-username">{{ record.b_username }}</span>
        </td>
        <td>{{ record.result }}</td>
        <td>{{ record.record.createTime }}</td>
        <td>
          <button @click="open_record_content(record.record)" type="button" class="btn btn-secondary">查看录像</button>
        </td>
      </tr>
    </tbody>
  </table>
  <nav aria-label="...">
    <ul class="pagination">
      <li class="page-item" @click="click_page(-2)">
        <a class="page-link" href="#">上一页</a>
      </li>
      <li :class="'page-item ' + page.is_active" v-for="page in pages" :key="page.number" @click="click_page(page.number)">
        <a class="page-link" href="#">{{ page.number }}</a>
      </li>
      <li class="page-item" @click="click_page(-1)">
        <a class="page-link" href="#">下一页</a>
      </li>
    </ul>
  </nav>
</ContentField>
</template>

<script setup>
import ContentField from '@/components/ContentField.vue'
import { useStore } from "vuex"
import { ref } from "vue"
import $ from "jquery"
import router from "@/router"

const store = useStore();
let records = ref([]);
let current_page = 1;
let total_records = 0;
let pages = ref([]);

const click_page = page => {
  if (page === -2) page = current_page - 1;
  else if (page === -1) page = current_page + 1;

  let max_pages = parseInt(Math.ceil(total_records / 10));
  if (page >= 1 && page <= max_pages) {
    pull_page(page);
  }
}

const update_pages = () => {
  let max_pages = parseInt(Math.ceil(total_records / 10));
  let new_pages = [];
  for (let i = current_page - 2; i <= current_page + 2; ++i) {
    if (i >= 1 && i <= max_pages) {
      new_pages.push({
        number: i,
        is_active: i === current_page ? "active" : ""
      });
    }
  }
  pages.value = new_pages;
  console.log(new_pages)
}

const pull_page = page => {
  current_page = page;
  $.ajax({
    url: "http://localhost:8090/record/getlist",
    type: "get",
    headers: {
      Authorization: "Bearer " + store.state.user.token
    },
    data: {
      page
    },
    success(resp) {
      records.value = resp.records;
      total_records = resp.records_count;
      update_pages();
    },
    error(resp) {
      console.log(resp);
    }
  })
}

pull_page(current_page);

const stringTo2D = map => {
  let grid = [];
  for (let i = 0, k = 0; i < 13; ++i) {
    let line = [];
    for (let j = 0; j < 14; ++j, ++k) {
      if (map[k] === '0') line.push(0);
      else line.push(1);
    }
    grid.push(line);
  }
  return grid;
}


const open_record_content = record => {
  store.commit("updateIsRecord", true);
  store.commit("updateGame", {
    map: stringTo2D(record.map),
    a_id: record.aid,
    a_sx: record.asx,
    a_sy: record.asy,
    b_id: record.bid,
    b_sx: record.bsx,
    b_sy: record.bsy
  });
  store.commit("updateSteps", {
    a_steps: record.asteps,
    b_steps: record.bsteps
  });
  store.commit("updateRecordLoser", record.loser);
  router.push({
    name: "record_content",
    params: {
      recordId: record.id
    }
  })
}
</script>

<style scoped>
img.record-user-photo {
  width: 4vh;
  border-radius: 50%;
  margin-right: 1em;
}

table {
  text-align: center;
}

ul.pagination > li:first-child {
  margin-left: auto;
}

ul.pagination > li:last-child {
  margin-right: auto;
}
</style>