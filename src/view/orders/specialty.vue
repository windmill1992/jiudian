<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box flex spb">
                <div class="flex1">
                    <p class="name">{{info.specialtyName}}</p>
                    <div class="price">
                        <span>¥</span>
                        <span class="num">{{info.price || 0}}</span>
                        <span class="unit">/件</span>  
                    </div>
                </div>
                <div class="pic fshrink0" :style="'background-image: url(' + info.specialtyPic + ')'"></div>
            </div>
            <div class="info">
                <p class="name">购买数量</p>
                <p class="time">{{info.count || 0}}件</p>
                <p class="txt">在线支付</p>
                <div class="flex fcen spb">
                    <p class="price">¥{{info.totalPrice}}</p>
                    <a href="javascript:;" class="mx flex fcen" @click="openSel = true;">费用明细 <img src="/static/img/arr.png" alt="" /></a>
                </div>
            </div>
        </div>
        <div class="mid">
            <div class="order">
                <p class="tip">订单信息</p>
                <div class="item flex spb">
                    <p>购买人</p>
                    <p class="txt">{{info.userName}}</p>
                </div>
                <div class="item flex spb">
                    <p>手机号</p>
                    <p class="txt">{{info.mobile}}</p>
                </div>
                <div class="item flex spb">
                    <p>收货地址</p>
                    <p class="txt">{{info.address}}</p>
                </div>
                <div class="item flex spb">
                    <p>订单号</p>
                    <p class="txt">{{info.orderNo}}</p>
                </div>
                <div class="item flex spb" v-if="info.orderStatus > 0">
                    <p>支付时间</p>
                    <p class="txt">{{info.payTime | fmt}}</p>
                </div>
                <div class="item flex spb fcen" v-else>
                    <p>下单时间</p>
                    <p class="txt">{{info.createTime | fmt}}</p>
                </div>
                <div class="item flex spb">
                    <p>订单状态</p>
                    <p class="txt">{{stateArr[info.orderStatus]}}</p>
                </div>
                <div class="item flex spb fcen" v-if="time">
                    <p>订单剩余支付时间</p>
                    <p class="txt">{{time}}</p>
                </div>
            </div>
        </div>
        <div class="bot">
            <div class="btns flex spb">
                <a href="javascript:;" class="btn" @click="sureOrder" v-if="info.orderStatus == 1">确认收货</a>
                <a href="javascript:;" class="btn" @click="toPay" v-if="info.orderStatus == 0 && canPay" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">去支付</a>
                <a href="javascript:;" class="btn btn1" @click="openSel2 = true;">客服电话</a>
            </div>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s1" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel = false;">关闭</a></p>
            <div class="top1">
                <div class="txt flex spb">
                    <p>{{info.specialtyName}}</p>
                    <p>¥{{info.price | fmt1}}/件</p>
                </div>
                <div class="txt1 flex spb">
                    <p>购买数量</p>
                    <p>{{info.count}}件</p>
                </div>
            </div>
            <div class="yh flex spb">
                <p>优惠</p>
                <p class="num">-¥{{info.discountCharge | fmt1}}</p>
            </div>
            <div class="total">合计 <span class="txt">¥ <span class="fz">{{info.totalPrice |fmt1}}</span></span></div>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel2" class="bot-s2" :overlay="false">
            <a :href="'tel:' + kefu" class="item">{{kefu}}</a>
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
import { specialtyOrderList, confirmOrder } from '../../api/specialty';
import { payData, authorize, kefuTel } from '../../api/api';
import moment from 'moment';
export default {
    data() {
        return {
            info: {},
            openSel: false,
            openSel2: false,
            stateArr: ['未支付', '已支付', '已完成', '', '', '', '', '', '', '已过期'],
            kefu: '',
            canPay: false,
            time: '',
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '--';
            return moment(t).format('YYYY-MM-DD HH:mm:ss');
        },
        fmt1(t) {
            if (!t) return '0.00';
            return parseFloat(t).toFixed(2);
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            specialtyOrderList({ orderId: this.id, pageIndex: 1, pageSize: 1 }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    if (res.resultData.list && res.resultData.list.length > 0) {
                        this.info = res.resultData.list[0];
                        if (this.info.orderStatus == 0) {
                            if ((Date.now() - this.info.createTime) >= 600 * 1000) {
                                this.canPay = false;
                            } else {
                                this.canPay = true;
                                this.countdown();
                            }
                        } else {
                            sessionStorage.removeItem('specialtyName');
                            sessionStorage.removeItem('payTc');
                        }
                    } else {
                        this.$toast.error('订单不存在');
                        this.$router.replace('/orders/specialtyOrders');
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
        toPay() {
            this.loading1 = true;
            let payInfo = sessionStorage.getItem('payTc');
            if (payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                sessionStorage.setItem('specialtyName', this.info.specialtyName);
                let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                authorize(rurl);
            }
        },
        getPayData() {
            let pname = sessionStorage.getItem('specialtyName');
            payData({ code: this.code, refType: 3, orderId: this.id, proName: pname }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.payParams = res.resultData;
                    sessionStorage.setItem('payTc', JSON.stringify(res.resultData));
                    this.pay();
                } else {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/orders/specialty?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                }
            })
            .catch(err => {
                this.loading1 = false;
                this.$toast.error('获取微信支付参数失败，请重试');
                setTimeout(() => {
                    let urls = '/orders/specialty?id=' + this.id;
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
                            sessionStorage.removeItem('specialtyName');
                            sessionStorage.removeItem('payTc');
                            location.replace('/orders/specialty?id=' + that.id);
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
        sureOrder() {
            const that = this;
            this.$confirm('确定已收到货物吗？', '提示', {
                type: 'warning'
            }).then(({ result }) => {
                if (result) {
                    confirmOrder({ orderId: this.id }).then(res => {
                        if (res.resultCode == 200 && res.resultData) {
                            this.$toast.success('收货成功');
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
            if (code && sessionStorage.getItem('specialtyName')) {
                this.code = code;
                this.getPayData();
            }
            this.hotelTel = localStorage.getItem('hotelTel');
            this.getData();
            this.getKefuTel();
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/orders/specialtyOrders');
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
        line-height: 1;
        .name {
            font-size: .18rem;
            color: #222;
            white-space: nowrap;
        }
        .price {
            font-size: .12rem;
            color: #FF5A5E;
            font-weight: bold;
            margin-top: .1rem;
            .num {
                font-size: .18rem;
                display: inline-block;
                transform: translateY(1px);
            }
            .unit {
                font-size: .12rem;
                margin-left: 2px;
                transform: scale(.8);
            }
        }
        .pic {
            width: .69rem;
            height: .69rem;
            background-color: #f8f8f8;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            border-radius: .03rem;
            margin-left: .1rem;
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
            margin-top: 3px;
        }
        .txt {
            color: #9C9C9C;
            margin: 5px 0;
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
    .top1 {
        background: none;
        padding: .2rem .16rem .25rem 0;
        margin-left: .16rem;
        border-bottom: 1px solid #EAEAEA;
        font-size: .14rem;
        .txt {
            color: #222;
        }
        .txt1 {
            color: #9C9C9C;
            margin-top: .1rem;
        }
    }
    .yh {
        padding: .2rem .16rem .2rem 0;
        margin-left: .16rem;
        font-size: .14rem;
        color: #222;
        border-bottom: 1px solid #EAEAEA;
        .num {
            color: #FF5A5E;
        }
    }
    .total {
        text-align: right;
        font-size: .14rem;
        color: #666;
        padding: .2rem .16rem;
        line-height: 1;
        .txt {
            font-size: .17rem;
            color: #FF5A5E;
            font-weight: bold;
            transform: translateY(1px);
            display: inline-block;
        }
        .fz {
            font-size: .22rem;
            line-height: 1;
            display: inline-block;
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