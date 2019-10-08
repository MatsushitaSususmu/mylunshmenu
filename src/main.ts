import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAurT5T3kPBdbz6hPVlbE0UnALAGx1r730',
  authDomain: 'matsushita-theme.firebaseapp.com',
  databaseURL: 'https://matsushita-theme.firebaseio.com',
  projectId: 'matsushita-theme',
  storageBucket: 'matsushita-theme.appspot.com',
  messagingSenderId: '529455253712',
  appId: '1:529455253712:web:3c4217766d9666bf'
}
firebase.initializeApp(config)

export default Vue.extend({
  data: () => {
    return {
      items: [{ name: 'aa', price: 100 }]
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
