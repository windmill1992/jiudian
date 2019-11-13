<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box">
                <div class="flex spb fcen">
                    <p class="name">{{info.scenicSpotVO.scenicSpotName}}</p>
                    <router-link :to="'/jingdian/detail/' + info.scenicSpotVO.scenicSpotId" class="nav flex fcen">景点详情 <img src="/static/img/arr.png" alt="" /></router-link>
                </div>
                <div class="addr flex fcen">
                    <img src="../../assets/img/jd/map.png" alt="" />
                    <p>{{info.scenicSpotVO.scenicSpotAddress}}</p>
                </div>
            </div>
            <div class="info">
                <p class="name">门票信息</p>
                <div class="txts flex fcen spb">
                    <p>{{info.ticketsName}}</p>
                    <p class="txt">{{info.ticketsCount}}张 | {{info.orderDate | fmt}}</p>
                </div>
                <div class="txts flex spb">
                    <p>合计</p>
                    <p class="txt">¥{{info.totalCharge + info.discountCharge}}</p>
                </div>
            </div>
        </div>
        <div class="mid">
            <div class="order">
                <p class="name">订单信息</p>
                <div class="item flex spb fcen">
                    <p>预订人</p>
                    <p class="txt">{{info.userName}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>手机号</p>
                    <p class="txt">{{info.mobile}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>身份证号</p>
                    <p class="txt">{{info.identityCard}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>订单号</p>
                    <p class="txt">{{info.orderNo}}</p>
                </div>
                <div class="item flex spb fcen" v-if="info.orderStatus > 0">
                    <p>支付时间</p>
                    <p class="txt">{{info.payTime | fmt1}}</p>
                </div>
                <div class="item flex spb fcen" v-else>
                    <p>下单时间</p>
                    <p class="txt">{{info.createTime | fmt1}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>订单状态</p>
                    <p class="txt">{{stateArr[info.orderStatus]}}</p>
                </div>
                <div class="item flex spb fcen" v-if="time">
                    <p>订单剩余支付时间</p>
                    <p class="txt">{{time}}</p>
                </div>
                <template v-if="info.orderStatus == 4">
                    <div class="item flex spb fcen">
                        <p>退款时间</p>
                        <p class="txt">{{info.updateTime | fmt1}}</p>
                    </div>
                    <div class="item flex spb fcen">
                        <p>退款金额</p>
                        <p class="txt">¥{{info.refundCharge}}</p>
                    </div>
                </template>
            </div>
        </div>
        <div class="bot">
            <div class="btns flex">
                <a href="javascript:;" class="btn" @click="cancel" v-if="info.orderStatus == 1 && canCancel">取消订单</a>
                <a href="javascript:;" class="btn" @click="toPay" v-if="info.orderStatus == 0 && canPay" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">去支付</a>
                <a href="javascript:;" class="btn btn1" @click="openSel = true;">客服电话</a>
            </div>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <a :href="'tel:' + kefu" class="item">{{kefu}}</a>
            <a href="javascript:;" class="item no" @click="openSel = false;">取消</a>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import { BottomSheet, Dialog } from 'muse-ui';
import { ticketOrderList, jdInfo } from '../../api/jingdian';
import { cancelOrder, payData, authorize, kefuTel } from '../../api/api';
import moment from 'moment';
export default {
    data() {
        return {
            info: {
                scenicSpotVO: {},
            },
            openSel: false,
            feeInfo: {},
            stateArr: ['未支付', '已支付', '已完成', '已取消', '已退款', '待确认', '已确认', '待退款', '待退款', '已过期'],
            hotelTel: '',
            canCancel: false,
            canPay: false,
            time: '',
            kefu: '',
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '/';
            let dd = new Date(t);
            let m = dd.getMonth() + 1;
            let d = dd.getDate();
            return m + '月' + d + '日';
        },
        fmt1(t) {
            if (!t) return '--';
            return moment(t).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            ticketOrderList({ orderId: this.id, pageIndex: 1, pageSize: 1 }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    if (res.resultData.list && res.resultData.list[0]) {
                        this.info = res.resultData.list[0];
                        if (this.info.orderStatus == 0) {
                            if ((Date.now() - this.info.createTime) >= 600 * 1000) {
                                this.canPay = false;
                            } else {
                                this.canPay = true;
                                this.countdown();
                            }
                        } else {
                            sessionStorage.removeItem('ticketsName');
                            sessionStorage.removeItem('payJd');
                        }
                        this.getJdInfo();
                    } else {
                        this.$toast.error('订单不存在');
                        this.$router.replace('/orders/ticketOrders');
                    }
                } else if (res.resultCode == 4002){
                    this.$Cookies.set('uid', '');
					this.$router.push('/login?from='+ encodeURIComponent(this.$route.fullPath));
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('服务器开了小差，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.loading.close();
                this.$toast.error('未知异常！');
                console.log(err);
            })
        },
        getJdInfo() {
            jdInfo({ scenicSpotId: this.info.scenicSpotVO.scenicSpotId }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData.ticketsVOList;
                    let obj = r.filter(item => {
                        return item.ticketsId == this.info.ticketsId;
                    });
                    if (this.info.orderStatus == 1) {
                        let ts = new Date(moment(Date.now()).format('YYYY-MM-DD') + ' ' + obj[0].startTime.split(' ')[1]).getTime();
                        if (Date.now() >= (ts - 3600 * 1000)) {
                            this.canCancel = false;
                        } else {
                            this.canCancel = true;
                        }
                    }
                }
            })
        },
        toPay() {
            this.loading1 = true;
            let payInfo = sessionStorage.getItem('payJd');
            if (payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                sessionStorage.setItem('ticketsName', this.info.ticketsName);
                let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                authorize(rurl);
            }
        },
        getPayData() {
            let pname = sessionStorage.getItem('ticketsName');
            payData({ code: this.code, refType: 1, orderId: this.id, proName: pname }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.payParams = res.resultData;
                    sessionStorage.setItem('payJd', JSON.stringify(res.resultData));
                    this.pay();
                } else {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/orders/ticket?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                }
            })
            .catch(err => {
                this.loading1 = false;
                this.$toast.error('获取微信支付参数失败，请重试');
                setTimeout(() => {
                    let urls = '/orders/ticket?id=' + this.id;
                    history.pushState(null, null, urls);
                    location.href = urls;
                }, 1000);
            })
        },
        pay() {
            const that = this;
            function onBridgeReady() {
                that.$util.showTips('正在拉起微信支付...');
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": that.payParams.appid,     //公众号名称，由商户传入     
                        "timeStamp": that.payParams.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr": that.payParams.nonceStr, //随机串     
                        "package": 'prepay_id=' + that.payParams.prepayid,     
                        "signType": "MD5",         //微信签名方式
                        "paySign": that.payParams.paySign, //微信签名
                    },
                    function(res) {
                        that.loading1 = false;
                        if (res.err_msg == "get_brand_wcpay_request:ok"){
                            that.$toast.success('支付成功');
                            sessionStorage.removeItem('ticketsName');
                            sessionStorage.removeItem('payJd');
                            location.replace('/orders/ticket?id=' + that.id);
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            that.$toast.error('支付取消');
                            that.cancelPay = true;
                        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                            that.$toast.error('支付失败');
                            that.cancelPay = true;
                        }
                }); 
            }
            if (typeof WeixinJSBridge == "undefined"){
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        },
        cancel() {
            const that = this;
            this.$confirm('确定要取消订单吗？', '提示', {
                type: 'warning'
            }).then(({ result }) => {
                if (result) {
                    cancelOrder({ orderId: this.id, refType: 1 }).then(res => {
                        if (res.resultCode == 200 && res.resultData) {
                            this.$toast.success('提交成功');
                            this.getData();
                            this.canCancel = false;
                        } else {
                            if (res.resultMsg) {
                                this.$toast.error(res.resultMsg);
                            } else {
                                this.$toast.error('网络异常，请稍后再试！');
                            }
                        }
                    })
                    .catch(err => {
                        this.$toast.error('提交失败，请联系客服！');
                        console.log(err);
                    })
                }
            });
        },
        countdown() {
            let t = Math.floor((this.info.createTime + 600 * 1000 - Date.now()) / 1000);
            let m = parseInt(t / 60);
            let s = t % 60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            this.time = m + ':' + s;
            let timer = setInterval(() => {
                t = Math.floor((this.info.createTime + 600 * 1000 - Date.now()) / 1000);
                if (t <= 0) {
                    clearInterval(timer);
                    this.time = '';
                    this.canPay = false;
                } else {
                    m = parseInt(t / 60);
                    s = t % 60;
                    m = m < 10 ? '0' + m : m;
                    s = s < 10 ? '0' + s : s;
                    this.time = m + ':' + s;
                }
            }, 1000);
        },
        getKefuTel() {
            kefuTel().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.kefu = res.resultData.mobile;
                }
            })
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            let code = this.$route.query.code;
            if (code && sessionStorage.getItem('ticketsName')) {
                this.code = code;
                this.getPayData();
            }
            this.getData();
            this.getKefuTel();
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/orders/ticketOrders');
        }
    }
}
Vue.use(BottomSheet);
Vue.use(Message);
Vue.use(Dialog);
</script>

<style scoped lang="less">
#pageContainer {
    min-height: 100vh;
    height: auto;
    background: #F8F8F8;
    padding-bottom: .8rem;
}
.top {
    overflow: hidden;
    background: #fff;
    .box {
        padding: .2rem .16rem .25rem 0;
        margin-left: .16rem;
        border-bottom: 1px solid #f6f6f6;
        .name {
            font-size: .18rem;
            color: #222;
            white-space: nowrap;
        }
        .nav {
            font-size: .12rem;
            color: #0098AC;
            line-height: 1;
            img {
                width: .12rem;
                height: .12rem;
                vertical-align: top;
                margin-top: 1px;
            }
        }
        .addr {
            font-size: .14rem;
            color: #666;
            margin-top: 5px;
            img {
                height: .14rem;
                width: auto;
            }
        }
    }
    .info {
        padding: .25rem .16rem;
        font-size: .14rem;
        .name {
            color: #9C9C9C;
        }
        .time {
            color: #666;
        }
        .txt {
            color: #9C9C9C;
            margin-top: 5px;
        }
        .price {
            color: #666;
        }
        .mx {
            font-size: .12rem;
            color: #0098AC;
            img {
                width: .12rem;
                height: .12rem;
                margin-top: 2px;
            }
        }
    }
}
.mid {
    margin-top: .12rem;
    background: #fff;
    padding: .2rem .16rem;
    .name {
        margin-bottom: .2rem;
    }
    .item {
        margin-bottom: .05rem;
        font-size: .14rem;
        color: #9c9c9c;
    }
    .txt {
        color: #666;
        max-width: 80%;
        text-align: right;
        word-break: break-all;
    }
}
.bot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .76rem;
    background: #fff;
    z-index: 1;
    .btns {
        padding: .16rem;
    }
    .btn {
        width: 100%;
        height: .44rem;
        line-height: .44rem;
        border: 1px solid #0098AC;
        border-radius: .04rem;
        text-align: center;
        font-size: .16rem;
        color: #0098AC;
        font-weight: bold;
        letter-spacing: 1px;
        margin-right: .15rem;
        &.btn1 {
            background: #0098AC;
            color: #fff;
            margin-right: 0;
        }
    }
}
.bot-s2 {
    .item {
        display: block;
        height: .44rem;
        line-height: .44rem;
        text-align: center;
        font-size: .16rem;
        color: #0098AC;
        &.no {
            color: #9c9c9c;
            border-top: 1px solid #eaeaea;
        }
    }
}
</style>