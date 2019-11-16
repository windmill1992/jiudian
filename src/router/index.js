import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: '聚洋科技' },
      component: resolve =>  require(['../view/index.vue'], resolve),
    },
    {
      path: '/home',
      name: 'home',
      meta: { title: '聚洋科技' },
      component: resolve =>  require(['../view/home.vue'], resolve),
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录/注册' },
      component: resolve =>  require(['../view/login.vue'], resolve),
    },
    {
      path: '/user',
      name: 'user',
      meta: { title: '个人中心' },
      component: resolve =>  require(['../view/ucenter.vue'], resolve),
    },
    {
      path: '/address',
      name: 'address',
      meta: { title: '添加地址' },
      component: resolve =>  require(['../view/address.vue'], resolve),
    },
    {
      path: '/about',
      name: 'about',
      meta: { title: '关于我们' },
      component: resolve =>  require(['../view/about.vue'], resolve),
    },
    {
      path: '/car',
      name: 'car',
      meta: { title: '租车' },
      component: resolve =>  require(['../view/car/index.vue'], resolve),
    },
    {
      path: '/car/search',
      name: 'carSearch',
      meta: { title: '搜索' },
      component: resolve =>  require(['../view/car/search.vue'], resolve),
    },
    {
      path: '/car/protocol',
      name: 'protocol',
      meta: { title: '预订条款' },
      component: resolve =>  require(['../view/car/prot.vue'], resolve),
    },
    {
      path: '/jingdian',
      name: 'jingdian',
      meta: { title: '景点' },
      component: resolve =>  require(['../view/jingdian/index.vue'], resolve),
    },
    {
      path: '/jingdian/search',
      name: 'jingdianSearch',
      meta: { title: '搜索' },
      component: resolve =>  require(['../view/jingdian/search.vue'], resolve),
    },
    {
      path: '/jingdian/detail/:id',
      name: 'jdDetail',
      meta: { title: '景点详情' },
      component: resolve =>  require(['../view/jingdian/detail.vue'], resolve),
    },
    {
      path: '/jingdian/tickets/:id',
      name: 'jdTickets',
      meta: { title: '景点门票' },
      component: resolve =>  require(['../view/jingdian/tickets.vue'], resolve),
    },
    {
      path: '/hotel/:id',
      name: 'hotel',
      meta: { title: '酒店' },
      component: resolve =>  require(['../view/hotel/index.vue'], resolve),
    },
    {
      path: '/hotel/detail/:id',
      name: 'hotelDetail',
      meta: { title: '酒店详情' },
      component: resolve =>  require(['../view/hotel/detail.vue'], resolve),
    },
    {
      path: '/specialty',
      name: 'specialty',
      meta: { title: '精选特产' },
      component: resolve =>  require(['../view/specialty/index.vue'], resolve),
    },
    {
      path: '/specialty/detail/:id',
      name: 'specialityDetail',
      meta: { title: '详情' },
      component: resolve =>  require(['../view/specialty/detail.vue'], resolve),
    },
    {
      path: '/pay/car',
      name: 'carOrder',
      meta: { title: '车辆详情' },
      component: resolve =>  require(['../view/car/order.vue'], resolve),
    },
    {
      path: '/pay/ticket',
      name: 'jdOrder',
      meta: { title: '门票预订' },
      component: resolve =>  require(['../view/jingdian/order.vue'], resolve),
    },
    {
      path: '/pay/hotel',
      name: 'hotelOrder',
      meta: { title: '酒店预订' },
      component: resolve =>  require(['../view/hotel/order.vue'], resolve),
    },
    {
      path: '/pay/specialty',
      name: 'specialtyOrder',
      meta: { title: '提交订单' },
      component: resolve =>  require(['../view/specialty/order.vue'], resolve),
    },
    {
      path: '/paySuccess/:type/:id',
      name: 'paySuccess',
      meta: { title: '支付成功' },
      component: resolve =>  require(['../view/paySuccess.vue'], resolve),
    },
    {
      path: '/orders/carOrders',
      name: 'carOrders',
      meta: { title: '租车订单' },
      component: resolve =>  require(['../view/orders/carOrders.vue'], resolve),
    },
    {
      path: '/orders/ticketOrders',
      name: 'ticketOrders',
      meta: { title: '景点门票订单' },
      component: resolve =>  require(['../view/orders/ticketOrders.vue'], resolve),
    },
    {
      path: '/orders/hotelOrders/:id',
      name: 'hotelOrders',
      meta: { title: '酒店订单' },
      component: resolve =>  require(['../view/orders/hotelOrders.vue'], resolve),
    },
    {
      path: '/orders/specialtyOrders',
      name: 'specialityOrders',
      meta: { title: '特产订单' },
      component: resolve =>  require(['../view/orders/specialtyOrders.vue'], resolve),
    },
    {
      path: '/orders/car',
      name: 'ordersCar',
      meta: { title: '订单详情' },
      component: resolve =>  require(['../view/orders/car.vue'], resolve),
    },
    {
      path: '/orders/hotel',
      name: 'ordersHotel',
      meta: { title: '订单详情' },
      component: resolve =>  require(['../view/orders/hotel.vue'], resolve),
    },
    {
      path: '/orders/ticket',
      name: 'ordersTicket',
      meta: { title: '订单详情' },
      component: resolve =>  require(['../view/orders/ticket.vue'], resolve),
    },
    {
      path: '/orders/specialty',
      name: 'ordersSpecialty',
      meta: { title: '订单详情' },
      component: resolve =>  require(['../view/orders/specialty.vue'], resolve),
    },
    {
      path: '*',
      name: 'notFound',
      meta: { title: '页面未找到' },
      component: resolve =>  require(['../404.vue'], resolve),
    },
  ]
})
