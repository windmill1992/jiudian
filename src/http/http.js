/**
 * Created by vikey on 2018/11/17.
 */
/**
 * http配置
 * * */
// 引入axios
import axios from 'axios'
import Cookies from 'js-cookie';
// axios 配置
axios.defaults.timeout = 30000;
//添加请求拦截器

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers.applicationId = 1;
    config.headers.applicationClientType = 1;
    config.headers['Content-Type'] = 'application/json';

    let uid = Cookies.get('uid');
    if (uid != undefined) {
      config.headers.userId = uid;
    } else {
      config.headers.userId = '';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


export default axios;
