import axios from 'axios'
import { baseUrl } from './baseUrl'
import qs from 'qs';


//车辆列表
export const carList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/car-list`, { params: params }).then(res => res.data); 
}

//车辆信息
export const carInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/car-info`, { params: params }).then(res => res.data); 
}

//根据时间计算价格
export const carPrice = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/calculate-car-price-by-time`, { params: params }).then(res => res.data); 
}

//根据入住时间查询库存和价格
export const carChargeDetail = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/search-car-detail`, { params: params }).then(res => res.data); 
}

//下单租车
export const carOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/order-car`, params).then(res => res.data); 
}

//租车订单列表
export const carOrderList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/car-order-list`, { params: params }).then(res => res.data); 
}

//租车订单详情
export const carOrderInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/car-order-info`, { params: params }).then(res => res.data); 
}

//租车订单费用明细
export const carOrderDetail = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/car-order-detail`, { params: params }).then(res => res.data); 
}
