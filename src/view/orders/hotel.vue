<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box">
                <div class="flex fcen">
                    <p class="name flex1">{{info.hotelName}}</p>
                    <router-link :to="'/hotel/' + info.hotelId" class="nav flex fcen">详情 <img src="/static/img/arr.png" alt="" /></router-link>
                </div>
                <div class="addr flex">
                    <img src="../../assets/img/hotel/map.png" alt="" />
                    <p>{{info.hotelAddress}}</p>
                </div>
            </div>
            <div class="info">
                <p class="name">{{info.hotelRoomName}}</p>
                <p class="time" v-if="!notHotel">{{info.startTime | fmt}}-{{info.endTime | fmt}} 共{{dateNum}}晚</p>
                <p class="time" v-else>{{info.startTime | fmt}}</p>
                <p class="txt">在线支付</p>
                <div class="flex fcen spb">
                    <p class="price">￥{{info.totalCharge}}</p>
                    <a href="javascript:;" class="mx flex fcen" @click="openSel = true;">费用明细 <img src="/static/img/arr.png" alt="" /></a>
                </div>
            </div>
        </div>
        <div class="mid">
            <div class="order">
                <p class="tip">订单信息</p>
                <div class="item flex spb fcen">
                    <p>{{notHotel ? '预订' : '入住'}}人</p>
                    <p class="txt">{{info.userName}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>手机号</p>
                    <p class="txt">{{info.mobile}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>订单号</p>
                    <p class="txt">{{info.orderNo}}</p>
                </div>
                <div class="item flex spb fcen" v-if="info.orderStatus > 0">
                    <p>支付时间</p>
                    <p class="txt">{{info.payTime | fmt2}}</p>
                </div>
                <div class="item flex spb fcen" v-else>
                    <p>下单时间</p>
                    <p class="txt">{{info.createTime | fmt2}}</p>
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
                        <p class="txt">{{info.updateTime | fmt2}}</p>
                    </div>
                    <div class="item flex spb fcen">
                        <p>退款金额</p>
                        <p class="txt">¥{{info.refundCharge}}</p>
                    </div>
                </template>
            </div>
        </div>
        <div class="bot">
            <div class="btns flex spb">
                <a href="javascript:;" class="btn" @click="cancel" v-if="info.orderStatus == 6 && canCancel">取消订单</a>
                <a href="javascript:;" class="btn" @click="toPay" v-if="info.orderStatus == 0 && canPay" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">去支付</a>
                <a href="javascript:;" class="btn btn1" @click="openSel2 = true;">电话咨询</a>
            </div>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s1" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel = false;">关闭</a></p>
            <div class="top">
                <div class="txt flex spb">
                    <p>全部费用</p>
                    <p>¥{{feeInfo.totalCharge}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeInfo.detailList" :key="'fee' + index">
                    <p>{{item.day | fmt1}}</p>
                    <p>¥{{item.serviceCharge / item.times || 0}} x {{item.times}}{{notHotel ? '' : '间'}}</p>
                </div>
            </div>
            <div class="yh flex spb">
                <p>优惠</p>
                <p class="num">-¥{{info.discountCharge}}</p>
            </div>
            <div class="total-txt">合计 <span class="total">¥<span class="fz">{{info.totalCharge}}</span></span></div>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel2" class="bot-s2" :overlay="false">
            <a :href="'tel:' + hotelTel" class="item">{{hotelTel}}</a>
            <a href="javascript:;" class="item no" @click="openSel2 = false;">取消</a>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel || openSel2" @click="openSel = false;openSel2 = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import { BottomSheet, Dialog } from 'muse-ui';
import { hotelOrderInfo, hotelOrderDetail } from '../../api/hotel';
import { cancelOrder, payData, authorize } from '../../api/api';
import moment from 'moment';
export default {
    data() {
        return {
            info: {},
            openSel: false,
            openSel2: false,
            total: 0,
            dateNum: 0,
            stateArr: ['未支付', '已支付', '已完成', '已取消', '已退款', '待确认', '已确认', '待退款', '待取消', '已过期'],
            feeInfo: {},
            hotelTel: '',
            canCancel: false,
            canPay: false,
            time: '',
            notHotel: false,
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
            if (!t) return '';
            return t.substr(0, 10);
        },
        fmt2(t) {
            if (!t) return '--';
            return moment(t).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            hotelOrderInfo({ hotelOrderId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    let d = Math.floor((res.resultData.endTime - res.resultData.startTime) / 1000);
                    this.dateNum = Math.ceil(d / 60 / 60 / 24);
                    this.getHotelOrderDetail();
                    if (this.info.orderStatus == 0) {
                        if ((Date.now() - this.info.createTime) >= 600 * 1000) {
                            this.canPay = false;
                        } else {
                            this.canPay = true;
                            this.countdown();
                        }
                    } else {
                        let ts = Date.now();
                        let dd = moment(res.resultData.startTime).format('YYYY-MM-DD');
                        let ts1 = new Date(dd + ' ' + '12:00:00').getTime();
                        if (ts >= ts1) {
                            this.canCancel = false;
                        } else {
                            this.canCancel = true;
                        }
                        sessionStorage.removeItem('hotelName');
                        sessionStorage.removeItem('payHotel');
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
        getHotelOrderDetail() {
            hotelOrderDetail({ hotelOrderId: this.id }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.feeInfo = res.resultData;
                }
            })
        },
        toPay() {
            this.loading1 = true;
            let payInfo = sessionStorage.getItem('payHotel');
            if (payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                sessionStorage.setItem('hotelName', this.info.hotelName);
                let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                authorize(rurl);
            }
        },
        getPayData() {
            let pname = sessionStorage.getItem('hotelName');
            payData({ code: this.code, refType: 2, orderId: this.id, proName: pname }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.payParams = res.resultData;
                    sessionStorage.setItem('payHotel', JSON.stringify(res.resultData));
                    this.pay();
                } else {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/orders/hotel?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                }
            })
            .catch(err => {
                this.loading1 = false;
                this.$toast.error('获取微信支付参数失败，请重试');
                setTimeout(() => {
                    let urls = '/orders/hotel?id=' + this.id;
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
                            sessionStorage.removeItem('hotelName');
                            sessionStorage.removeItem('payHotel');
                            location.replace('/orders/hotel?id=' + that.id);
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
                    cancelOrder({ orderId: this.id, refType: 2 }).then(res => {
                        if (res.resultCode == 200 && res.resultData) {
                            this.$toast.success('提交成功，请等待后台审核.');
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
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            let code = this.$route.query.code;
            if (code && sessionStorage.getItem('hotelName')) {
                this.code = code;
                this.getPayData();
            }
            this.hotelTel = localStorage.getItem('hotelTel');
            this.getData();
            this.notHotel = localStorage.getItem('notHotel') == 1;
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
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
                margin-top: 2px;
            }
        }
        .addr {
            font-size: .14rem;
            color: #666;
            margin-top: 5px;
            img {
                height: .14rem;
                width: auto;
                margin-top: .04rem;
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
    .tip {
        font-size: .18rem;
        color: #222;
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
.bot-s1 {
    .title {
        text-align: center;
        position: relative;
        font-size: .15rem;
        color: #222;
        height: .5rem;
        line-height: .5rem;
        border-bottom: 1px solid #EAEAEA;
        .btn {
            position: absolute;
            right: .1rem;
            top: 0;
            line-height: .5rem;
            font-size: .13rem;
            color: #666;
        }
    }
    .top {
        padding: .2rem .16rem .25rem 0;
        margin-left: .16rem;
        border-bottom: 1px solid #EAEAEA;
        .txt {
            font-size: .14rem;
            color: #666;
            margin-bottom: .1rem;
        }
        .item {
            font-size: .14rem;
            color: #222;
            margin: .06rem 0;
        }
    }
    .yh {
        padding: .2rem .16rem .2rem 0;
        margin-left: .16rem;
        font-size: .14rem;
        color: #666;
        border-bottom: 1px solid #EAEAEA;
        .num {
            color: #FF5A5E;
        }
    }
    .total-txt {
        text-align: right;
        font-size: .14rem;
        color: #666;
        padding: .2rem .16rem;
        line-height: 1;
    }
    .total {
        color: #FF5A5E;
        font-weight: bold;
        .fz {
            font-size: .22rem;
            line-height: 1;
            display: inline-block;
        }
    }
    .close {
        display: block;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        color: #999;
        border-top: 1px solid #f6f6f6;
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