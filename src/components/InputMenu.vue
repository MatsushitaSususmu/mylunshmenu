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
export default class InputMenu extends Vue {
  input: string = "登録";
  products: ProductItem[] = [
    {
      cal: 0,
      name: "",
      picutureURL: "",
      productType: "",
      price: 0,
      updateTime: "2000/01/01"
    }
  ];
  columns = [
    {
      field: "name",
      label: "Name"
    },
    {
      field: "cal",
      label: "Cal"
    },
    {
      field: "picutureURL",
      label: "picutureURL"
    },
    {
      field: "productType",
      label: "productType"
    },
    {
      field: "price",
      label: "price"
    },
    {
      field: "updateTime",
      label: "updateTime"
    }
  ];

  async mounted() {
    const productsRef = firebase.firestore().collection("products");

    const temp = [{}];

    await productsRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.products.push({
          name: doc.data().name,
          cal: doc.data().cal,
          picutureURL: doc.data().picutureURL,
          productType: doc.data().productType,
          price: doc.data().price,
          updateTime: doc.data().updateTime
        });
      });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
form {
  width: 200px;
}
title {
  vertical-align: center;
  font-weight: bold;
  text-decoration: underline;
}
card {
  width: 90%;
}
</style>
