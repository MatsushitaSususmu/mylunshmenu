<template>
  <form action class="form-body">
    <div class="modal-mask">
      <div class="card">
        <div class="card-header"></div>
        <div class="card-content">
          <b-field label="商品名(*)">
            <b-input type="text" v-model="itemName" required></b-input>
          </b-field>
          <b-field label="価格(*)">
            <b-input type="number" v-model="price" required></b-input>
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
              <div class="button">
                <b-icon icon="upload"></b-icon>
                <p>Click to upload</p>
              </div>
            </b-upload>
            <b-input class="file-name" v-else :value="picture.name" disabled></b-input>
          </b-field>
          <div class="card-footer">
            <div>
              <b-button label="登録" @click="registerStore()" class="is-primary"></b-button>
            </div>
            <div class="right-button">
              <b-button label="閉じる" @click="closeForm()"></b-button>
            </div>
          </div>
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
    { id: 3, name: "麺類" },
    { id: 4, name: "インスタントスープ" },
    { id: 5, name: "弁当" },
    { id: 6, name: "飲料" },
    { id: 7, name: "サラダ" },
    { id: 8, name: "惣菜・おつまみ" },
    { id: 9, name: "菓子" }
  ];
  picture: File | null = null;
  @Emit("closeForm")
  closeForm() {}
  mount() {
    this.init();
  }
  init() {
    this.itemName = "";
    this.price = 0;
    this.cal = 0;
    this.type = { id: 1, name: "パン" };
    this.picture = null;
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

    productsRef.add(input).then(ref => {
      console.log("Added document with ID: ", ref.id);
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
  width: 300%;
}

.modal-default-button {
  /* float: right; */
  height: auto;
  width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  /* 文字サイズを1.4emに指定 */
  font-size: 1em;
  /* 文字の太さをboldに指定 */
  font-weight: bold;
  /* 背景色を濃い青色に指定 */
  background-color: rgb(19, 134, 241);
  /* 文字色を白色に指定 */
  color: #fff;
  /* ボーダーをなくす */
  border-style: none;
  border-radius: 3px;
  /* ボタンの影の指定
    * 影の横幅を2px
    * 縦長を2px
    * ぼかしを3px
    * 広がりを1px
    * 色を#666（グレー）に指定 */
  box-shadow: 2px 2px 3px 1px #248;
  -moz-box-shadow: 2px 2px 3px 1px #248;
  -webkit-box-shadow: 2px 2px 3px 1px #248;
}

/*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */
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
