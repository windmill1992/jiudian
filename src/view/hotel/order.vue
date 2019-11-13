<template>
    <div id="pageContainer">
        <div class="title-box">
            <a href="javascript:;" class="back" onclick="history.go(-2)"></a>
            <p>{{info.hotelRoomName}}</p>
        </div>
        <div class="container-pos">
            <div class="top">
                <div class="box">
                    <div class="flex spb">
                        <div>
                            <p class="name flex fcen">{{info.hotelRoomName}} <span class="tag" v-if="!notHotel">{{info.isHasBreakfast == 1 ? "含早" : "无早"}}</span> </p>
                            <p class="txt" v-if="showAll">{{info.hotelRoomDesc | fmt3}}<a href="javascript:;" class="look" @click="showAll = false;" v-if="info.hotelRoomDesc && info.hotelRoomDesc.length > 75">详情</a></p>
                            <p class="txt" v-else>{{info.hotelRoomDesc}}<a href="javascript:;" class="look" @click="showAll = true;" v-if="info.hotelRoomDesc && info.hotelRoomDesc.length > 75">收起</a></p>
                        </div>
                        <a href="javascript:;" @click="preview" class="pic fshrink0" :style="'background-image: url(' + info.picUrls[0] + ')'" v-if="info.picUrls">
                            <span class="num">{{info.picUrls.length}}</span>
                        </a>
                    </div>
                    <div class="time-box flex spb">
                        <div class="flex1">
                            <p>{{notHotel ? '预订日期' : '入住'}}</p>
                            <p class="time">{{startTime | fmt}}</p>
                        </div>
                        <template v-if="!notHotel">
                            <div class="flex1">
                                <p>离店</p>
                                <p class="time">{{endTime | fmt}}</p>
                            </div>
                            <div class="gong">共{{days}}晚</div>
                        </template>
                    </div>
                    <p class="txt flex fcen"><img src="../../assets/img/hotel/warn.png" alt="" /> 预订成功后不可取消</p>
                </div>
            </div>
            <div class="mid">
                <div class="info">
                    <p class="title">{{notHotel ? '预订' : '入住'}}信息</p>
                    <div class="inp-box flex fcen spb">
                        <p class="label">{{notHotel ? '产品' : '房间'}}数</p>
                        <div class="flex fcen">
                            <a href="javascript:;" class="op" @click="minus"><img src="../../assets/img/hotel/minus.png" alt=""/></a>
                            <span class="room">{{form.roomNum}}{{notHotel ? '' : '间'}}</span>
                            <a href="javascript:;" class="op" @click="add"><img src="../../assets/img/hotel/add.png" alt=""/></a>
                        </div>
                    </div>
                    <div class="inp-box flex fcen spb">
                        <p class="label">{{notHotel ? '预订' : '入住'}}人</p>
                        <input type="text" class="inp" v-model="form.userName" @input="getValid" placeholder="请填写真实姓名" />
                    </div>
                    <div class="inp-box flex fcen spb">
                        <p class="label">手机号</p>
                        <input type="number" class="inp" v-model="form.mobile" @input="getValid" placeholder="请填写手机号" />
                    </div>
                </div>
                <div class="act" v-show="actArr.length > 0">
                    <p class="title">优惠活动</p>
                    <div class="list">
                        <label class="item flex fcen spb" :for="'chk' + index" v-for="(item,index) in actArr" :key="'act' + index">
                            <div class="left flex1">
                                <p class="name">{{actTypeArr[item.activityType]}}{{item.activityType == 0 ? ratioText[item.discountRatio] : (item.discountCharge + '元')}}</p>
                                <p class="time">{{item.timeStart | fmt2}} - {{item.timeEnd | fmt2}}</p>
                            </div>
                            <input type="checkbox" :value="index" name="chk" :id="'chk' + index" class="chk" @change="getTotal" />
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
            <a href="javascript:;" class="submit" :class="{no: !valided}" @click="submit" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">立即支付</a>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel = false;">关闭</a></p>
            <div class="top">
                <div class="txt flex spb">
                    <p>全部费用</p>
                    <p>¥{{total + jian | fmt1}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList" :key="'fee' + index">
                    <p>{{item.day}}</p>
                    <p>¥{{item.serviceCharge || 0}} x {{form.roomNum}}{{notHotel ? '' : '间'}}</p>
                </div>
            </div>
            <div class="yh flex spb">
                <p>优惠</p>
                <p class="num">-¥{{jian}}</p>
            </div>
            <div class="total">合计 <span class="txt">¥ <span class="fz">{{total}}</span></span></div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import { BottomSheet } from 'muse-ui';
import { hotelInfo, hotelPrice, hotelOrder, hotelChargeDetail } from '../../api/hotel';
import { actList, payData, authorize } from '../../api/api';
import { setTitle } from '../../utils/setTitle';
import moment from 'moment';
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            info: {},
            hotelInfo: {},
            openSel: false,
            startTime: '',
            endTime: '',
            days: 0,
            form: {
                roomNum: 1,
            },
            total: 0,
            feeList: [],
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
            valided: false,
            screenHeight: '',
            isAll: false,
            showLook: false,
            showAll: true,
            notHotel: false,
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '/';
            let arr = t.split('-');
            return arr[1] + '.' + arr[2];
        },
        fmt1(t) {
            if (!t) return '0.00';
            return parseFloat(t).toFixed(2);
        },
        fmt2(t) {
            if (!t) return '/';
            return moment(t).format('YYYY.MM.DD');
        },
        fmt3(t) {
            if (!t) return '';
            return t.substr(0, 75) + (t.length > 75 ? '...' : '');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            hotelInfo({ hotelId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    let obj = res.resultData.hotelRoomInfoList.filter(item => {
                        return item.hotelRoomId == this.rid;
                    });
                    this.hotelInfo = res.resultData;
                    this.info = obj[0];
                    setTitle(res.resultData.hotelName);

                    if (res.resultData.hotelName.indexOf('酒店') == -1) {
                        this.notHotel = true;
                    } else {
                        this.notHotel = false;
                    }
                    this.getHotelChargeDetail();
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
        getHotelChargeDetail() {
            let t1 = this.startTime + ' 00:00:00';
            let t2 = '';
            if (this.notHotel) {
                t2 = this.startTime + ' 23:59:59';
            } else {
                t2 = this.endTime + ' 00:00:00';
            }
            hotelChargeDetail({ hotelRoomId: this.rid, searchStartTime: t1, searchEndTime: t2 }).then(res => {
                if (res.resultCode == 200 && res.resultData && res.resultData.length > 0) {
                    let s = res.resultData[0].stock;
                    for (let v of res.resultData) {
                        if (s > v.stock) {
                            s = v.stock;
                        }
                    }
                    this.info['stock'] = s;
                } else {
                    this.info.stock == 0;
                }
            })
        },
        getPrice() {
            hotelPrice({ hotelRoomId: this.rid, startTime: this.startTime, endTime: this.endTime }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    this.feeList = r.orderDayChargeInfoList;
                    this.totalPrice = r.totalPrice;
                    this.total = r.totalPrice * this.form.roomNum;
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('价格计算异常，请稍后再试！');
                    }
                }
            })
        },
        getActList() {
            actList({ refId: this.id, refType: 2 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.actArr = res.resultData;
                } else {
                    this.actArr = [];
                }
            });
        },
        add() {
            if (this.info.stock > this.form.roomNum) {
                this.form.roomNum++;
                this.form = Object.assign({}, this.form);
                this.getSum();
            } else {
                this.$toast.error('库存不足');
            }
        },
        minus() {
            if (this.form.roomNum > 1) {
                this.form.roomNum--;
                this.form = Object.assign({}, this.form);
                this.getSum();
            }
        },
        submit() {
            if (this.orderId) {
                this.pay();
                return;
            }
            if (this.loading1 || !this.valid()) return;
            this.loading1 = true;
            let param = {
                chargeInfoList: this.feeList,
                userName: this.form.userName,
                mobile: this.form.mobile,
                hotelId: this.id,
                hotelName: this.hotelInfo.hotelName,
                hotelAddress: this.hotelInfo.hotelAddress,
                hotelRoomId: this.rid,
                hotelRoomName: this.info.hotelRoomName,
                hotelRoomCount: this.form.roomNum,
                startTime: this.startTime,
                endTime: this.endTime,
                activityId: this.actId || 0,
            }
            hotelOrder(param).then(res => {
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
                            sessionStorage.removeItem('payHotel');
                            location.href = '/paySuccess/hotel/' + that.orderId;
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
            let payInfo = sessionStorage.getItem('payHotel');
            if (this.orderId && payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                payData({ code: this.code, refType: 2, orderId: this.orderId, proName: this.hotelInfo.hotelName }).then(res => {
                    if (res.resultCode == 200 && res.resultData) {
                        this.payParams = res.resultData;
                        sessionStorage.setItem('payHotel', JSON.stringify(res.resultData));
                        this.pay();
                    } else {
                        this.loading1 = false;
                        this.$toast.error('获取微信支付参数失败，请重试');
                        setTimeout(() => {
                            let urls = '/pay/hotel?id=' + this.id + '&rid=' + this.rid;
                            history.pushState(null, null, urls);
                            location.href = urls;
                        }, 1000);
                    }
                })
                .catch(err => {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/pay/hotel?id=' + this.id + '&rid=' + this.rid;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                })
            }
        },
        getSum() {
            let sum = this.totalPrice * this.form.roomNum;
            if (this.actId) {
                if (this.actObj.activityType == 0) {
                    this.total = sum * 100 * this.actObj.discountRatio / 10000;
                    this.total = this.total < 0.01 ? 0.01 : this.total;
                    this.jian = sum - this.total;
                } else {
                    this.total = sum - this.actObj.discountCharge;
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
            return true;
        },
        preview() {
            wx.previewImage({
                current: this.info.picUrls[0],
                urls: this.info.picUrls
            });
        },
        getValid() {
            if (this.form.userName && this.form.mobile) {
                this.valided = true;
                return;
            }
            this.valided = false;
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        this.rid = this.$route.query.rid;
        let time = sessionStorage.getItem('hotelDate');
        if (this.id && this.rid && time) {
            if (Cookies.get('uid')) {
                let code = this.$route.query.code;
                if (!code) {
                    let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
                    authorize(rurl);
                } else {
                    this.code = code;
                    let arr = time.split(',');
                    if (arr.length > 0) {
                        this.startTime = arr[0];
                        this.endTime = arr[1] || arr[0];
                        this.days = arr[2] || 0;
                        this.getData();
                        this.getPrice();
                        this.getActList();
                    } else {
                        this.$toast.error('请选择预订日期');
                        this.$router.replace('/hotel/' + this.id);
                    }
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
        sessionStorage.removeItem('payHotel');
    },
}
Vue.use(BottomSheet);
</script>

<style scoped lang="less">
.container-pos {
    padding-top: .48rem;
    padding-bottom: 1rem;
    background: #F8F8F8;
}
.top {
    padding: .1rem .16rem 0;
    background: linear-gradient(180deg, #0098AC 60%, transparent 0%);
    .box {
        width: 100%;
        padding: .12rem .15rem .2rem;
        background: #fff;
        border-radius: .03rem;
        box-shadow: 0px 1px 12px 0px rgba(206, 209, 210, 0.15);
    }
    .name {
        font-size: .18rem;
        color: #222;
        font-weight: bold;
        .tag {
            display: inline-block;
            padding: 0 5px;
            font-size: .12rem;
            color: #666;
            line-height: 1.3;
            margin-left: 2px;
            border-radius: .02rem;
            -webkit-transform: scale(.8);
            transform: scale(.8);
            margin-top: 3px;
            vertical-align: top;
            background: #EAEAEA;
            font-weight: normal;
        }
    }
    .txt {
        font-size: .12rem;
        color: #2C700B;
        margin-top: .12rem;
        .look {
            font-size: .12rem;
            color: #0098AC;
            margin-left: .15rem;
            display: inline-block;
        }
        img {
            width: .15rem;
            height: .15rem;
            margin-right: 3px;
        }
    }
    .time-box {
        font-size: .11rem;
        color: #9C9C9C;
        margin-top: .15rem;
        padding: .12rem .16rem;
        line-height: 1;
        background: #F8F8F8;
        .time {
            font-size: .17rem;
            color: #202D3D;
            margin-top: .08rem;
            font-weight: bold;
        }
        .gong {
            width: 15%;
            padding-top: .22rem;
            font-size: .12rem;
            color: #202D3D;
        }
    }
    .pic {
        width: .69rem;
        height: .69rem;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        position: relative;
        border-radius: 3px;
        margin-top: .35rem;
        margin-left: .1rem;
        .num {
            position: absolute;
            right: 1px;
            bottom: 0;
            font-size: .12rem;
            color: #fff;
            padding: 0 4px;
            background: rgba(0, 0, 0, .7);
            -webkit-transform: scale(.8);
            transform: scale(.8);
        }
    }
}
.mid {
    background: #fff;
    margin-top: .15rem;
    padding-bottom: .8rem;
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
            top: -1px;
            vertical-align: top;
        }
    }
    .info {
        padding: .16rem 0 .35rem .16rem;
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
        .room {
            font-size: .14rem;
            color: #222;
            padding: 0 .1rem;
        }
    }
    .act {
        padding: 0 .16rem .35rem .16rem;
        .list {
            padding-top: .2rem;
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
            .chk {
                -webkit-appearance: none;
                appearance: none;
                outline: none;
                display: inline-block;
                width: .18rem;
                height: .18rem;
                background: url(/static/img/unchecked.png) no-repeat;
                background-size: 100% 100%;
                background-position: 0 0;
                &[checked="checked"] {
                    background-image: url(/static/img/checked.png);
                }
            }
        }
    }
    .xuzhi {
        padding: 0 .16rem .35rem .16rem;
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
        border-radius: .44rem;
        background: #0098AC;
        &.no {
            background: #EAEAEA;
        }
    }
}
.preview {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 9999;
}
.swiper-container{
    .swiper-slide{
        width: 100%;
        height: 100%;
        overflow: hidden;
        img{
            width: 100%;
            height: 1.45rem;
            vertical-align: top;
        }
    }
    .swiper-pagination {
        padding: 0 .15rem;
        text-align: right;
        color: #fff;
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
    .top {
        background: none;
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