// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import NProgress from 'muse-ui-progress';
import Progress from 'muse-ui/lib/Progress';
import Helpers from 'muse-ui/lib/Helpers';
import 'muse-ui-progress/dist/muse-ui-progress.css';
import 'muse-ui-toast/dist/muse-ui-toast.all.css';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import Toast from 'muse-ui-toast';
import Loading from 'muse-ui-loading';
import { Icon, Button, Snackbar } from 'muse-ui';
import Cookies from 'js-cookie';
import Vuex from 'vuex';

Vue.use(NProgress);
Vue.use(Progress);
Vue.use(Helpers);
Vue.use(Loading, {
  target: document.getElementById('pageContainer'),
  text: '加载中...',
});
Vue.use(Toast);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Snackbar);
Vue.use(Vuex);

Vue.config.productionTip = false;

import axios from './http/http';
import { util } from './utils/base';
Vue.prototype.$util = util;
Vue.prototype.$http = axios;
Vue.prototype.$Cookies = Cookies;

import { setTitle } from './utils/setTitle';

router.beforeEach((to, from, next) => {
  NProgress.start();
  document.title = to.meta.title;
  setTitle(to.meta.title);
  next()
})

router.afterEach(() => {
  NProgress.done();
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  try {
    if (isChunkLoadFailed) {
      let LoadingChunk = window.sessionStorage.getItem('LoadingChunk');
      if (LoadingChunk) {
        window.sessionStorage.setItem('LoadingChunk', LoadingChunk - 0 + 1);
      } else {
        window.sessionStorage.setItem('LoadingChunk', 1);
      }
      if (LoadingChunk - 0 > 2) {
        // 防止 死循环
        alert('页面发生了错误，请重试！');
        location.replace('/home?id=' + localStorage.getItem('hotelId'));
        return false;
      }
      location.replace(targetPath);
      window.sessionStorage.setItem('LoadingChunkPath', targetPath);
      const sa = window.sa;
      if (sa && sa.track) {
        sa.track('element_click', {
          page_title: 'LoadingChunk',
          element_type: 'view',
          page_source: targetPath, // 当前路由
          element_name: `刷新页面${LoadingChunk - 0}次` // 尝试 打开次数
        });
      }

    }
  } catch (e) {
    console.log(e);
  }
});

router.onReady(vm => {
  try {
    let LoadingChunkPath = window.sessionStorage.getItem('LoadingChunkPath');
    
    const path = vm.path;
    if (LoadingChunkPath) {
      if (path !== LoadingChunkPath && path !== '/') {
        window.sessionStorage.setItem('LoadingChunkPath', vm.path);
        router.replace(vm.path);
      } else {
        router.replace(LoadingChunkPath);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

const store = new Vuex.Store({
  state: {
    kefuInfo: {
      mobile: '',
      serviceTime: '',
      wxQRcode: '',
    },
    kefuShow: false,
  },
  getters: {},
  mutations: {
    setKefu (state, newObj) {
      state.kefuInfo = Object.assign({}, newObj);
    },
    setKfShow (state, bool) {
      state.kefuShow = bool;
    },
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store: store,
  components: { App },
  render: h => h(App)
}).$mount('#app')
