<template>
  <div>
    <form>
      <div>
        <section class="title">
          <b-field label="商品名">
            <b-input type="text" v-model="itemName"></b-input>
          </b-field>
          <b-field label="価格">
            <b-input type="number" v-model="price"></b-input>
          </b-field>
          <b-field label="カロリー">
            <b-input type="number" v-model="cal"></b-input>
          </b-field>
          <b-field label="種別">
            <b-select v-model="type">
              <option v-for="option in itemType" :value="option" :key="option.id">{{ option.name }}</option>
            </b-select>
          </b-field>
          <b-field label="写真">
            <b-input type="string" v-model="picture"></b-input>
          </b-field>
          <div>
            <b-button label="登録" @click="registerStore"></b-button>
          </div>
          <div class="right-button">
            <b-button label="閉じる" @click="$parent.close()"></b-button>
          </div>
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
import moment from "moment";

@Component
export default class InputMenu extends Vue {
  today: Date = new Date();
  itemName: string = "";
  price: number = 0;
  cal: number = 0;
  type = { id: 1, name: "パン" };
  itemType = [
    { id: 1, name: "パン" },
    { id: 2, name: "おにぎり" },
    { id: 3, name: "弁当" },
    { id: 4, name: "飲料" },
    { id: 5, name: "惣菜・おつまみ" },
    { id: 6, name: "菓子" }
  ];
  picture: string = "";
  registerStore(): void {
    const productsRef = firebase.firestore().collection("products");
    const registerItem: ProductItem = {
      name: this.itemName,
      cal: this.price,
      picutureURL: this.picture,
      productType: this.type.name,
      price: this.price,
      updateDate: moment(new Date()).format("YYYY/MM/DD")
    };

    productsRef.add(registerItem).then(ref => {
      console.log("Added document with ID: ", ref.id);
    });
    parent.close();
  }
}
</script>

<style scoped>
title {
  vertical-align: center;
  font-weight: bold;
  text-decoration: underline;
}
right-button {
  margin-left: 5px;
  float: left;
}
</style>
