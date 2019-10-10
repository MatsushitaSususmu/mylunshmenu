<template>
  <div class="header">
    <div class="header">{{header}}</div>
    <div class="card" style="width=60%">
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
              :data="showingItems"
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
                <b-table-column field="name" label="商品名" sortable>{{props.row.name}}</b-table-column>
                <b-table-column field="picture" label="写真" sortable>
                  <img :src="props.row.picture" width="50" height="38" />
                </b-table-column>
                <b-table-column field="price" label="価格(税抜)" sortable>{{props.row.price}}</b-table-column>
                <b-table-column field="cal" label="カロリー" sortable>{{props.row.cal}}</b-table-column>
                <b-table-column field="productType" label="種別" sortable>{{props.row.productType}}</b-table-column>
                <b-table-column field="updateDate" label="日付" sortable>{{props.row.updateDate}}</b-table-column>
              </template>
            </b-table>
          </section>
        </div>
        <div>
          <b-modal :active.sync="isComponentModalActive" has-modal-card>
            <input-menu></input-menu>
          </b-modal>
        </div>
        <div>
          <b-field>
            <img :src="tmpimages[0]" width="50" height="38" />
          </b-field>
        </div>
        <div class="card-footer right">
          <b-button :label="input" @click="openForm"></b-button>
        </div>
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
import { ShowingItems } from "@/showingItems.ts";
import * as firebase from "firebase/app";
import InputMenu from "./InputMenu.vue";

@Component({
  components: {
    InputMenu
  }
})
export default class LunchMenu extends Vue {
  header: string = "テーマ発表　2019デモ";
  input: string = "今日のメニューを入力";
  items: ProductItem[] = [];
  showingItems: ShowingItems[] = [];
  tmpimages: string[] = [];
  isComponentModalActive: boolean = false;
  register: boolean = false;
  sortIcon: string = "arrow-up";
  sortIconSize: string = "is-small";
  defaultSortDirection: string = "asc";
  isPaginated: boolean = true;
  isPaginationSimple: boolean = false;
  paginationPosition: string = "bottom";
  currentPage: number = 1;
  perPage: number = 10;
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
      field: "picuture",
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
        this.items.push({
          id: doc.id,
          name: doc.data().name,
          cal: doc.data().cal,
          picutureURL: doc.data().picutureURL,
          productType: doc.data().productType,
          price: doc.data().price,
          updateDate: doc.data().updateDate
        });
      });
    });

    this.showingItems = this.items.reduce((acc: ShowingItems[], x) => {
      const record: ShowingItems = {
        name: x.name,
        cal: x.cal,
        picuture: this.downloadPicture(x.id, x.picutureURL),
        productType: x.productType,
        price: x.price,
        updateDate: x.updateDate
      };
      acc.push(record);
      return acc;
    }, []);

    console.log(this.showingItems);
  }
  downloadPicture(id: string, pictureURL: string): File | null {
    console.log(pictureURL);
    let res = null;
    let i: string[] = [];
    if (pictureURL == "") {
      i.push(pictureURL);
      return res;
    }
    const storageRef = firebase.storage().ref();

    storageRef
      .child(`items/${pictureURL}`)
      .getDownloadURL()
      .then(function(url) {
        console.log("downloaded", url);
        res = url;
        i.push(url);
      })
      .catch(function(error) {
        console.log("error");
      });
    this.tmpimages = i;
    return res;
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
header {
  height: 20%;
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
