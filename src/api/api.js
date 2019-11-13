import axios from 'axios'
import { baseUrl, appId } from './baseUrl'
import qs from 'qs';


//预订须知
export const explainInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/order-explain-info`, { params: params }).then(res => res.data); 
}

//活动列表
export const actList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/activity-list`, { params: params }).then(res => res.data); 
}

//获取支付参数
export const payData = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/wx-prepay?${qs.stringify(params)}`).then(res => res.data); 
}

//申请退款
export const applyRefund = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/wx-pay-refund`, { params: params }).then(res => res.data); 
}

//取消订单
export const cancelOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/cancel-order?${qs.stringify(params)}`).then(res => res.data); 
}

//获取验证码
export const sendCode = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/send-captcha?${qs.stringify(params)}`).then(res => res.data); 
}

//登录
export const login = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/login?${qs.stringify(params)}`).then(res => res.data); 
}

//微信登录
export const wxlogin = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/wx-login?${qs.stringify(params)}`).then(res => res.data); 
}

//修改用户名
export const saveUser = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/save-user?${qs.stringify(params)}`).then(res => res.data); 
}

//获取地址
export const userAddr = () => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/user-address`).then(res => res.data); 
}

//保存地址
export const saveAddr = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/save-user-address`, params).then(res => res.data); 
}

//客服电话
export const kefuTel = () => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/customer-service`).then(res => res.data); 
}

export const authorize = params => {
    location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ encodeURIComponent(params) +'&response_type=code&scope=snsapi_base&state=123#wechat_redirect');
}

export const wxAuth = params => {
    location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ encodeURIComponent(params) +'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect');
}