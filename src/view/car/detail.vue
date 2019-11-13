<template>
    <div id="pageContainer">
        <div class="top">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in 9" :key="'img' + index">
                        <img src="../../assets/img/topbg2.png" />
                    </div>
                </div>
                <div class="swiper-pagination car"></div>
            </div>
        </div>
        <div class="mid">
            <div class="info">
                <div class="flex fcen">
                    <p class="name">{{info.carType}}</p>
                    <p class="mer">{{info.carMerchant}}</p>
                    <a href="javascript:;" class="call">电话咨询</a>
                </div>
                <div class="desc">{{info.carBrieflyDesc}}</div>
            </div>
            <div class="use">
                <div class="flex fcen">
                    <div class="txt">用车时间</div>
                    <a href="javascript:;" class="time" :class="{on: startTime}" @click="openSheet(0)">{{startTime ? startTime : '请选择开始时间'}}</a>
                    <span style="padding: 0 10px;"> —— </span>
                    <a href="javascript:;" class="time" :class="{on: endTime}" @click="openSheet(1)">{{endTime ? endTime : '请选择结束时间'}}</a>
                </div>
                <div class="way flex">
                    <a href="javascript:;" class="tab" :class="{on: way == 0}" @click="changeTab(0)">到店提车</a>
                    <a href="javascript:;" class="tab" :class="{on: way == 1}" @click="changeTab(1)">送车上门</a>
                </div>
                <a href="javascript:;" class="addr" v-if="!form.carAddressId" @click="openSheet1">请选择{{way == 0 ? '提车' : '送车'}}地点</a>
                <a href="javascript:;" class="addr on" v-else @click="openSheet1">{{carAddr}}</a>
            </div>
            <div class="user">
                <p>请填写驾驶员信息</p>
                <div class="item flex fcen">
                    <div class="label">姓名</div>
                    <div class="inp-box flex1">
                        <mu-text-field v-model="form.userName" full-width :max-length="20" placeholder="请填写真实姓名"></mu-text-field>
                    </div>
                </div>
                <div class="item flex fcen">
                    <div class="label">身份证</div>
                    <div class="inp-box flex1">
                        <mu-text-field full-width :max-length="20" placeholder="请填写身份证号"></mu-text-field>
                    </div>
                </div>
                <div class="item flex fcen">
                    <div class="label">手机号</div>
                    <div class="inp-box flex1">
                        <mu-text-field full-width :max-length="11" placeholder="请填写手机号码"></mu-text-field>
                    </div>
                </div>
                <div class="item flex fcen">
                    <div class="label">驾照号</div>
                    <div class="inp-box flex1">
                        <mu-text-field full-width :max-length="20" placeholder="请填写驾照号-选填"></mu-text-field>
                    </div>
                </div>
            </div>
            <div class="fee">
                <p>请选择服务费用</p>
                <div class="item flex spb fcen" v-for="(item,index) in info.carChargeVOList" :key="'cc' + index">
                    <p>{{item.chargeName}} ￥{{item.serviceCharge}}</p>
                    <input type="checkbox" :value="index" v-model="chargeIndex" name="charge" @change="getSum" style="display: none;" :id="'chk' + index" />
                    <label :for="'chk' + index" class="chk" :class="{on: item.isMust || chargeIndex.indexOf(index) > -1}"></label>
                </div>
            </div>
            <div class="piao">
                <p>是否需要开发票</p>
                <div class="flex fcen">
                    <input type="radio" :value="0" v-model="form.isNeedInvoice" name="invoice" class="rad" id="invoice0" />
                    <label for="invoice0" class="lab">不需要发票</label>
                    <input type="radio" :value="1" v-model="form.isNeedInvoice" name="invoice" class="rad" id="invoice1" />
                    <label for="invoice1" class="lab">需要发票</label>
                </div>
                <div class="taitou" v-show="form.isNeedInvoice == 1">
                    <div class="label">发票抬头</div>
                    <input type="text" class="inp" v-model="form.invoiceTitle" placeholder="请输入发票抬头" />
                </div>
            </div>
            <div class="act" v-show="actArr.length > 0">
                <p class="title">优惠活动</p>
                <div class="list">
                    <label class="item flex fcen spb" :for="'chk1' + index" v-for="(item,index) in actArr" :key="'act' + index">
                        <div class="left flex1">
                            <p class="name">{{actTypeArr[item.activityType]}}{{item.activityType == 0 ? ratioText[item.discountRatio] : (item.discountCharge + '元')}}</p>
                            <p class="time">{{item.timeStart | fmt2}} - {{item.timeEnd | fmt2}}</p>
                        </div>
                        <input type="checkbox" :value="index" name="act" :id="'chk1' + index" class="chk1" @change="getTotal" />
                    </label>
                </div>
            </div>
            <div class="xuzhi">
                <div class="con" v-html="xuzhi"></div>
            </div>
        </div>
        <div class="bot flex fcen">
            <div class="left flex fcen spb flex1">
                <div>
                    <p class="total"><span>¥</span>{{total | fmt}}</p>
                    <p class="txt" v-show="jian > 0">已减 ¥{{jian}}</p>
                </div>
                <a href="javascript:;" class="mx" @click="openSel2 = true;">费用明细</a>
            </div>
            <a href="javascript:;" class="submit" @click="submit" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">立即支付</a>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s1" :overlay="false">
            <div class="top flex spb fcen">
                <a href="javascript:;" class="btn" @click="openSel = false;">取消</a>
                <span>{{timeTxt}}</span>
                <a href="javascript:;" class="btn btn1" @click="sureSel">确认</a>
            </div>
            <mu-slide-picker :slots="dateSlots" :visible-item-count="5" @change="dateChange" :values="dates"></mu-slide-picker>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel1" class="bot-s1" :overlay="false">
            <div class="top t1">{{way == 0 ? '选择提车地点' : '选择送车地点'}}</div>
            <div class="list" v-if="way == 0">
                <a href="javascript:;" class="item" v-for="(item,index) in info.carAddressVOList" :key="'addr' + index" 
                    v-if="item.addressType == 0" @click="selAddr(index)">{{item.address}}</a>
            </div>
            <div class="list" v-else>
                <a href="javascript:;" class="item" v-for="(item,index) in info.carAddressVOList" :key="'addr' + index" 
                    v-if="item.addressType == 1" @click="selAddr(index)">{{item.address}} {{item.charge}}元</a>
                <a href="javascript:;" class="item" @click="selAddr(-1)">地址1 1元</a>
            </div>
            <a href="javascript:;" class="close" @click="openSel1 = false;">取消</a>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel2" class="bot-s2" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel2 = false;">关闭</a></p>
            <div class="top">
                <div class="txt flex spb">
                    <p>全部房费</p>
                    <p>¥{{total + jian | fmt}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList" :key="'fee' + index">
                    <p>{{item.day}}</p>
                    <p>¥{{item.serviceCharge || 0}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList2" :key="'fee2' + index">
                    <p>{{item.chargeName}}</p>
                    <p>¥{{item.serviceCharge || 0}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList3" :key="'fee3' + index">
                    <p>{{item.chargeName}}</p>
                    <p>¥{{item.serviceCharge || 0}}</p>
                </div>
            </div>
            <div class="yh flex spb">
                <p>优惠</p>
                <p class="num">-¥{{jian}}</p>
            </div>
            <div class="total">合计 <span class="txt">¥ <span class="fz">{{total}}</span></span></div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel || openSel1 || openSel2" @click="openSel = false; openSel1 = false; openSel2 = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'swiper/dist/css/swiper.min.css';
import { Button, Snackbar, Icon, BottomSheet, TextField, Checkbox, SlidePicker } from 'muse-ui';
import { carInfo, carPrice } from '../../api/car';
import { explainInfo, actList } from '../../api/api';
import Swiper from 'swiper';
import moment from 'moment';
let dateArr = [], times = [], dates = [];
let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let dd = new Date();
let yearIndex = 0;
for (let i = 0; i < 7; i++) {
    let year = dd.getFullYear();
    let month = dd.getMonth() + 1;
    let week = dd.getDay();
    let day = dd.getDate();
    let txt = month + '/' + day + ' ' + weeks[week];
    if (i == 0) {
        txt = '今天';
    }
    let txt1 = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    dateArr.push(txt1);
    dates.push(txt);
    dd.setDate(day + 1);
    let ny = dd.getFullYear();
    if (ny !== year) {
        yearIndex = i;
    }
}
times = ['1:00', '3:00', '5:00', '7:00', '9:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'];
export default {
    data() {
        return {
            info: {},
            openSel: false,
            openSel1: false,
            openSel2: false,
            carAddr: '',
            form: {},
            dateSlots: [{
                width: '100%',
                textAlign: 'right',
                values: dates,
            }, {
                width: '100%',
                textAlign: 'center',
                values: times,
            }],
            dates: [dates[0], times[0]],
            way: 0,
            dateSel: [0, 0],
            timeTxt: '',
            startEnd: 0,
            startTime: '',
            endTime: '',
            chargeIndex: [],
            xuzhi: '',
            total: 0,
            jian: 0,
            loading1: false,
            feeList: [],    //价格查询返回
            feeList2: [],   //服务费列表
            feeList3: [],   //送车费用
            actArr: [],
            actTypeArr: ['', '立减', '满减'],
            ratioText: {
                '90': '九折',
                '80': '八折',
                '70': '七折',
                '60': '六折',
                '50': '五折',
                '40': '四折',
                '30': '三折',
                '20': '二折',
                '10': '一折',
            },
        }
    },
    filters: {
        fmt(t) {
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
            carInfo({ carId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    setTimeout(() => {
                        this.swiper();
                        this.getSum();
                    }, 100);
                } else if (res.resultCode == 4002){
                    this.$Cookies.set('uid', '');
					this.$router.push('/login?from='+ encodeURIComponent(this.$route.fullPath));
                } else {
                    if(res.resultMsg){
                        this.$toast.error(res.resultMsg);
                    }else{
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
        dateChange(value, index) {
            let idx = '';
            if (index == 0) {
                idx = dates.indexOf(value);
            } else {
                idx = times.indexOf(value);
            }
            $('.mu-slide-picker-slot').eq(index).find('.mu-slide-picker-item').eq(idx).addClass('selected').siblings().removeClass('selected');
            this.dateSel[index] = idx;
        },
        openSheet(e) {
            this.openSel = true;
            if (this.startEnd != e) {
                this.dateSel = [0, 0];
            }
            this.startEnd = e;
            if (e == 0) {
                this.timeTxt = '选择开始时间';
            } else {
                this.timeTxt = '选择结束时间';
            }
        },
        openSheet1() {
            this.openSel1 = true;
        },
        sureSel() {
            let time = times[this.dateSel[1]];
            if (time.length <= 4) {
                time = '0' + time;
            }
            time += ':00';
            if (this.startEnd == 0) {
                let str = dateArr[this.dateSel[0]] + ' ' + time;
                if (this.form.endTime && (new Date(str).getTime() >= new Date(this.form.endTime).getTime())) {
                    this.$toast.error('开始时间不能大于结束时间');
                    return;
                }
                this.form.startTime = str;
                this.startTime = dates[this.dateSel[0]] + ' ' + times[this.dateSel[1]];
            } else {
                let str = dateArr[this.dateSel[0]] + ' ' + time;
                if (this.form.startTime && (new Date(str).getTime() <= new Date(this.form.startTime).getTime())) {
                    this.$toast.error('结束时间不能小于开始时间');
                    return;
                }
                this.form.endTime = str;
                this.endTime = dates[this.dateSel[0]] + ' ' + times[this.dateSel[1]];
            }
            this.dates = [dates[this.dateSel[0]], times[this.dateSel[1]]];
            this.openSel = false;
            if (this.form.startTime && this.form.endTime) {
                this.getPrice();
            }
        },
        getPrice() {
            carPrice({ carId: this.id, startTime: this.form.startTime, endTime: this.form.endTime }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    this.feeList = r.orderDayChargeInfoList;
                    this.changeIdList = r.changeIdList || [];
                    this.totalPrice = r.totalPrice;
                    this.getSum();
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
            actList({ refId: this.id, refType: 0 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.actArr = res.resultData;
                } else {
                    this.actArr = [];
                }
            });
        },
        getXuzhi() {
            explainInfo({ refId: this.id, refType: 0 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.xuzhi = res.resultData.content;
                } else {
                    this.xuzhi = '';
                }
            })
        },
        selAddr(index) {
            let arr = [];
            if (index < 0) {
                this.carAddr = '地址1 1元';
                this.form.carAddressId = -1;
                this.total += 1;
                this.addrCharge = 1;
                arr.push({
                    chargeName: '送车服务费',
                    serviceCharge: 1,
                });
            } else {
                let a = this.info.carAddressVOList[index];
                this.form.carAddressId = a.carAddressId;
                this.carAddr = a.address;
                if (this.way == 1) {
                    this.carAddr += ' ' + a.charge + '元';
                    this.total += a.charge;
                    this.addrCharge = a.charge;
                    arr.push({
                        chargeName: '送车服务费',
                        serviceCharge: a.charge,
                    });
                }
            }
            this.feeList3 = [...arr];
            this.form = Object.assign({}, this.form);
            this.openSel1 = false;
        },
        changeTab(e) {
            this.way = e;
            if (e == 0) {
                this.total -= this.addrCharge;
                this.addrCharge = 0;
            }
            this.feeList3 = [];
            this.carAddr = '';
            this.form.carAddressId = '';
        },
        getSum(e) {
            const that = this;
            let sum = this.totalPrice || 0;
            sum += this.addrCharge || 0;
            const $chks = $('.chk.on');
            let fee = 0;
            let arr = [];
            $chks.each((index, el) => {
                let idx = $(el).prev().val();
                let a = that.info.carChargeVOList[idx];
                fee += a.serviceCharge;
                arr.push({
                    chargeName: a.chargeName,
                    serviceCharge: a.serviceCharge,
                });
            });
            this.feeList2 = [...arr];
            if (e && e.target) {
                let idx = +$(e.target).val();
                if (this.chargeIndex.indexOf(idx) > -1) {
                    fee += that.info.carChargeVOList[idx].serviceCharge;
                } else {
                    fee -= that.info.carChargeVOList[idx].serviceCharge;
                }
            }
            sum += fee;
            if (this.actId) {
                if (this.actObj.activityType == 0) {
                    this.total = sum * this.actObj.discountRatio / 100;
                    this.jian = (sum * 100 - this.total * 100) / 100;
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
                $('.chk1').removeAttr('checked');
                $(e.target).attr('checked', 'checked');
                this.actId = o.activityId;
            }
            this.actObj = Object.assign({}, o);
            this.getSum();
        },
        submit() {

        },
        swiper() {
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'custom',
                    renderCustom: function (swiper, current, total) {
                        return current + '/' + total;
                    }
                },
            });
        }
    },
    mounted() {
        this.id = this.$route.params.id;
        if(this.id){
            this.getData();
            this.getXuzhi();
            this.getActList();
        }else{
            this.$toast.error('车辆');
            this.$router.replace('/index');
        }
    }
}
Vue.use(Snackbar);
Vue.use(Button);
Vue.use(Icon);
Vue.use(BottomSheet);
Vue.use(TextField);
Vue.use(Checkbox);
Vue.use(SlidePicker);
</script>

<style scoped lang="less">
.top {
    padding: .1rem .16rem;
    background: linear-gradient(180deg, #0098AC 60%, #fff 40%);
    .swiper-container{
        overflow: hidden;
        border-radius: .08rem;
        .swiper-slide{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 100%;
                height: 1.9rem;
                vertical-align: top;
            }
        }
        .swiper-pagination {
            padding: 0 .15rem;
            color: #fff;
            text-align: center;
        }
    }
}
.mid {
    padding-bottom: .8rem;
    .info {
        padding: .15rem;
        border-bottom: 1px solid #f6f6f6;
        .name {
            font-size: .16rem;
            color: #000;
            margin-right: .1rem;
            font-weight: bold;
        }
        .mer {
            font-size: .13rem;
            color: #333;
            margin-right: .08rem;
        }
        .call {
            padding: 0 .05rem;
            background: rgba(0, 0, 0, .9);
            color: #fff;
            font-size: .12rem;
            border-radius: .2rem;
            line-height: .2rem;
            transform: scale(.85) translateY(2px);
        }
        .desc {
            font-size: .12rem;
            color: #333;
            margin-top: 5px;
        }
    }
    .use {
        padding: .15rem;
        border-bottom: 1px solid #f6f6f6;
        .txt {
            padding: 0 .05rem;
            background: rgba(0, 0, 0, .9);
            color: #fff;
            font-size: .12rem;
            border-radius: .18rem;
            line-height: .18rem;
            margin-right: .1rem;
        }
        .time {
            font-size: .14rem;
            color: #999;
            &.on {
                color: #000;
            }
        }
        .way {
            margin-top: .1rem;
            .tab {
                margin-right: .15rem;
                font-size: .14rem;
                padding: 0 .05rem;
                background: #ccc;
                color: #fff;
                font-size: .12rem;
                border-radius: .18rem;
                line-height: .18rem;
                &.on {
                    background: #000;
                }
            }
        }
        .addr {
            display: inline-block;
            color: #999;
            font-size: .14rem;
            margin-top: .1rem;
        }
    }
    .user {
        padding: .15rem;
        border-bottom: 1px solid #f6f6f6;
        font-size: .13rem;
        color: #000;
        .item {
            padding: .1rem 0;
            .label {
                min-width: .4rem;
            }
            .mu-input {
                min-height: auto;
                height: .24rem;
                line-height: .24rem;
                padding: 0 .1rem;
                font-size: .14rem;
                margin: 0;
                // color: #333;
            }
        }
    }
    .fee {
        padding: .15rem;
        border-bottom: 1px solid #f6f6f6;
        font-size: .13rem;
        color: #000;
        .item {
            margin-top: .1rem;
            .chk {
                appearance: none;
                display: inline-block;
                width: .16rem;
                height: .16rem;
                background: url(/static/img/unchecked.png) no-repeat;
                background-size: 100% 100%;
                background-position: 0 0;
                font-size: 0;
                &.on {
                    background-image: url(/static/img/checked.png);
                }
            }
        }
    }
    .piao {
        padding: .15rem;
        >p {
            font-size: .14rem;
            margin-bottom: .1rem;
        }
        .lab {
            margin-right: .15rem;
        }
        .rad {
            margin-right: 5px;
            appearance: none;
            display: inline-block;
            width: .16rem;
            height: .16rem;
            background: url(/static/img/unchecked.png) no-repeat;
            background-position: 0 0;
            background-size: 100% 100%;
            &[checked="checked"] {
                background-image: url(/static/img/checked.png);
            }
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
            .chk1 {
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
        }
    }
}
.bot {
    position: fixed;
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
.bot-s1 {
    .top {
        height: .4rem;
        padding: 0 .15rem;
        &.t1 {
            color: #999;
            line-height: .4rem;
            text-align: center;
        }
        .btn {
            font-size: .15rem;
            color: #999;
        }
        .btn1 {
            color: #333;
        }
    }
    .item {
        text-align: center;
        display: block;
        height: .4rem;
        line-height: .4rem;
        font-size: .14rem;
        border-top: 1px solid #f6f6f6;
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
        padding: .1rem .16rem .1rem 0;
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
<style>
.bot-s2 .mu-text-field-input{
    height: .2rem;
    line-height: .2rem;
    text-align: center;
}
.mu-slide-picker-item {
    font-size: 13px;
    opacity: .7;
}
.mu-slide-picker-item.selected {
    font-size: 18px;
    font-weight: bold;
    opacity: 1;
}
.mu-text-field-input {
	height: .24rem;
}
</style>
