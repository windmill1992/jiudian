<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box">
                <div class="name flex fcen spb">
                    <p>{{info.carType}}</p>
                    <router-link :to="'/pay/car?id=' + info.carId" class="nav flex fcen">详情 <img src="/static/img/arr.png" alt="" /></router-link>
                </div>
                <div class="desc flex fcen">
                    <img src="../../assets/img/car/car-icon.png" alt="" />
                    <p>{{info.carBrieflyDesc}}</p>
                </div>
                <p class="txt">{{info.carMerchant}}</p>
            </div>
            <div class="info">
                <p class="tip">用车时间</p>
                <p class="txt1">{{orderInfo.startTime | fmt}}-{{orderInfo.endTime | fmt}}</p>
                <p class="tip">提车方式</p>
                <p class="txt1">{{orderInfo.isHouseDelivery == 1 ? '送车上门' : '到店取车'}}</p>
                <p class="tip">{{orderInfo.isHouseDelivery == 1 ? '送车' : '取车'}}地址</p>
                <p class="txt1">{{orderInfo.address}}</p>
            </div>
        </div>
        <div class="mid">
            <p class="name">驾驶员信息</p>
            <div class="item flex spb">
                <p>姓名</p>
                <p class="txt">{{orderInfo.userName}}</p>
            </div>
            <div class="item flex spb">
                <p>身份证</p>
                <p class="txt">{{orderInfo.identityCard}}</p>
            </div>
            <div class="item flex spb">
                <p>手机号</p>
                <p class="txt">{{orderInfo.mobile}}</p>
            </div>
            <div class="item flex spb">
                <p>驾照号</p>
                <p class="txt">{{orderInfo.drivingLicense || '无'}}</p>
            </div>
        </div>
        <div class="mid">
            <p class="name">费用明细</p>
            <div class="item flex spb">
                <p>全部费用</p>
                <p class="txt">¥{{feeInfo.totalCharge}}</p>
            </div>
            <div class="item flex spb" v-for="(item,index) in feeInfo.detailList" :key="'fee' + index">
                <p>{{item.chargeName}}</p>
                <p class="txt">¥{{item.serviceCharge}}</p>
            </div>
            <div class="item flex spb">
                <p>优惠</p>
                <p class="yh">-¥{{feeInfo.discountCharge}}</p>
            </div>
            <div class="item flex spb">
                <p>费用合计</p>
                <p class="txt">¥{{orderInfo.totalCharge}}</p>
            </div>
        </div>
        <div class="mid" v-if="orderInfo.isNeedInvoice == 1">
            <p class="name">需要开发票</p>
            <div class="item flex">
                <p>公司抬头</p>
                <p class="txt">{{orderInfo.invoiceTitle}}</p>
            </div>
            <div class="item flex">
                <p>税号</p>
                <p class="txt">{{orderInfo.dutyParagraph}}</p>
            </div>
        </div>
        <div class="mid">
            <p class="name">订单信息</p>
            <div class="item flex spb fcen">
                <p>订单号</p>
                <p class="txt">{{orderInfo.orderNo}}</p>
            </div>
            <div class="item flex spb fcen" v-if="orderInfo.orderStatus > 0">
                <p>支付时间</p>
                <p class="txt">{{orderInfo.payTime | fmt2}}</p>
            </div>
            <div class="item flex spb fcen" v-else>
                <p>下单时间</p>
                <p class="txt">{{orderInfo.createTime | fmt2}}</p>
            </div>
            <div class="item flex spb fcen">
                <p>订单状态</p>
                <p class="txt">{{stateArr[orderInfo.orderStatus]}}</p>
            </div>
            <div class="item flex spb fcen" v-if="time">
                    <p>订单剩余支付时间</p>
                    <p class="txt">{{time}}</p>
                </div>
            <template v-if="orderInfo.orderStatus == 4">
                <div class="item flex spb fcen">
                    <p>退款时间</p>
                    <p class="txt">{{orderInfo.updateTime | fmt2}}</p>
                </div>
                <div class="item flex spb fcen">
                    <p>退款金额</p>
                    <p class="txt">¥{{orderInfo.refundCharge}}</p>
                </div>
            </template>
        </div>
        <div class="bot">
            <div class="btns flex spb">
                <a href="javascript:;" class="btn" @click="cancel" v-if="orderInfo.orderStatus == 1 && canCancel">取消订单</a>
                <a href="javascript:;" class="btn" @click="toPay" v-if="orderInfo.orderStatus == 0 && canPay" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">去支付</a>
                <a href="javascript:;" class="btn btn1" @click="openSel = true;">电话咨询</a>
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
import { carOrderInfo, carOrderDetail } from '../../api/car';
import { cancelOrder, payData, authorize, kefuTel } from '../../api/api';
import moment from 'moment';
export default {
    data() {
        return {
            info: {},
            orderInfo: {},
            feeInfo: {},
            dateNum: 0,
            stateArr: ['未支付', '已支付', '已完成', '已取消', '已退款', '待确认', '已确认', '待退款', '待退款', '已过期'],
            canCancel: false,
            openSel: false,
            canPay: false,
            time: '',
            kefu: '',
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '/';
            return moment(t).format('YYYY-MM-DD HH:mm');
        },
        fmt1(t) {
            if (!t) return '';
            return t.substr(0, 10);
        },
        fmt2(t) {
            if (!t) return '/';
            return moment(t).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            carOrderInfo({ carOrderId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    this.info = r.car;
                    this.orderInfo = r.carOrder;
                    let d = Math.floor((r.carOrder.endTime - r.carOrder.startTime) / 1000);
                    this.dateNum = Math.ceil(d / 60 / 60 / 24);
                    this.getCarOrderDetail();
                    if (r.carOrder.orderStatus == 0) {
                        if ((Date.now() - r.carOrder.createTime) >= 600 * 1000) {
                            this.canPay = false;
                        } else {
                            this.canPay = true;
                            this.countdown();
                        }
                    } else {
                        if (Date.now() >= r.carOrder.startTime) {
                            this.canCancel = false;
                        } else {
                            this.canCancel = true;
                        }
                        sessionStorage.removeItem('carType');
                        sessionStorage.removeItem('payCar');
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
        getCarOrderDetail() {
            carOrderDetail({ carOrderId: this.id }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.feeInfo = res.resultData;
                }
            })
        },
        toPay() {
            this.loading1 = true;
            let payInfo = sessionStorage.getItem('payCar');
            if (payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                sessionStorage.setItem('carType', this.info.carType);
                let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                authorize(rurl);
            }
        },
        getPayData() {
            let pname = sessionStorage.getItem('carType');
            payData({ code: this.code, refType: 0, orderId: this.id, proName: pname }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.payParams = res.resultData;
                    sessionStorage.setItem('payCar', JSON.stringify(res.resultData));
                    this.pay();
                } else {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/orders/car?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                }
            })
            .catch(err => {
                this.loading1 = false;
                this.$toast.error('获取微信支付参数失败，请重试');
                setTimeout(() => {
                    let urls = '/orders/car?id=' + this.id;
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
                            sessionStorage.removeItem('carType');
                            sessionStorage.removeItem('payCar');
                            location.replace('/orders/car?id=' + that.id);
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
                    cancelOrder({ orderId: this.id, refType: 0 }).then(res => {
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
            let t = Math.floor((this.orderInfo.createTime + 600 * 1000 - Date.now()) / 1000);
            let m = parseInt(t / 60);
            let s = t % 60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            this.time = m + ':' + s;
            let timer = setInterval(() => {
                t = Math.floor((this.orderInfo.createTime + 600 * 1000 - Date.now()) / 1000);
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
            if (code && sessionStorage.getItem('carType')) {
                this.code = code;
                this.getPayData();
            }
            this.getData();
            this.getKefuTel();
            
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
    padding: .15rem 0 .25rem .16rem;
    line-height: 1;
    .box {
        padding-right: .16rem;
        padding-bottom: .2rem;
        border-bottom: 1px solid #f6f6f6;
        .name {
            font-size: .18rem;
            color: #222;
            white-space: nowrap;
        }
        .desc {
            font-size: .13rem;
            color: #666;
            margin-top: .1rem;
            img {
                height: .15rem;
                width: auto;
                margin-right: 3px;
            }
        }
        .txt {
            font-size: .12rem;
            color: #9C9C9C;
            margin-top: .1rem;
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
    }
    .info {
        padding: .25rem .16rem 0 0;
        font-size: .14rem;
        .tip {
            color: #9C9C9C;
            margin-bottom: .1rem;
        }
        .txt1 {
            color: #666;
            margin-bottom: .12rem;
        }
    }
}
.mid {
    margin-top: .12rem;
    background: #fff;
    padding: .2rem .16rem;
    line-height: 1;
    white-space: nowrap;
    .name {
        font-size: .14rem;
        color: #222;
        margin-bottom: .2rem;
    }
    .item {
        margin-bottom: .12rem;
        font-size: .14rem;
        color: #9c9c9c;
    }
    .txt {
        color: #666;
        max-width: 80%;
        text-align: right;
        word-break: break-all;
    }
    .yh {
        color: #FF5A5E;
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