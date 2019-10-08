<template>
  <div>
    <b-card title="昼食メニュー" class="title">
      <div>
        <p>商品名</p>
        <b-input type="text"></b-input>
        <p>価格</p>
        <b-input type="number"></b-input>
        <p>カロリー</p>
        <b-input type="number"></b-input>
        <p>種別</p>
        <b-input type="string"></b-input>
        <p>写真</p>
        <b-input type="string"></b-input>
        <p>日付</p>
        <b-input type="datetime"></b-input>
      </div>
    </b-card>
  </div>
</template>
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
