// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// iView
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

// axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// animate
import animated from 'animate.css'

// mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// live2d 4 vue
// import live2d4vue from 'live2d4vue'

Vue.use(ViewUI);
Vue.use(VueAxios, axios);
Vue.use(animated);
Vue.use(mavonEditor);
// Vue.use(live2d4vue);

axios.defaults.baseURL = 'http://127.0.0.1:8001/';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
