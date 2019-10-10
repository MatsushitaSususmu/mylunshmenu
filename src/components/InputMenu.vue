<template>
  <div class="card">
    <div class="card-header"></div>
    <div class="card-content">
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
        <b-upload v-model="picture" v-if="!picture">
          <div class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <p>Click to upload</p>
          </div>
        </b-upload>
        <b-input class="file-name" v-else :value="picture.name" disabled></b-input>
      </b-field>
      <div class="card-footer">
        <div>
          <b-button label="登録" @click="registerStore"></b-button>
        </div>
        <div class="right-button">
          <b-button label="閉じる" @click="$parent.close()"></b-button>
        </div>
      </div>
    </div>
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
    { id: 3, name: "麺" },
    { id: 4, name: "弁当" },
    { id: 5, name: "飲料" },
    { id: 6, name: "サラダ" },
    { id: 7, name: "惣菜・おつまみ" },
    { id: 8, name: "菓子" }
  ];
  picture: File | null = null;
  mount(): void {
    this.init();
  }
  init() {
    this.itemName = "";
    this.price = 0;
    this.cal = 0;
    this.type = { id: 1, name: "パン" };
    this.picture = null;
  }
  registerStore(): void {
    if (!this.itemName || !this.price) {
      return;
    }
    const productsRef = firebase.firestore().collection("products");
    console.log(this.picture);
    const registerItem: ProductItem = {
      name: this.itemName,
      cal: this.cal,
      picutureURL: this.picture ? this.picture.name : "",
      productType: this.type.name,
      price: this.price,
      updateDate: moment(new Date()).format("YYYY/MM/DD")
    };

    productsRef.add(registerItem).then(ref => {
      console.log("Added document with ID: ", ref.id);
    });

    // const storageRef = firebase.storage().ref();
    // const file = storageRef.child(this.picture.name);
    // storageRef.put(file).then(function(snapshot) {
    //   console.log("Uploaded a blob or file!");
    // });
    this.init();
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
  margin-left: 20px;
  float: left;
}
</style>
