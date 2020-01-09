<template>
  <form action class="form-body">
    <div class="modal-mask">
      <div class="card">
        <div class="card-header"></div>
        <div class="card-content">
          <template slot-scope="props">
            <b-field field="name" label="商品名" class="row-item" sortable>{{props.row.name}}</b-field>
            <b-field field="picture" label="写真" class="row-item" sortable>
              <img :src="props.row.picture" width="80" height="58" />
            </b-field>
            <b-field
              field="price"
              label="価格(税抜)"
              class="row-item"
              numeric
              sortable
            >{{props.row.price}}</b-field>
          </template>
        </div>
      </div>
    </div>
  </form>
</template>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-storage.js"></script>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { ProductItem } from "@/product.ts";
import { InputItem } from "@/input.ts";
import { ItemType } from "@/itemType.ts";
import * as firebase from "firebase/app";
import moment from "moment";
import { ShowingItem } from "../showingItem";

@Component
export default class InputMenu extends Vue {
  today: Date = new Date();

  itemName: string = "";

  price: number = 0;
  cal: number = 0;

  type: ItemType = { id: 1, name: "パン" };
  itemType: ItemType[] = [
    { id: 1, name: "パン" },
    { id: 2, name: "おにぎり" },
    { id: 3, name: "麺類" },
    { id: 4, name: "インスタントスープ" },
    { id: 5, name: "弁当" },
    { id: 6, name: "飲料" },
    { id: 7, name: "サラダ" },
    { id: 8, name: "惣菜・おつまみ" },
    { id: 9, name: "菓子" }
  ];

  picture: File | null = null;
  @Prop()
  recommendProps?: ShowingItem;
  @Emit("closeForm")
  closeForm() {}
  mount() {
    this.init();
  }
  init() {
    console.log("recommended...");
    console.dir(this.recommendProps);
  }
  registerStore() {
    if (!this.itemName || !this.price) {
      return;
    }
    const productsRef = firebase.firestore().collection("products");
    const input: InputItem = {
      name: this.itemName,
      cal: this.cal,
      picutureURL: this.picture ? this.picture.name : "",
      productType: this.type.name,
      price: this.price,
      updateDate: moment(new Date()).format("YYYY/MM/DD")
    };

    // productsRef.add(input).then(ref => {
    productsRef
      .doc()
      .set(input)
      .then(ref => {
        console.log("Added document with ID: ");
      });

    if (this.picture) {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(`items/${this.picture.name}`)
        .put(this.picture)
        .then(function(snapshot) {
          console.log("Uploaded a blob or file!");
        });
    }

    this.closeForm();
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
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  /*
    width: 50%;
    */
  width: 400px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
}

.modal-header {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: start;
  align-items: flex-start;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1rem;
  margin: 20px 0;
}
.modal-footer {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  margin: 20px 0;
}
.modal-footer > :not(:first-child) {
  margin-left: 0.25rem;
}

.modal-footer > :not(:last-child) {
  margin-right: 0.25rem;
}
.form-body {
  margin-left: -100%;
  width: 300%;
}

.modal-default-button {
  height: auto;
  width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 1em;
  font-weight: bold;
  background-color: rgb(19, 134, 241);
  color: #fff;
  border-style: none;
  border-radius: 3px;
  box-shadow: 2px 2px 3px 1px #248;
  -moz-box-shadow: 2px 2px 3px 1px #248;
  -webkit-box-shadow: 2px 2px 3px 1px #248;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
