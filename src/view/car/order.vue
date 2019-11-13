<template>
    <div id="pageContainer">
        <div class="title-box">
            <a href="javascript:;" class="back" onclick="history.go(-2)"></a>
            <p>{{info.carType}}</p>
        </div>
        <div class="container-pos">
            <div class="top">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in info.carPicList" :key="'img' + index">
                            <img :src="item" />
                        </div>
                    </div>
                    <div class="swiper-pagination car"></div>
                </div>
                <div class="info flex spb">
                    <div class="left">
                        <p class="name">{{info.carType}}</p>
                        <div class="desc flex">
                            <img src="../../assets/img/car/car-icon.png" alt="" />
                            <p>{{info.carBrieflyDesc}}</p>
                        </div>
                        <p class="mer">{{info.carMerchant}}</p>
                    </div>
                    <a :href="'tel:' + info.linkPhone" class="call fshrink0">电话咨询</a>
                </div>
                <div class="use">
                    <div class="time-box">
                        <div class="txt flex spb">
                            <p>开始时间</p>
                            <p>结束时间</p>
                        </div>
                        <div class="ln">
                            <img src="../../assets/img/car/car.png" alt="" />
                        </div>
                        <div class="time flex spb">
                            <p>{{startTime || '--'}}</p>
                            <p>{{endTime || '--'}}</p>
                            <a href="javascript:;" class="edit" @click="openSheet(0)">用车时间</a>
                        </div>
                    </div>
                    <div class="way flex fcen">
                        <a href="javascript:;" class="tab flex fcen" :class="{on: way == 0}" @click="changeTab(0)">
                            <img :src="way == 0 ? '/static/img/checked1.png' : '/static/img/unchecked1.png'" alt="" />
                            <span>到店提车</span>
                        </a>
                        <a href="javascript:;" class="tab flex fcen" :class="{on: way == 1}" @click="changeTab(1)" v-show="info.isHouseDelivery == 1">
                            <img :src="way == 1 ? '/static/img/checked1.png' : '/static/img/unchecked1.png'" alt="" />
                            <span>送车上门</span>
                        </a>
                    </div>
                    <div class="addr-box flex fcen">
                        <img src="../../assets/img/car/map.png" alt="" />
                        <a href="javascript:;" class="addr" v-if="!form.carAddressId" @click="openSheet1">请选择{{way == 0 ? '提车' : '送车'}}地点</a>
                        <a href="javascript:;" class="addr on" v-else @click="openSheet1">{{carAddr}}</a>
                    </div>
                </div>
            </div>
            <div class="mid">
                <div class="user">
                    <p class="title">请填写驾驶员信息</p>
                    <div class="item flex fcen">
                        <div class="label">姓名</div>
                        <div class="inp-box flex1">
                            <input type="text" class="inp" v-model="form.userName" @input="getValids" :max-length="20" placeholder="请填写真实姓名" />
                        </div>
                    </div>
                    <div class="item flex fcen">
                        <div class="label">身份证</div>
                        <div class="inp-box flex1">
                            <input type="text" class="inp" v-model="form.identityCard" @input="getValids" :max-length="20" placeholder="请填写身份证号" />
                        </div>
                    </div>
                    <div class="item flex fcen">
                        <div class="label">手机号</div>
                        <div class="inp-box flex1">
                            <input type="number" class="inp" v-model="form.mobile" @input="getValids" :max-length="11" placeholder="请填写手机号码" />
                        </div>
                    </div>
                    <div class="item flex fcen">
                        <div class="label">驾照号</div>
                        <div class="inp-box flex1">
                            <input type="text" class="inp" v-model="form.drivingLicense" :max-length="20" placeholder="请填写驾照号-选填" />
                        </div>
                    </div>
                </div>
                <div class="fee">
                    <p class="title">请选择服务费用</p>
                    <div class="item flex spb fcen" v-for="(item,index) in carChargeVOList" :key="'cc' + index">
                        <p>{{item.chargeName}} ¥{{item.serviceCharge}}<a href="javascript:;" class="ques" @click="showDetail(index)"></a></p>
                        <input type="checkbox" :value="index" v-model="chargeIndex" @change="getSum" style="display: none;" :id="'chk' + index" 
                            :disabled="(item.isMust || item.isMust2) ? 'disabled' : false" />
                        <label :for="'chk' + index" class="chk chk1 fee-chk" :class="{on: item.isMust || item.isMust2 || chargeIndex.indexOf(index) > -1}"></label>
                    </div>
                </div>
                <div class="piao">
                    <p class="title">是否需要开发票</p>
                    <div class="flex fcen">
                        <input type="radio" :value="0" v-model="form.isNeedInvoice" name="invoice" class="chk rad" id="invoice0" />
                        <label for="invoice0" class="lab">不需要发票</label>
                        <input type="radio" :value="1" v-model="form.isNeedInvoice" name="invoice" class="chk rad" id="invoice1" />
                        <label for="invoice1" class="lab">需要发票</label>
                    </div>
                    <div class="taitou flex fcen" v-show="form.isNeedInvoice == 1">
                        <div class="label">发票抬头</div>
                        <input type="text" class="inp flex1" v-model="form.invoiceTitle" placeholder="请输入发票抬头" />
                    </div>
                    <div class="taitou flex fcen" v-show="form.isNeedInvoice == 1">
                        <div class="label">发票税号</div>
                        <input type="text" class="inp flex1" v-model="form.dutyParagraph" placeholder="请输入发票税号" />
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
                            <input type="checkbox" :value="index" name="act" :id="'chk1' + index" class="chk chk1" @change="getTotal" />
                        </label>
                    </div>
                </div>
                <div class="xuzhi">
                    <p class="title">预订须知</p>
                    <div class="con" v-html="info.orderExplain" id="xuzhi"></div>
                    <a href="javascript:;" class="look" @click="lookAll" v-if="showLook">{{isAll ? '收起' : '查看全部'}}</a>
                </div>
                <div class="prot flex fcen">
                    <input type="checkbox" v-model="prot" :value="1" name="prot" id="prot" class="chk chk1" />
                    <label for="prot">已阅读并同意</label>
                    <router-link to="/car/protocol" class="link">预定条款</router-link>
                </div>
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
            <a href="javascript:;" class="submit" :class="{no: !valids}" @click="submit" v-loading="loading1" data-mu-loading-text="" data-mu-loading-size="24">立即支付</a>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s1" :overlay="false">
            <div class="top1 flex spb fcen">
                <a href="javascript:;" class="btn" @click="openSel = false;">取消</a>
                <span>{{timeTxt}}</span>
                <a href="javascript:;" class="btn btn1" @click="sureSel">确认</a>
            </div>
            <mu-slide-picker :slots="dateSlots" :visible-item-count="5" @change="dateChange" :values="dates"></mu-slide-picker>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel1" class="bot-s1" :overlay="false">
            <div class="top1">{{way == 0 ? '选择提车地点' : '选择送车地点'}}</div>
            <div class="list" v-if="way == 0">
                <a href="javascript:;" class="item" v-for="(item,index) in info.carAddressVOList" :key="'addr' + index" 
                    v-if="item.addressType == 0" @click="selAddr(index)">{{item.address}}</a>
            </div>
            <div class="list" v-else>
                <a href="javascript:;" class="item" v-for="(item,index) in info.carAddressVOList" :key="'addr' + index" 
                    v-if="item.addressType == 1" @click="selAddr(index)">{{item.address}} {{item.charge}}元</a>
                <!-- <a href="javascript:;" class="item" @click="selAddr(-1)">地址1 1元</a> -->
            </div>
            <a href="javascript:;" class="close" @click="openSel1 = false;">取消</a>
        </mu-bottom-sheet>
        <mu-bottom-sheet :open.sync="openSel2" class="bot-s2" :overlay="false">
            <p class="title">费用明细 <a href="javascript:;" class="btn" @click="openSel2 = false;">关闭</a></p>
            <div class="top1">
                <div class="txt flex spb">
                    <p>全部费用</p>
                    <p>¥{{total + jian | fmt}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList" :key="'fee' + index" v-if="!item.chargeId">
                    <p>{{item.day}} (租金)</p>
                    <p>¥{{item.serviceCharge || 0}}</p>
                </div>
                <div class="item flex spb" v-for="(item,index) in feeList2" :key="'fee2' + index">
                    <p>{{item.chargeName}}</p>
                    <p>¥{{item.serviceCharge || 0}}{{item.num > 1 ? ' ×' + item.num : ''}}</p>
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
        <mu-bottom-sheet :open.sync="openSel3" class="bot-s3" :overlay="false">
            <p class="title">{{chargeInfo.chargeName}}<a href="javascript:;" class="btn" @click="openSel3 = false;">关闭</a></p>
            <div class="con">{{chargeInfo.remark || '暂无说明'}}</div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
        <a href="javascript:;" class="overlay" v-show="openSel1" @click="openSel1 = false;"></a>
        <a href="javascript:;" class="overlay" v-show="openSel2" @click="openSel2 = false;"></a>
        <a href="javascript:;" class="overlay" v-show="openSel3" @click="openSel3 = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'swiper/dist/css/swiper.min.css';
import { BottomSheet, SlidePicker } from 'muse-ui';
import { carInfo, carPrice, carOrder, carChargeDetail } from '../../api/car';
import { actList, payData, authorize } from '../../api/api';
import Swiper from 'swiper';
import moment, { min } from 'moment';
import Cookies from 'js-cookie';
let dateArr = [], hours = [], minutes = [], dates = [];
let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let dd = new Date();
let yearIndex = 0;
for (let i = 0; i < 56; i++) {
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
hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
minutes = ['00', '15', '30', '45'];
export default {
    data() {
        return {
            info: {},
            openSel: false,
            openSel1: false,
            openSel2: false,
            openSel3: false,
            openSel3: false,
            carAddr: '',
            form: {
                carChargeIdList: [],
                carAddressId: 0,
                drivingLicense: '',
                startTime: '',
                endTime: '',
                userName: '',
                mobile: '',
                identityCard: '',
                isNeedInvoice: 0,
                invoiceTitle: '',
                dutyParagraph: '',
            },
            dateSlots: [{
                width: '100%',
                textAlign: 'right',
                values: dates,
            }, {
                width: '100%',
                textAlign: 'right',
                values: hours,
            }, {
                width: '100%',
                textAlign: 'center',
                values: minutes,
            }],
            dates: [dates[0], hours[0], minutes[0]],
            way: 0,
            dateSel: [0, 0, 0],
            timeTxt: '',
            startEnd: 0,
            startTime: '',
            endTime: '',
            chargeIndex: [],
            total: 0,
            jian: 0,
            loading1: false,
            feeList: [],    //价格查询返回
            feeList2: [],   //服务费列表
            feeList3: [],   //送车费用
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
            prot: [1],
            valids: false,
            carChargeVOList: [],
            screenHeight: '',
            chargeInfo: {},
            isAll: false,
            showLook: false,
            carChargeList: [],
            dateNum: 0,
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
            this.loading = this.$loading();
            carInfo({ carId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    this.chargeArr = [...res.resultData.carChargeVOList];
                    this.carChargeVOList = res.resultData.carChargeVOList.filter(item => {
                        return item.isMust == 1 || (item.isMust == 0 && item.chargeType == 7);
                    });
                    this.carChargeList = this.carChargeVOList;
                    setTimeout(() => {
                        this.swiper();
                        this.getSum();
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
        dateChange(value, index) {
            let idx = '';
            if (index == 0) {
                idx = dates.indexOf(value);
                this.dateNum = idx - this.dateNum;
            } else if (index == 1) {
                idx = hours.indexOf(value);
            } else {
                idx = minutes.indexOf(value);
            }
            $('.mu-slide-picker-slot').eq(index).find('.mu-slide-picker-item').eq(idx).addClass('selected').siblings().removeClass('selected');
            this.dateSel[index] = idx;
        },
        openSheet(e) {
            this.openSel = true;
            if (this.startEnd != e) {
                this.dateSel = [0, 0, 0];
            }
            this.startEnd = e;
            if (e == 0) {
                this.dateNum = 0;
                this.timeTxt = '选择开始时间';
            } else {
                this.timeTxt = '选择结束时间';
            }
        },
        openSheet1() {
            this.openSel1 = true;
        },
        sureSel() {
            let hour = hours[this.dateSel[1]];
            let min = minutes[this.dateSel[2]];
            this.dateNum += + (this.dateSel[1] == 0 && this.dateSel[2] == 0) ? 0 : 1;
            let time = hour + ':' + min + ':' + '00';
            if (this.startEnd == 0) {
                let str = dateArr[this.dateSel[0]] + ' ' + time;
                this.endTime = '';
                this.form.endTime = '';
                if (this.form.endTime && (new Date(str).getTime() >= new Date(this.form.endTime).getTime())) {
                    this.$toast.error('开始时间不能大于结束时间');
                    return;
                }
                this.form.startTime = str;
                this.startTime = dates[this.dateSel[0]].split(' ')[0] + ' ' + hour + ':' + min;
                this.openSel = false;
                // this.dates = [dates[this.dateSel[0]], times[this.dateSel[1]]];
                setTimeout(() => {
                    this.openSheet(1);
                }, 200);
                return;
            } else {
                let str = dateArr[this.dateSel[0]] + ' ' + time;
                if (this.form.startTime && (new Date(str).getTime() <= new Date(this.form.startTime).getTime())) {
                    this.$toast.error('结束时间不能小于开始时间');
                    return;
                }
                this.form.endTime = str;
                this.endTime = dates[this.dateSel[0]].split(' ')[0] + ' ' + hour + ':' + min;
                // this.dates = [dates[this.dateSel[0]], times[this.dateSel[1]]];
            }
            this.openSel = false;
            if (this.form.startTime && this.form.endTime) {
                this.getPrice();
            }
        },
        getCarChargeDetail() {
            carChargeDetail({ carId: this.id, searchStartTime: this.form.startTime, searchEndTime: this.form.endTime }).then(res => {
                if (res.resultCode == 200 && res.resultData && res.resultData.length > 0) {
                    let s = res.resultData[0].stock;
                    for (let v of res.resultData) {
                        if (s > v.stock) {
                            s = v.stock;
                        }
                    }
                    this.info['stock'] = s;
                    if (s <= 0) {
                        this.$toast.error('库存不足');
                    }
                } else {
                    this.info.stock == 0;
                    this.$toast.error('库存不足');
                }
            })
        },
        getPrice() {
            carPrice({ carId: this.id, startTime: this.form.startTime, endTime: this.form.endTime }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.getCarChargeDetail();
                    let r = res.resultData;
                    this.feeList = r.orderDayChargeInfoList;
                    this.totalPrice = r.totalPrice;
                    this.info.carChargeVOList = [...this.chargeArr];
                    let arr = this.info.carChargeVOList.filter(item => {
                        return item.isMust == 0;
                    });
                    let arr2 = [];
                    for (let v of arr) {
                        for (let a of r.orderDayChargeInfoList) {
                            let objs = arr2.filter(item => {
                                return item.carChargeId == a.chargeId;
                            });
                            if (v.carChargeId == a.chargeId && objs.length == 0) {
                                v.isMust2 = 1;
                                arr2.push(v);
                            }
                        }
                    }
                    this.carChargeVOList = [...this.carChargeList, ...arr2];
                    setTimeout(() => {
                        this.getSum();
                    }, 100);
                    this.nosubmit = false;
                } else {
                    this.nosubmit = true;
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
            let fee = 0;
            let arr = [];
            that.form.chargeInfoList = [];
            for (let i = 0; i < this.feeList.length; i++) {
                that.form.chargeInfoList.push(this.feeList[i]);
            }
            let num = 0;
            for (let v of this.carChargeVOList) {
                if (v.isMust) {
                    fee += v.serviceCharge;
                    arr.push({
                        chargeName: v.chargeName,
                        serviceCharge: v.serviceCharge,
                    });
                    that.form.chargeInfoList.push({
                        chargeId: v.carChargeId,
                        day: null,
                        serviceCharge: v.serviceCharge,
                    });
                } else {
                    for (let w of this.feeList) {
                        if (w.chargeId == v.carChargeId) {
                            num++;
                        }
                    }
                    if (num > 0) {
                        arr.push({
                            chargeName: v.chargeName,
                            serviceCharge: v.serviceCharge,
                            num: num,
                        });
                    }
                }
            }
            for (let v of this.chargeIndex) {
                arr.push({
                    chargeName: this.carChargeVOList[v].chargeName,
                    serviceCharge: this.carChargeVOList[v].serviceCharge,
                });
                fee += this.carChargeVOList[v].serviceCharge;
                that.form.chargeInfoList.push({
                    chargeId: that.carChargeVOList[v].carChargeId,
                    day: null,
                    serviceCharge: that.carChargeVOList[v].serviceCharge,
                });
            }
            this.feeList2 = [...arr];
            that.form = Object.assign({}, that.form);
            sum += fee;
            if (this.actId) {
                if (this.actObj.activityType == 0) {
                    this.total = sum * 100 * this.actObj.discountRatio / 10000;
                    this.total = this.total < 0.01 ? 0.01 : this.total;
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
            if (this.nosubmit) {
                this.$toast.error('请重新选择时间！');
                return;
            }
            if (this.orderId) {
                this.pay();
                return;
            }
            if (this.loading1 || !this.valid()) return;
            let param = Object.assign({}, this.form, {
                carId: this.id,
                activityId: this.actId || 0,
            });
            this.loading1 = true;
            carOrder(param).then(res => {
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
                            sessionStorage.removeItem('payCar');
                            location.href = '/paySuccess/car/' + that.orderId;
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
            let payInfo = sessionStorage.getItem('payCar');
            if (this.orderId && payInfo && this.cancelPay) {
                this.payParams = JSON.parse(payInfo);
                this.pay();
            } else {
                payData({ code: this.code, refType: 0, orderId: this.orderId, proName: this.info.carType }).then(res => {
                    if (res.resultCode == 200 && res.resultData) {
                        this.payParams = res.resultData;
                        sessionStorage.setItem('payCar', JSON.stringify(res.resultData));
                        this.pay();
                    } else {
                        this.loading1 = false;
                        this.$toast.error('获取微信支付参数失败，请重试');
                        setTimeout(() => {
                            let urls = '/pay/car?id=' + this.id;
                            history.pushState(null, null, urls);
                            location.href = urls;
                        }, 1000);
                    }
                })
                .catch(err => {
                    this.loading1 = false;
                    this.$toast.error('获取微信支付参数失败，请重试');
                    setTimeout(() => {
                        let urls = '/pay/car?id=' + this.id;
                        history.pushState(null, null, urls);
                        location.href = urls;
                    }, 1000);
                })
            }
        },
        showDetail(idx) {
            let a = this.info.carChargeVOList[idx];
            this.chargeInfo = Object.assign({}, a);
            this.openSel3 = true;
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
        getValids() {
            if (this.form.userName && this.form.identityCard && this.form.mobile) {
                this.valids = true;
            } else {
                this.valids = false;
            }
        },
        valid() {
            if (!this.form.userName) {
                this.$toast.error('请填写驾驶员姓名');
                return false;
            }
            if (!this.form.identityCard) {
                this.$toast.error('请填写驾驶员身份证号');
                return false;
            }
            if (!this.form.mobile) {
                this.$toast.error('请填写驾驶员手机号');
                return false;
            }
            if (!this.$util.telValidate(this.form.mobile)) {
                this.$toast.error('手机号不正确');
                return false;
            }
            if (!this.form.carAddressId) {
                this.$toast.error('请选择提送车地址');
                return false;
            }
            return true;
        },
        swiper() {
            let isLoop = this.info.carPicList && this.info.carPicList.length > 1;
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: isLoop,
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
        sessionStorage.removeItem('payCar');
    },
}
Vue.use(BottomSheet);
Vue.use(SlidePicker);
</script>

<style scoped lang="less">
.container-pos {
    background: #F8F8F8;
    padding-top: .48rem;
    padding-bottom: .9rem;
}
.top {
    padding: .1rem .16rem .2rem;
    background: linear-gradient(180deg, #0098AC 25%, #fff 20%); 
    .swiper-container{
        overflow: hidden;
        border-radius: .08rem;
        min-height: 1rem;
        .swiper-slide{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 100%;
                height: 1.9rem;
                vertical-align: top;
                object-fit: cover;
                border-radius: .08rem;
            }
        }
        .swiper-pagination {
            padding: 0 .15rem;
            color: #fff;
            text-align: right;
        }
    }
    .info {
        padding: .15rem 0;
        margin-top: .1rem;
        line-height: 1;
        .left {
            width: 80%;
        }
        .name {
            font-size: .18rem;
            color: #222;
            font-weight: bold;
        }
        .desc {
            font-size: .13rem;
            color: #666;
            margin-top: .1rem;
            overflow: hidden;
            line-height: 1.2;
            img {
                width: .15rem;
                height: .15rem;
                margin-right: 3px;
            }
        }
        .mer {
            font-size: .12rem;
            color: #9c9c9c;
            margin-top: .08rem;
        }
        .call {
            display: block;
            width: .76rem;
            height: .3rem;
            line-height: .3rem;
            background: #0098AC;
            color: #fff;
            font-size: .13rem;
            border-radius: .03rem;
            text-align: center;
        }
    }
    .use {
        padding: .05rem 0 0;
        .time-box {
            .txt {
                padding: 0 4px;
                font-size: .11rem;
                color: #222;
            }
            .ln {
                margin: .15rem 0;
                width: 100%;
                height: 1px;
                position: relative;
                background: #0098AC;
                &::before, &::after {
                    content: '';
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    border: 1px solid #2FABBB;
                    background: #fff;
                    position: absolute;
                    top: -3px;
                    border-radius: 100%;
                }
                &::before {
                    left: .22rem;
                }
                &::after {
                    right: .22rem;
                }
                img {
                    width: .35rem;
                    height: .2rem;
                    position: absolute;
                    top: -.2rem;
                    left: 50%;
                    margin-left: -.17rem;
                }
            }
            .time {
                font-size: .15rem;
                color: #222;
                position: relative;
                .edit {
                    font-size: .15rem;
                    color: #0098AC;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    -webkit-transform: translate3d(-50%, 0, 0);
                    transform: translate3d(-50%, 0, 0);
                }
            }
        }
        .way {
            margin-top: .2rem;
            .tab {
                margin-right: .3rem;
                font-size: .14rem;
                color: #333;
                font-size: .14rem;
                line-height: 1;
                img {
                    width: .18rem;
                    height: .18rem;
                    margin-right: 4px;
                }
            }
        }
        .addr-box {
            margin-top: .15rem;
            img {
                width: .18rem;
                height: .18rem;
                margin-right: 3px;
            }
            .addr {
                display: inline-block;
                color: #0098AC;
                font-size: .14rem;
            }
        }
    }
}
.mid {
    margin-top: .12rem;
    padding: .24rem 0 .2rem .16rem;
    background: #fff;
    .title {
        font-size: .18rem;
        color: #222;
        font-weight: bold;
        padding-left: .11rem;
        position: relative;
        line-height: 1;
        margin-bottom: .16rem;
        &::before {
            content: '';
            display: inline-block;
            width: 3px;
            height: .18rem;
            background: #0399AC;
            position: absolute;
            left: 0;
            top: 0;
            vertical-align: top;
        }
    }
    .user {
        .item {
            padding: .15rem .16rem .15rem 0;
            border-bottom: 1px solid #eaeaea;
            line-height: 1;
            .label {
                min-width: .4rem;
                color: #666;
            }
            .inp {
                width: 100%;
                outline: none;
                border: none;
                background: none;
                height: .24rem;
                line-height: .24rem;
                font-size: .14rem;
                margin: 0;
                color: #222;
                text-align: right;
            }
        }
    }
    .fee {
        margin-top: .3rem;
        .item {
            padding: .1rem .16rem .1rem 0;
            font-size: .14rem;
            color: #666;
            margin-top: .1rem;
            border-bottom: 1px solid #eaeaea;
            .ques {
                display: inline-block;
                width: .14rem;
                height: .14rem;
                background: url(/static/img/ques.png) no-repeat;
                background-position: 0 0;
                background-size: 100% 100%;
                margin-left: 5px;
                margin-top: 2px;
                vertical-align: top;
            }
            .chk1 {
                margin-right: 0;
                &.on {
                    background-image: url(/static/img/checked1.png);
                }
            }
            [disabled="disabled"]+.chk1 {
                opacity: .5;
            }
        }
    }
    .piao {
        margin-top: .3rem;
        font-size: .14rem;
        color: #222;
        .lab {
            margin-right: .3rem;
        }
        .rad {
            margin-right: 5px;
            &:checked {
                background-image: url(/static/img/checked1.png);
            }
        }
        .taitou {
            margin-top: .15rem;
            padding-bottom: .1rem;
            padding-right: .16rem;
            border-bottom: 1px solid #eaeaea;
            .inp {
                border: none;
                outline: none;
                background: none;
                text-align: right;
                margin-left: .15rem;
            }
        }
    }
    .act {
        margin-top: .3rem;
        .list {
            padding-top: .1rem;
            padding-right: .16rem;
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
                margin-right: 0;
            }
        }
    }
    .xuzhi {
        margin-top: .3rem;
        padding: 0 .16rem .1rem 0;
        font-size: .14rem;
        color: #666;
        text-align: justify;
        line-height: 1.5;
        .con {
            overflow: hidden;
        }
        .look {
            display: block;
            margin-top: .1rem;
            color: #0098AC;
            font-size: .13rem;
        }
    }
    .prot {
        margin-top: .25rem;
        font-size: .14rem;
        color: #222;
        .link {
            color: #FF5A5E;
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
.bot-s1 {
    .top1 {
        height: .4rem;
        padding: 0 .15rem;
        color: #999;
        line-height: .4rem;
        text-align: center;
        .btn {
            font-size: .15rem;
            color: #9c9c9c;
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
    .top1 {
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
.bot-s3 {
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
    .con {
        padding: .16rem;
        font-size: .14rem;
        color: #666;
        line-height: 1.5;
        min-height: 100px;
        max-height: 400px;
        overflow-y: auto;
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
