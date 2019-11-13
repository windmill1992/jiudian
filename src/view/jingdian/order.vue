<template>
    <div id="pageContainer">
        <div class="title-box">
            <a href="javascript:;" class="back" onclick="history.go(-2)"></a>
            <p>{{jdInfo.scenicSpotName}}</p>
        </div>
        <div class="container-pos">
            <div class="top">
                <div class="box">{{info.ticketsName}}</div>
                <div class="info">
                    <p class="title">预订信息</p>
                    <div class="inp-box flex fcen spb">
                        <p class="label">姓名</p>
                        <input type="text" class="inp" v-model="form.userName" @input="getValid" placeholder="请填写真实姓名" />
                    </div>
                    <div class="inp-box flex fcen spb">
                        <p class="label">手机号</p>
                        <input type="number" class="inp" v-model="form.mobile" @input="getValid" placeholder="请填写手机号" />
                    </div>
                    <div class="inp-box flex fcen spb">
                        <p class="label">身份证号</p>
                        <input type="text" class="inp" v-model="form.identityCard" @input="getValid" placeholder="请填写身份证号" />
                    </div>
                </div>
                <div class="num-box">
                    <div class="flex fcen spb">
                        <p class="title">预订数量</p>
                        <div class="flex fcen">
                            <a href="javascript:;" class="op" @click="minus"><img src="../../assets/img/hotel/minus.png" alt=""/></a>
                            <span class="count">{{form.ticketsCount}}</span>
                            <a href="javascript:;" class="op" @click="add"><img src="../../assets/img/hotel/add.png" alt=""/></a>
                        </div>
                    </div>
                    <p class="tip" v-if="info.identityCardLimit > 0">一张身份证只能购买<span class="num">{{info.identityCardLimit}}</span>张门票，如需购买多张请添加其他身份信息再次购买</p>
                </div>
                <div class="time-box">
                    <p class="title">预订时间</p>
                    <div class="time flex spb">
                        <a href="javascript:;" class="item fcol fcen spc" :class="{on: dateSel == 0}" @click="dateSel = 0">
                            <p class="date">{{today}}</p>
                            <p>¥{{info.ticketsCharge}}</p>
                        </a>
                        <a href="javascript:;" class="item flex fcen spc" :class="{on: dateSel == 1}" @click="editDate" id="select">
                            <template v-if="dateSel == 0">
                                <p>更多日期</p>
                                <p class="arr"></p>
                            </template>
                            <template v-else>
                                <p class="date">{{orderTime}}</p>
                                <p>¥{{info.ticketsCharge}}</p>
                            </template>
                        </a>
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
                <div class="tour xuzhi" v-if="info.tourItinerary">
                    <p class="title">行程信息</p>
                    <div class="con" v-html="info.tourItinerary"></div>
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
            <a href="javascript:;" class="submit" :class="{no: !valids}" @click="submit" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">立即支付</a>
        </div>
        <div class="mask_calendar" @click="closeDate">
            <div class="calendar jd"></div>
            <input type="text" id="orderDate" style="display: none;" />
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel = false;">关闭</a></p>
            <div class="top1">
                <div class="txt flex spb">
                    <p>{{info.ticketsName}}x{{form.ticketsCount}}</p>
                    <p>¥{{total + jian | fmt1}}</p>
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
import { jdInfo, jdOrder } from '../../api/jingdian';
import { explainInfo, actList, payData, authorize } from '../../api/api';
import { setTitle } from '../../utils/setTitle';
import moment from 'moment';
import Cookies from 'js-cookie';
require('../../assets/js/date2');
export default {
    data() {
        return {
            info: {},
            jdInfo: {},
            openSel: false,
            orderTime: '',
            form: {
                ticketsCount: 1,
            },
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
            valids: false,
            dateSel: 0,
            today: '',
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
            this.loading = this.$loading({ target: document.getElementById('pageContainer') });
            jdInfo({ scenicSpotId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    let obj = res.resultData.ticketsVOList.filter(item => {
                        return item.ticketsId == this.tid;
                    });
                    this.jdInfo = res.resultData;
                    this.info = obj[0];
                    setTitle(res.resultData.scenicSpotName);
                    this.total = this.info.ticketsCharge;
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
            actList({ refId: this.id, refType: 1 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.actArr = res.resultData;
                } else {
                    this.actArr = [];
                }
            });
        },
        add() {
            if (this.form.ticketsCount < this.info.ticketsStock && this.form.ticketsCount < this.info.identityCardLimit) {
                this.form.ticketsCount++;
                this.form = Object.assign({}, this.form);
                this.getSum();
            } else {
                if (this.form.ticketsCount >= this.info.ticketsStock - 1) {
                    this.$toast.error('库存不足');
                } else {
                    this.$toast.error('每张身份证只能购买' + this.info.identityCardLimit + '张门票');
                }
            }
        },
        minus() {
            if (this.form.ticketsCount > 1) {
                this.form.ticketsCount--;
                this.form = Object.assign({}, this.form);
                this.getSum();
            }
        },
        submit() {
            if (this.orderId) {
                this.pay();
                return;
            }
            let endTs = new Date((moment(Date.now()).format('YYYY-MM-DD') + ' ' + this.info.endTime.split(' ')[1])).getTime();
            if (this.dateSel == 0 && (endTs - Date.now()) < 3600 * 1000) {
                this.$toast.error('今天很晚了，您可考虑其他日期哦~');
                return;
            }
            if (this.loading1 || !this.valids || !this.valid()) return;
            this.loading1 = true;
            let param = Object.assign({}, this.form, {
                ticketsId: this.tid,
                activityId: this.actId || 0,
            })
            jdOrder(param).then(res => {
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
                            sessionStorage.removeItem('payJd');
                            location.href = '/paySuccess/ticket/' + that.orderId;
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
            let payInfo = sessionStorage.getItem('payJd');
            if (this.orderId && payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                payData({ code: this.code, refType: 1, orderId: this.orderId, proName: this.info.ticketsName }).then(res => {
                    if (res.resultCode == 200 && res.resultData) {
                        this.payParams = res.resultData;
                        sessionStorage.setItem('payJd', JSON.stringify(res.resultData));
                        this.pay();
                    } else {
                        this.loading1 = false;
                        this.$toast.error('获取微信支付参数失败，请重试');
                        setTimeout(() => {
                            let urls = '/pay/ticket?id=' + this.id + '&tid=' + this.tid;
                            history.pushState(null, null, urls);
                            location.href = urls;
                        }, 1000);
                    }
                })
                .catch(err => {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/pay/ticket?id=' + this.id + '&tid=' + this.tid;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                })
            }
        },
        getSum() {
            let sum = this.info.ticketsCharge * this.form.ticketsCount;
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
        getValid() {
            if (this.form.userName && this.form.mobile && this.form.identityCard) {
                this.valids = true;
            } else {
                this.valids = false;
            }
        },
        valid() {
            if (!this.form.userName) {
                this.$toast.error('请填写姓名');
                return false;
            }
            if (!this.form.mobile) {
                this.$toast.error('请填写手机号');
                return false;
            }
            if (!this.$util.telValidate(this.form.mobile)) {
                this.$toast.error('手机号不正确');
                return false;
            }
            if (!this.form.identityCard) {
                this.$toast.error('请填写身份证号');
                return false;
            }
            return true;
        },
        editDate(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.mask_calendar').show();
        },
        closeDate(e) {
            e.stopPropagation();
            e.preventDefault();
            if(e.target.className == "mask_calendar"){
                $('.calendar').slideUp(200);
                $('.mask_calendar').fadeOut(200);
            }
        },
        initDate() {
            const that = this;
            let dd = new Date();
            let y = dd.getFullYear();
            let m = dd.getMonth() + 1;
            let d = dd.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            this.today = m + '月' + d + '日';
            this.form.orderDate = y + '-' + m + '-' + d;

            $('#select').calendarSwitch({
				selectors: {
					sections: ".calendar"
				},
                index: 6,      //展示的月份个数
                animateFunction: "slideToggle",        //动画效果
                controlDay: true,    //是否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
                daysnumber: "180",     //控制天数
                color: "#0098AC",       //选中颜色
                callback: function() {  //回调函数
                	$('.mask_calendar').fadeOut(200);
	                var orderDate = $('#orderDate').val();
                    let arr = orderDate.split('-');
                    that.orderTime = arr[1] + '月' + arr[2] + '日';
                    that.form.orderDate = arr[0] + '-' + arr[1] + '-' + arr[2];
                    that.dateSel = 1;
                },   
                comfireBtn: '.comfire'  //确定按钮的class或者id
            });
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        this.tid = this.$route.query.tid;
        if (this.id && this.tid) {
            if (Cookies.get('uid')) {
                let code = this.$route.query.code;
                if (!code) {
                    let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                    authorize(rurl);
                } else {
                    this.code = code;
                    this.getData();
                    this.getActList();
                    this.initDate();
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
                    item.onblur = function () { 
                        window.scroll(0, 0);
                        window.innerHeight = window.outerHeight = that.screenHeight;
                    }
                })
            })

        }
    },
    beforeDestroy() {
        sessionStorage.removeItem('payJd');
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
    padding-bottom: .35rem;
    background: #fff;
    .box {
        width: 100%;
        padding: .2rem .16rem .2rem 0;
        border-bottom: 1px solid #EAEAEA;
        font-size: .18rem;
        color: #222;
        line-height: 1.5;
    }
    .info {
        margin-top: .3rem;
        .inp-box {
            line-height: .24rem;
            margin-top: .05rem;
            padding: .15rem .16rem .15rem 0;
            border-bottom: 1px solid #EAEAEA;
        }
        .label {
            font-size: .14rem;
            color: #666;
        }
        .inp {
            border: none;
            outline: none;
            background: none;
            height: .24rem;
            line-height: .24rem;
            font-size: .14rem;
            color: #222;
            text-align: right;
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
        .tip {
            margin-top: .18rem;
            line-height: 1.8;
            padding: 3px .1rem;
            background: #F8F8F8;
            border-radius: .02rem;
            font-size: .12rem;
            color: #666;
            .num {
                color: #B74B04;
                padding: 0 3px;
                font-size: .14rem;
                font-weight: bold;
            }
        }
    }
    .time-box {
        margin-top: .3rem;
        padding-right: .16rem;
        .time {
            padding-top: .1rem;
        }
        .item {
            width: 49%;
            height: .57rem;
            border: 1px solid #C6C6C6;
            border-radius: .03rem;
            background: #F8F8F8;
            font-size: .15rem;
            color: #222;
            line-height: 1;
            &.on {
                background: url(/static/img/bg-on.png) no-repeat;
                background-size: 100% 100%;
                background-position: 0 0;
                flex-direction: column;
            }
            .date {
                font-size: .14rem;
                margin-bottom: 5px;
            }
            .arr {
                display: inline-block;
                width: .09rem;
                height: .09rem;
                border-top: 1px solid #222;
                border-right: 1px solid #222;
                transform: rotate(45deg);
                margin-left: 3px;
            }
        }
    }
}
.mid {
    background: #fff;
    margin-top: .15rem;
    padding: .25rem .16rem .35rem;
    .act {
        margin-bottom: .3rem;
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
    .tour {
        margin-top: .3rem;
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
        .txt {
            font-size: .14rem;
            color: #222;
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
<style>
.calendar.jd .dateZone {
    margin-top: 66px;
}
.calendar.jd .tbody {
    height: 385px;
    margin-top: 115px;
    padding-bottom: 115px;
}
</style>