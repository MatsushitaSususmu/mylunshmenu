<template>
  <div class="header">
    <div class="theme-title">{{header}}</div>
    <aside class="section"></aside>
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
              striped
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
                <b-table-column
                  field="name"
                  label="商品名"
                  class="row-item"
                  sortable
                >{{props.row.name}}</b-table-column>
                <b-table-column field="picture" label="写真" class="row-item" sortable>
                  <img :src="props.row.picture" width="80" height="58" />
                </b-table-column>
                <b-table-column
                  field="price"
                  label="価格(税抜)"
                  class="row-item"
                  sortable
                >{{props.row.price}}</b-table-column>
                <b-table-column field="cal" label="カロリー" class="row-item" sortable>{{props.row.cal}}</b-table-column>
                <b-table-column
                  field="productType"
                  label="種別"
                  class="row-item"
                  sortable
                >{{props.row.productType}}</b-table-column>
                <b-table-column
                  field="updateDate"
                  label="日付"
                  class="row-item"
                  sortable
                >{{props.row.updateDate}}</b-table-column>
              </template>
            </b-table>
          </section>
        </div>
        <div>
          <b-modal :active.sync="isComponentModalActive" has-modal-card>
            <input-menu v-if="isComponentModalActive" @register="closeForm" @closeForm="closeForm"></input-menu>
          </b-modal>
        </div>
        <div class="card-footer right">
          <b-button :label="input" @click="openForm" class="is-primary"></b-button>
          <b-button :label="calc_cal" @click="openForm" class="is-primary right"></b-button>
          <b-button :label="calc_spending" @click="openForm" class="is-primary right"></b-button>
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
  header: string = "テーマ発表2019デモ";
  input: string = "今日のメニューを入力";
  calc_cal: string = "カロリー計算";
  calc_spending: string = "支出計算";
  items: ProductItem[] = [];
  showingItems: ShowingItems[] = [];
  isComponentModalActive: boolean = false;
  register: boolean = false;
  sortIcon: string = "arrow-up";
  sortIconSize: string = "is-small";
  defaultSortDirection: string = "asc";
  isPaginated: boolean = true;
  isPaginationSimple: boolean = false;
  paginationPosition: string = "bottom";
  currentPage: number = 1;
  perPage: number = 8;
  columns: { field: string; label: string }[] = [
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
    await this.createShowingList();
  }
  async createShowingList() {
    this.items = [];
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
      this.downloadPicture(x.id, x.picutureURL).then(function(value) {
        const record: ShowingItems = {
          name: x.name,
          cal: x.cal,
          picture: value || "../assets/lunchbox.png",
          productType: x.productType,
          price: x.price,
          updateDate: x.updateDate
        };
        acc.push(record);
      });
      return acc;
    }, []);
  }
  async downloadPicture(id: string, pictureURL: string): Promise<string> {
    let res: string = "";
    const storageRef = firebase.storage().ref();

    if (pictureURL == "") {
      res = await storageRef.child(`items/noimg.png`).getDownloadURL();
      return res;
    }

    res = await storageRef.child(`items/${pictureURL}`).getDownloadURL();
    return res;
  }
  openForm() {
    this.isComponentModalActive = !this.isComponentModalActive;
    console.log(this.isComponentModalActive);
  }
  async closeForm() {
    this.isComponentModalActive = false;
    await this.createShowingList();
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
.header {
  height: 20%;
}
.theme-title {
  margin-top: 20px;
  font-size: 40px;
  vertical-align: center;
  font-weight: bold;
}
table {
  width: 80%;
  margin-left: 5%;
}
.title {
  vertical-align: center;
  font-weight: bold;
}
.row-item {
  font-size: 20px;
  vertical-align: center;
  font-weight: bold;
}
register {
  margin-left: 15%;
}
.right {
  margin-left: 5px;
  vertical-align: right;
}
</style>
