<template>
  <div>
    <form>
      <div>
        <section>
          <b-field label="商品名">
            <b-input type="text"></b-input>
          </b-field>
          <b-field label="価格">
            <b-input type="number"></b-input>
          </b-field>
          <b-field label="カロリー">
            <b-input type="number"></b-input>
          </b-field>
          <b-field label="種別">
            <b-select>
              <option v-for="option in type" :value="option.id" :key="option.id">{{ option.name }}</option>
            </b-select>
          </b-field>
          <b-field label="写真">
            <b-input type="string"></b-input>
          </b-field>
          <b-field label="日付">
            <b-input type="date" :aria-placeholder="today"></b-input>
          </b-field>
        </section>
      </div>
    </form>
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
export default class InputMenu extends Vue {
  today: Date = new Date();
  type = [
    { id: 1, name: "パン" },
    { id: 2, name: "おにぎり" },
    { id: 3, name: "弁当" },
    { id: 4, name: "飲料" },
    { id: 5, name: "惣菜・おつまみ" },
    { id: 6, name: "菓子" }
  ];
}
</script>

<style scoped>
</style>
