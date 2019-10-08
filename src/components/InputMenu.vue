<template>
  <div>
    <b-card title="昼食メニュー" class="title">
      name
      <b-input type="text"></b-input>price
      <b-input type="number"></b-input>Cal
      <b-input type="number"></b-input>picture
      <b-input type="string"></b-input>type
      <b-input type="string"></b-input>date
      <b-input type="datetime"></b-input>
    </b-card>
  </div>
</template>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-storage.js"></script>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ProductItem } from "@/product.ts";
import * as firebase from "firebase/app";

@Component
export default class InputMenu extends Vue {}
</script>

<style scoped>
</style>
