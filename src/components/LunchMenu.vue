<template>
  <div style="width=80%">
    <div>
      <h1>昼食メニュー</h1>
    </div>
    <div>
      <b-button :label="input" @click="input" class="register"></b-button>
      <b-table striped hover focusable :data="products" :columns="columns"></b-table>
    </div>
    <div>
      <input-menu></input-menu>
    </div>
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
import InputMenu from "./InputMenu.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy);

@Component({
  components: {
    InputMenu
  }
})
export default class LunchMenu extends Vue {
  input: string = "登録";
  products: ProductItem[] = [];
  columns = [
    {
      field: "name",
      label: "名前"
    },
    {
      field: "cal",
      label: "カロリー"
    },
    {
      field: "picutureURL",
      label: "写真"
    },
    {
      field: "productType",
      label: "種類"
    },
    {
      field: "price",
      label: "価格"
    },
    {
      field: "updateDate",
      label: "日付"
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
          updateDate: doc.data().update_date
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
table {
  width: 80%;
  margin-left: 5%;
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
