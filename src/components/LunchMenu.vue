<template>
  <div class="card">
    <div class="card-header">
      <div class="title">
        <h1>昼食メニュー</h1>
      </div>
    </div>
    <div class="card-content">
      <div>
        <section>
          <b-table
            hover
            focusable
            :data="products"
            :paginated="isPaginated"
            :per-page="perPage"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="updateDate"
            :default-sort-direction="defaultSortDirection"
          >
            <template slot-scope="props">
              <b-table-column
                v-for="column in columns"
                :key="column.field"
                :field="column.field"
                :label="column.label"
                sortable
              >{{ props.row[column.field] }}</b-table-column>
            </template>
          </b-table>
        </section>
      </div>
      <div>
        <b-modal :active.sync="isComponentModalActive" has-modal-card>
          <input-menu></input-menu>
        </b-modal>
      </div>
      <div class="card-footer right">
        <b-button :label="input" @click="openForm"></b-button>
      </div>
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

@Component({
  components: {
    InputMenu
  }
})
export default class LunchMenu extends Vue {
  input: string = "今日のメニューを入力";
  products: ProductItem[] = [];
  isComponentModalActive: boolean = false;
  register: boolean = false;
  sortIcon: string = "arrow-up";
  sortIconSize: string = "is-small";
  defaultSortDirection: string = "asc";
  isPaginated: boolean = true;
  isPaginationSimple: boolean = false;
  paginationPosition: string = "bottom";
  currentPage: number = 1;
  perPage: number = 4;
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

    await productsRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.products.push({
          name: doc.data().name,
          cal: doc.data().cal,
          picutureURL: doc.data().picutureURL,
          productType: doc.data().productType,
          price: doc.data().price,
          updateDate: doc.data().updateDate
        });
      });
    });
  }
  openForm(): void {
    this.isComponentModalActive = !this.isComponentModalActive;
    console.log(this.isComponentModalActive);
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
right {
  vertical-align: right;
}
</style>
