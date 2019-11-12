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
      <div class="card-content">{{calculateResult}}</div>

      <div class="card-content">
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
              <b-table-column field="name" label="商品名" class="row-item" sortable>{{props.row.name}}</b-table-column>
              <b-table-column field="picture" label="写真" class="row-item" sortable>
                <img :src="props.row.picture" width="80" height="58" />
              </b-table-column>
              <b-table-column
                field="price"
                label="価格(税抜)"
                class="row-item"
                numeric
                sortable
              >{{props.row.price}}</b-table-column>
              <b-table-column
                field="cal"
                label="カロリー"
                class="row-item"
                numeric
                sortable　
              >{{props.row.cal}}</b-table-column>
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
        <b-datepicker
          placeholder="日付を選択"
          v-model="selectedDate"
          icon="calendar-today"
          class="right"
        ></b-datepicker>
        <b-button :label="calcDaily" @click="extractDaily" class="is-primary right"></b-button>
        <b-button :label="calcWeekly" @click="extractWeekly" class="is-primary right"></b-button>
        <b-button label="デモ用" @click="demonstration" class="is-primary right"></b-button>
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
import { ShowingItem } from "@/showingItem.ts";
import * as firebase from "firebase/app";
import InputMenu from "./InputMenu.vue";
import moment from "moment";

@Component({
  components: {
    InputMenu
  }
})
export default class LunchMenu extends Vue {
  items: ProductItem[] = [];
  showingItems: ShowingItem[] = [];
  noItem: ShowingItem = {
    name: "",
    cal: 0,
    picture: "",
    productType: "",
    price: 0,
    updateDate: ""
  };

  header: string = "テーマ発表2019デモ";
  input: string = "今日のメニューを入力";
  calcDaily: string = "1日のカロリー・支出";
  calcWeekly: string = "直近1週間のカロリー・支出";
  calculateResult: string = "";
  sortIcon: string = "arrow-up";
  sortIconSize: string = "is-small";
  defaultSortDirection: string = "desc";
  paginationPosition: string = "bottom";

  currentPage: number = 1;
  perPage: number = 8;
  totalCal: number = 0;
  totalSpending: number = 0;
  taxRate: number = 1.08;

  selectedDate: Date = new Date();

  isComponentModalActive: boolean = false;
  register: boolean = false;
  isPaginated: boolean = true;
  isPaginationSimple: boolean = false;

  columns: {}[] = [
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
        // this.items.push({
        //   id: doc.id,
        //   name: doc.data().name,
        //   cal: doc.data().cal,
        //   picutureURL: doc.data().picutureURL,
        //   productType: doc.data().productType,
        //   price: doc.data().price,
        //   updateDate: doc.data().updateDate
        // });
        this.items.push(doc.data() as ProductItem);
      });
    });

    this.showingItems = this.items.reduce((acc: ShowingItem[], x) => {
      this.downloadPictureURL(x.id, x.picutureURL).then(function(url) {
        const record: ShowingItem = {
          name: x.name,
          cal: x.cal,
          picture: url,
          productType: x.productType,
          price: x.price,
          updateDate: x.updateDate
        };
        acc.push(record);
      });
      return acc;
    }, []);
  }
  async downloadPictureURL(id: string, pictureURL: string): Promise<string> {
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
  extractDaily() {
    const now: string = moment(this.selectedDate).format("YYYY/MM/DD");
    let selected: ShowingItem[] | undefined;
    selected = this.showingItems.reduce((acc: ShowingItem[], x) => {
      if (x.updateDate === now) {
        const record: ShowingItem = {
          name: x.name,
          cal: x.cal,
          picture: x.picture,
          productType: x.productType,
          price: x.price,
          updateDate: x.updateDate
        };
        acc.push(record);
      }
      return acc;
    }, []);
    console.log("reduced");
    if (!(selected.length > 0)) {
      this.calculateResult = `
    ${now}の
    支出合計：0円(税込)
    摂取カロリー：0cal`;
      return;
    }

    this.showingItems = selected || this.noItem;
    this.totalSpending = Math.floor(
      selected.map(x => x.price).reduce((acc, x) => Number(acc) + Number(x)) *
        this.taxRate
    );
    this.totalCal = selected
      .map(x => x.cal)
      .reduce((acc, x) => Number(acc) + Number(x));
    this.calculateResult = `
    ${now}の
    支出合計：${this.totalSpending}円(税込)
    摂取カロリー：${this.totalCal}cal`;
    console.log(this.calculateResult);
  }
  extractWeekly() {
    const now = moment(new Date()).format("YYYY/MM/DD");
    const from = moment()
      .subtract(1, "week")
      .format("YYYY/MM/DD");
    const selected: ShowingItem[] = this.showingItems.reduce(
      (acc: ShowingItem[], x) => {
        if (from < x.updateDate && x.updateDate <= now) {
          const record: ShowingItem = {
            name: x.name,
            cal: x.cal,
            picture: x.picture,
            productType: x.productType,
            price: x.price,
            updateDate: x.updateDate
          };
          acc.push(record);
        }
        return acc;
      },
      []
    );
    this.showingItems = selected;
    this.totalSpending = Math.floor(
      selected.map(x => x.price).reduce((acc, x) => Number(acc) + Number(x)) *
        this.taxRate
    );
    this.totalCal = selected
      .map(x => x.cal)
      .reduce((acc, x) => Number(acc) + Number(x));
    this.calculateResult = `${from}~${now}の支出合計：${this.totalSpending}円(税込)\n
    摂取カロリー：${this.totalCal}cal`;
  }
  demonstration() {
    //demo 詳細ソート？
    alert(`${this.showingItems[0].name}
    ${typeof this.showingItems[0].price}
    ${this.showingItems[0].cal}
    ${this.showingItems[0].productType}
    ${this.showingItems[0].updateDate}`);
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
