<template>
  <div>
    <h2>昼食メニュー</h2>
    <b-card>
      <b-button :label="input" @click="input" class="register"></b-button>
      <b-table striped hover :data="products" :columns="columns"></b-table>
    </b-card>
    <InputMenu></InputMenu>
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
import InputMenu from "@/InputMenu.vue";
import Vue from "vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy);

@Component
export default class LunchMenu extends Vue {
  components: {
    InputMenu;
  };
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
register {
  margin-left: 15%;
}
card {
  width: 90%;
}
</style>
