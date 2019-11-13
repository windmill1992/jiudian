import axios from 'axios'
import { baseUrl } from './baseUrl'
import qs from 'qs';


//特产列表
export const specialtyList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/specialty-list`, { params: params }).then(res => res.data); 
}

//特产信息
export const specialtyInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/specialty-info`, { params: params }).then(res => res.data); 
}

//特产下单
export const specialtyOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/order-specialty`, params).then(res => res.data); 
}

//确认收货
export const confirmOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/confirm-order?${qs.stringify(params)}`).then(res => res.data); 
}

//特产订单列表
export const specialtyOrderList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/specialty-order-list`, { params: params }).then(res => res.data); 
}

//特产订单详情
export const specialtyOrderInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/specialty-order-info`, { params: params }).then(res => res.data); 
}

//特产费用明细
export const specialtyOrderDetail = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/specialty-order-detail`, { params: params }).then(res => res.data); 
}
