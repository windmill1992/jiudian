import axios from 'axios'
import { baseUrl } from './baseUrl'
import qs from 'qs';


//景点列表
export const jdList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/scenic-spot-list`, { params: params }).then(res => res.data); 
}

//景点信息
export const jdInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/scenic-spot-info`, { params: params }).then(res => res.data); 
}

//景点类型列表
export const jdTypeList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/scenic-spot-type-list`, { params: params }).then(res => res.data); 
}

//下单
export const jdOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/order-scenic-spot`, params).then(res => res.data); 
}

//门票订单列表
export const ticketOrderList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/scenic-spot-order-list`, { params: params }).then(res => res.data); 
}

//门票订单详情
export const ticketOrderInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/scenic-spot-order-list`, { params: params }).then(res => res.data); 
}
