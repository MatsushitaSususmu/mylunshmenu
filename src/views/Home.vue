<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.ts" /> -->
    <LunchMenu msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LunchMenu from "@/components/LunchMenu.vue"; // @ is an alias to /src

@Component({
  components: {
    LunchMenu
  }
})
export default class Home extends Vue {}
</script>
