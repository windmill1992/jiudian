import axios from 'axios'
import { baseUrl } from './baseUrl'
import qs from 'qs';


//酒店信息
export const hotelInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/hotel-info`, { params: params }).then(res => res.data); 
}

//酒店设施列表
export const hotelFacilityList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/manage/hotel-facility-list`, { params: params }).then(res => res.data); 
}

//根据入住时间计算价格
export const hotelPrice = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/calculate-hotel-price-by-time`, { params: params }).then(res => res.data); 
}

//根据入住时间查询房型库存和价格
export const hotelChargeDetail = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/search-hotel-room-detail`, { params: params }).then(res => res.data); 
}

//下单
export const hotelOrder = params => { 
    return axios.post(`${baseUrl}/jykj/jykj-rest/order-hotel`, params).then(res => res.data); 
}

//订单列表
export const hotelOrderList = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/hotel-order-list`, { params: params }).then(res => res.data); 
}

//订单详情
export const hotelOrderInfo = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/hotel-order-info`, { params: params }).then(res => res.data); 
}

//费用明细
export const hotelOrderDetail = params => { 
    return axios.get(`${baseUrl}/jykj/jykj-rest/hotel-order-detail`, { params: params }).then(res => res.data); 
}