<template>
    <div id="pageContainer">
        <div class="title-box">
            <a href="javascript:;" class="back" onclick="history.go(-2)"></a>
            <p>{{info.specialtyName}}</p>
        </div>
        <div class="container-pos">
            <div class="top">
                <div class="info flex spb">
                    <div class="flex1">
                        <p class="name">{{info.specialtyName}}</p>
                        <div class="price">
                            <span>¥</span>
                            <span class="num">{{info.price}}</span>
                            <span class="unit">/件</span>   
                        </div>
                    </div>
                    <div class="pic fshrink0" :style="'background-image: url(' + (info.picUrlList ? info.picUrlList[0] : '') + ')'"></div>
                </div>
                <div class="num-box">
                    <div class="flex fcen spb">
                        <p class="title">购买数量</p>
                        <div class="flex fcen">
                            <a href="javascript:;" class="op" @click="minus"><img src="../../assets/img/hotel/minus.png" alt=""/></a>
                            <span class="count">{{count}}件</span>
                            <a href="javascript:;" class="op" @click="add"><img src="../../assets/img/hotel/add.png" alt=""/></a>
                        </div>
                    </div>
                </div>
                <div class="addr-box">
                    <p class="title">收货地址</p>
                    <router-link to="/address" class="wrap add" v-if="!addrInfo.userId">点击添加收货地址</router-link>
                    <div class="wrap edit flex fcen spb" v-else>
                        <div class="flex1">
                            <p class="user">{{addrInfo.userName}} {{addrInfo.mobile}}</p>
                            <p class="addr">{{addrInfo.province}}{{addrInfo.city}}{{addrInfo.area}}{{addrInfo.address}}</p>
                        </div>
                        <a href="javascript:;" class="edit-a" @click="editAddr">修改</a>
                    </div>
                </div>
            </div>
            <div class="mid">
                <div class="act" v-show="actArr.length > 0">
                    <p class="title">优惠活动</p>
                    <div class="list">
                        <label class="item flex fcen spb" :for="'chk' + index" v-for="(item,index) in actArr" :key="'act' + index">
                            <div class="left flex1">
                                <p class="name">{{actTypeArr[item.activityType]}}{{item.activityType == 0 ? ratioText[item.discountRatio] : (item.discountCharge + '元')}}</p>
                                <p class="time">{{item.timeStart | fmt2}} - {{item.timeEnd | fmt2}}</p>
                            </div>
                            <input type="checkbox" :value="index" :id="'chk' + index" class="chk" @change="getTotal" />
                        </label>
                    </div>
                </div>
                <div class="xuzhi">
                    <p class="title">预订须知</p>
                    <div class="con" v-html="info.orderExplain" id="xuzhi"></div>
                    <a href="javascript:;" class="look" @click="lookAll" v-if="showLook">{{isAll ? '收起' : '查看全部'}}</a>
                </div>
            </div>
        </div>
        <div class="bot flex fcen">
            <div class="left flex fcen spb flex1">
                <div>
                    <p class="total"><span>¥</span>{{total | fmt1}}</p>
                    <p class="txt" v-show="jian > 0">已减 ¥{{jian}}</p>
                </div>
                <a href="javascript:;" class="mx" @click="openSel = true;">费用明细</a>
            </div>
            <a href="javascript:;" class="submit" :class="{no: !addrInfo.userId}" @click="submit" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">立即支付</a>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel = false;">关闭</a></p>
            <div class="top1">
                <div class="txt flex spb">
                    <p>{{info.specialtyName}}</p>
                    <p>¥{{info.price | fmt1}}/件</p>
                </div>
                <div class="txt1 flex spb">
                    <p>购买数量</p>
                    <p>{{count || 0}}件</p>
                </div>
            </div>
            <div class="yh flex spb">
                <p>优惠</p>
                <p class="num">-¥{{jian | fmt1}}</p>
            </div>
            <div class="total">合计 <span class="txt">¥ <span class="fz">{{total |fmt1}}</span></span></div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import { BottomSheet } from 'muse-ui';
import { specialtyInfo, specialtyOrder } from '../../api/specialty';
import { actList, payData, authorize, userAddr } from '../../api/api';
import moment from 'moment';
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            info: {},
            openSel: false,
            count: 1,
            total: 0,
            loading1: false,
            actId: null,
            actArr: [],
            actTypeArr: ['', '立减', '满减'],
            ratioText: {
                '90': '9折',
                '80': '8折',
                '70': '7折',
                '60': '6折',
                '50': '5折',
                '40': '4折',
                '30': '3折',
                '20': '2折',
                '10': '1折',
            },
            jian: 0,
            addrInfo: {},
            screenHeight: '',
            isAll: false,
            showLook: false,
        }
    },
    filters: {
        fmt1(t) {
            if (!t) return '0.00';
            return parseFloat(t).toFixed(2);
        },
        fmt2(t) {
            if (!t) return '/';
            return moment(t).format('YYYY.MM.DD');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            specialtyInfo({ specialtyId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    this.total = this.info.price;
                    setTimeout(() => {
                        this.getXuzhiHeight();
                    }, 100);
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
        getActList() {
            actList({ refId: this.id, refType: 3 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.actArr = res.resultData;
                } else {
                    this.actArr = [];
                }
            });
        },
        getUserAddr() {
            userAddr().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.addrInfo = res.resultData;
                } else {
                    this.addrInfo = {};
                }
            })
            .catch(err => {
                console.error(err);
                this.addrInfo = {};
            });
        },
        add() {
            if (this.count < this.info.stock) {
                this.count++;
                this.getSum();
            } else {
                this.$toast.error('库存不足');
            }
        },
        minus() {
            if (this.count > 1) {
                this.count--;
                this.getSum();
            }
        },
        submit() {
            if (this.orderId) {
                this.pay();
                return;
            }
            if (this.loading1 || !this.addrInfo.userId) return;
            this.loading1 = true;
            let param = {
                specialtyId: this.id,
                activityId: this.actId || 0,
                userName: this.addrInfo.userName,
                mobile: this.addrInfo.mobile,
                address: this.addrInfo.province + this.addrInfo.city + this.addrInfo.area + this.addrInfo.address,
                count: this.count,
            }
            specialtyOrder(param).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.$toast.success('创建订单成功');
                    this.orderId = res.resultData;
                    this.getPayData();
                } else {
                    this.loading1 = false;
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('服务器开了小差，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.loading1 = false;
                this.$toast.error('未知异常！');
                console.log(err);
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
                            sessionStorage.removeItem('payTc');
                            location.href = '/paySuccess/specialty/' + that.orderId;
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
        getPayData() {
            let payInfo = sessionStorage.getItem('payTc');
            if (this.orderId && payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                payData({ code: this.code, refType: 3, orderId: this.orderId, proName: this.info.specialtyName }).then(res => {
                    if (res.resultCode == 200 && res.resultData) {
                        this.payParams = res.resultData;
                        sessionStorage.setItem('payTc', JSON.stringify(res.resultData));
                        this.pay();
                    } else {
                        alert(res.resultMsg);
                        this.loading1 = false;
                        this.$toast.error('获取微信支付参数失败，请重试');
                        setTimeout(() => {
                            let urls = '/pay/specialty?id=' + this.id;
                            history.pushState(null, null, urls);
                            location.href = urls;
                        }, 1000);
                    }
                })
                .catch(err => {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/pay/specialty?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                })
            }
        },
        getSum() {
            let sum = this.info.price * this.count;
            if (this.actId) {
                if (this.actObj.activityType == 0) {
                    this.total = sum * 100 * this.actObj.discountRatio / 10000;
                    this.total = this.total < 0.01 ? 0.01 : this.total;
                    this.jian = (sum * 100 - this.total * 100) / 100;
                } else {
                    this.total = sum - this.actObj.discountCharge;
                    this.total = this.total < 0 ? 0 : this.total;
                    this.jian = this.actObj.discountCharge;
                }
            } else {
                this.total = sum;
                this.jian = 0;
            }
        },
        getTotal(e) {
            let val = e.target.value;
            let o = this.actArr[val];
            if (this.actId == o.activityId) {
                $(e.target).removeAttr('checked');
                this.actId = null;
            } else {
                $('.chk').removeAttr('checked');
                $(e.target).attr('checked', 'checked');
                this.actId = o.activityId;
            }
            this.actObj = Object.assign({}, o);
            this.getSum();
        },
        editAddr() {
            this.$router.push('/address?edit=1');
        },
        getXuzhiHeight() {
            let h = $('#xuzhi').height();
            this.height = h;
            if (h > 400) {
                this.isAll = false;
                this.showLook = true;
                $('#xuzhi').height(400);
            } else {
                this.showLook = false;
            }
        },
        lookAll() {
            if (this.isAll) {
                $('#xuzhi').height(400);
            } else {
                $('#xuzhi').height(this.height);
            }
            this.isAll = !this.isAll;
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            if (Cookies.get('uid')) {
                let code = this.$route.query.code;
                if (!code) {
                    let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                    authorize(rurl);
                } else {
                    this.code = code;
                    this.getData();
                    this.getActList();
                    this.getUserAddr();
                }
            } else {
                this.$router.push('/login?from='+ encodeURIComponent(this.$route.fullPath));
            }
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
        this.screenHeight = document.documentElement.clientHeight;
    },
    updated () {
        let that = this;
        if (this.$util.isWx() && this.$util.isIos()) {
            this.$nextTick(function () {
                let $inputs = Array.from(document.getElementsByTagName('input'));
                let body = document.body;
                $inputs.forEach(item => {
                    item.onblur = function () { // onblur是核心方法
                        window.scroll(0, 0);
                        window.innerHeight = window.outerHeight = that.screenHeight;
                    }
                })
            })
        }
    },
    beforeDestroy() {
        sessionStorage.removeItem('payTc');
    },
}
Vue.use(BottomSheet);
</script>

<style scoped lang="less">
.container-pos {
    padding-bottom: 1rem;
    padding-top: .48rem;
    background: #F8F8F8;
    .title {
        font-size: .18rem;
        font-weight: bold;
        color: #222;
        margin-bottom: .1rem;
        padding-left: .1rem;
        position: relative;
        line-height: 1;
        &::before {
            content: '';
            display: inline-block;
            width: 3.5px;
            height: .18rem;
            background: #0399AC;
            position: absolute;
            left: 0;
            top: 0;
            vertical-align: top;
        }
    }
}
.top {
    padding-left: .16rem;
    padding-bottom: .23rem;
    background: #fff;
    .info {
        width: 100%;
        padding: .2rem .16rem .2rem 0;
        border-bottom: 1px solid #EAEAEA;
        line-height: 1;
        .name {
            font-size: .18rem;
            color: #222;
            font-weight: bold;
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
    .num-box {
        margin-top: .35rem;
        padding-right: .12rem;
        .title {
            margin-bottom: 0;
        }
        .op {
            display: inline-block;
            width: .24rem;
            height: .24rem;
            img {
                width: .16rem;
                height: .16rem;
                margin: .04rem;
                vertical-align: top;
            }
        }
        .count {
            font-size: .14rem;
            color: #222;
            padding: 0 .1rem;
        }
    }
    .addr-box {
        margin-top: .35rem;
        padding-right: .16rem;
        .wrap {
            margin-top: .2rem;
            width: 100%;
            background: #E6F5F7;
            border: 1px solid #0098AC;
            border-radius: .03rem;
        }
        .add {
            display: block;
            height: .44rem;
            line-height: .44rem;
            text-align: center;
            font-size: .15rem;
            color: #222;
        }
        .edit {
            padding: .1rem .18rem;
        }
        .user {
            font-size: .14rem;
            color: #222;
            line-height: 1;
        }
        .addr {
            font-size: .15rem;
            color: #222;
            margin-top: 6px;
            max-width: 90%;
            word-break: break-all;
            line-height: 1.3;
        }
        .edit-a {
            width: .48rem;
            height: .25rem;
            line-height: .25rem;
            text-align: center;
            background: #0098AC;
            border-radius: .02rem;
            font-size: .12rem;
            color: #fff;
        }
    }
}
.mid {
    background: #fff;
    margin-top: .15rem;
    padding: .25rem .16rem .35rem;
    .act {
        .list {
            padding-top: .1rem;
        }
        .item {
            padding: .18rem .33rem .18rem .2rem;
            background: url(/static/img/quan-bg.png) no-repeat;
            background-size: 100% 100%;
            background-position: 0 0;
            margin-bottom: .12rem;
            line-height: 1;
            .name {
                font-size: .18rem;
                color: #B74B04;
                span {
                    font-size: .15rem;
                    padding-right: 2px;
                }
            }
            .time {
                font-size: .11rem;
                color: #B74B04;
                margin-top: 8px;
            }
        }
    }
    .xuzhi {
        margin-top: .3rem;
        font-size: .14rem;
        color: #666;
        text-align: justify;
        line-height: 1.5;
        .con {
            margin-top: .15rem;
            overflow: hidden;
        }
        .look {
            display: block;
            margin-top: .1rem;
            color: #0098AC;
            font-size: .13rem;
        }
    }
}
.bot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .76rem;
    background: #fff;
    z-index: 9;
    padding: 0 .16rem;
    box-shadow: 0px -1px 0px 0px rgba(234,234,234,1);
    .left {
        margin-right: .1rem;
    }
    .total {
        font-size: .18rem;
        font-weight: bold;
        color: #FF5A5E;
        span {
            font-size: .14rem;
        }
    }
    .txt {
        font-size: .12rem;
        color: #9C9C9C;
    }
    .mx {
        font-size: .12rem;
        color: #0098AC;
        position: relative;
        padding-right: .15rem;
        &::after {
            content: '';
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #0098AC;
            position: absolute;
            top: 50%;
            right: 0;
            margin-top: -2px;
        }
    }
    .submit {
        width: 35%;
        color: #fff;
        text-align: center;
        height: .44rem;
        line-height: .44rem;
        font-size: .16rem;
        font-weight: bold;
        position: relative;
        border-radius: .04rem;
        background: #0098AC;
        &.no {
            background: #EAEAEA;
        }
    }
}
.bot-s2 {
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
</style>