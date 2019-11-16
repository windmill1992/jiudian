<template>
    <div id="pageContainer">
        <div class="container-pos">
            <template v-if="hasData">
                <div class="top">
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="(item,index) in info.hotalPicUrlList" :key="'img' + index">
                                <img :src="item" />
                            </div>
                        </div>
                        <div class="swiper-pagination hotel"></div>
                    </div>
                </div>
                <div class="mid">
                    <div class="info">
                        <div class="flex spb">
                            <div class="flex1">
                                <div class="flex fcen">
                                    <p class="name">{{info.hotelName}}</p>
                                    <p class="txt">{{info.startTime}}年开业</p>
                                </div>
                                <div class="addr flex">
                                    <img src="../../assets/img/hotel/map.png" alt="" />
                                    <p>{{info.hotelAddress}}</p>
                                </div>
                            </div>
                            <router-link :to="'/hotel/detail/' + id" class="detail">详情</router-link>
                        </div>
                        <div class="tags">
                            <span class="tag" v-for="(item,index) in info.hotelFacilityList" :key="'hf' + index">{{item.hotelFacilityName}}</span>
                        </div>
                        <div class="time-box" v-if="!notHotel">
                            <div class="txt flex spb">
                                <p>入住时间</p>
                                <p>离店时间</p>
                            </div>
                            <div class="ln">
                                <img src="../../assets/img/hotel/run.png" alt="">
                            </div>
                            <div class="time flex spb">
                                <p>{{month1}}月{{day1}}日</p>
                                <p>{{month2}}月{{day2}}日</p>
                                <a href="javascript:;" class="edit" @click="editDate" id="select">修改日期</a>
                            </div>
                        </div>
                        <div class="time-box" v-else>
                            <div class="txt">预订日期</div>
                            <div class="time flex spb">
                                <p>{{month1}}月{{day1}}日</p>
                                <a href="javascript:;" class="edit" @click="editDate" id="select">修改日期</a>
                            </div>
                        </div>
                    </div>

                    <div class="room-box">
                        <div class="list">
                            <a href="javascript:;" class="item flex" v-for="(item,index) in roomList" :key="'hr' + index" @click="order(index)">
                                <div class="pic fshrink0" :style="'background-image: url(' + (item.picUrls ? item.picUrls[0] : '') + ');'">
                                    <div class="num">{{item.picUrls ? item.picUrls.length : 0}}</div>
                                </div>
                                <div class="con flex1">
                                    <p class="name">{{item.hotelRoomName}}</p>
                                    <p class="txt">{{item.hotelRoomDesc}}</p>
                                    <p class="stock">剩余{{item.stock}}{{notHotel ? '' : '间'}}</p>
                                    <div class="price">
                                        <span class="origin" v-if="item.newPrice">¥{{item.newPrice}}</span>
                                        <span>¥</span>{{item.serviceCharge}}
                                    </div>
                                </div>
                                <div class="btn" :class="{no: item.stock == 0}" v-if="!notHotel">{{item.stock == 0 ? '满房' : '预订'}}</div>
                                <div class="btn" :class="{no: item.stock == 0}" v-else>{{item.stock == 0 ? '已满' : '预订'}}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </template>
            <div class="nodata fcol fcen spc" v-else>未查询到数据，请检查参数或网络情况</div>
        </div>
        <div class="mask_calendar" @click="closeDate">
            <div class="calendar" :class="{single: notHotel}"></div>
            <template v-if="!notHotel">
                <input type="text" id="startDate" style="display: none;" />
                <input type="text" id="endDate" style="display: none;" />
                <input type="text" id="numDate" style="display: none;" />
            </template>
            <input type="text" id="orderDate" style="display: none;" v-else />
        </div>
        <div class="menus flex">
            <a href="javascript:;" class="menu fcol fcen spc on">
                <img src="../../assets/img/hotel/hotel2.png" alt="" />
                <span>预订</span>
            </a>
            <router-link :to="'/orders/hotelOrders/' + id" class="menu fcol fcen spc">
                <img src="../../assets/img/hotel/order1.png" alt="" />
                <span>订单</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import { hotelInfo, hotelFacilityList, hotelChargeDetail } from '../../api/hotel';
import { actList } from '../../api/api';
import { setTitle } from '../../utils/setTitle';
import Swiper from 'swiper';
export default {
    data() {
        return {
            info: {},
            roomList: [],
            tab: 0,
            year1: '',
            year2: '',
            month1: '',
            month2: '',
            day1: '',
            day2: '',
            hasData: true,
            id: '',
            notHotel: false,
        }
    },
    methods: {
        getData() {
            const that = this;
            this.loading = this.$loading();
            hotelInfo({ hotelId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    res.resultData.hotelFacilityList = res.resultData.hotelFacilityList || [];
                    this.info = res.resultData;
                    this.roomList = res.resultData.hotelRoomInfoList;

                    setTitle(res.resultData.hotelName);
                    localStorage.setItem('hotelTel', res.resultData.hotelTel);
                    localStorage.setItem('kfTel', res.resultData.serviceTel);

                    if (res.resultData.hotelName.indexOf('酒店') == -1) {
                        require('../../assets/js/date2');
                        localStorage.setItem('notHotel', 1);
                        this.notHotel = true;
                        that.initDate1();
                    } else {
                        require('../../assets/js/date');
                        localStorage.removeItem('notHotel');
                        this.notHotel = false;
                        that.initDate();
                    }
                    this.setPrice();
                    setTimeout(() => {
                        that.swiper();
                    }, 100);
                } else if (res.resultCode == 4002){
                    this.$Cookies.set('uid', '');
					this.$router.push('/login?from='+ encodeURIComponent(this.$route.fullPath));
                } else {
                    this.hasData = false;
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('服务器开了小差，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.hasData = false;
                this.loading.close();
                this.$toast.error('未知异常！');
                console.log(err);
            })
        },
        getHotelChargeDetail(id, n) {
            let t1 = this.year1 + '-' + this.month1 + '-' + this.day1 + ' 00:00:00';
            let t2 = '';
            if (this.notHotel) {
                t2 = this.year1 + '-' + this.month1 + '-' + this.day1 + ' 23:59:59';
            } else {
                t2 = this.year2 + '-' + this.month2 + '-' + this.day2 + ' 00:00:00';
            }
            hotelChargeDetail({ hotelRoomId: id, searchStartTime: t1, searchEndTime: t2 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    if (r.length > 0) {
                        let p = 0;
                        let isFull = false;
                        for (let v of r) {
                            p += v.serviceCharge;
                            if (v.stock == 0) {
                                isFull = true;
                            }
                        }
                        p = parseFloat(p / r.length).toFixed(2);
                        this.roomList[n]['serviceCharge'] = p;
                        this.roomList[n]['stock'] = isFull ? 0 : r[0].stock;
                    } else {
                        this.roomList[n]['serviceCharge'] = '?';
                        this.roomList[n]['stock'] = 0;
                    }
                    this.roomList = [...this.roomList];
                    if (n == this.roomList.length - 1) {
                        this.getActList();
                    }
                }
            })
        },
        setPrice() {
            if (this.roomList.length > 0) {
                for (let i = 0; i < this.roomList.length; i++) {
                    this.getHotelChargeDetail(this.roomList[i].hotelRoomId, i);
                }
            }
        },
        getActList() {
            actList().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    if (res.resultData.length > 0) {
                        let r = res.resultData;
                        for (let v of this.roomList) {
                            if (v.activityIdList.length > 0) {
                                let obj = r.filter(item => {
                                    return item.activityId == v.activityIdList[0];
                                });
                                if (obj && obj.length > 0) {
                                    v.newPrice = v.serviceCharge;
                                    v.serviceCharge = obj[0].activityType == 0 ? parseFloat(v.serviceCharge * obj[0].discountRatio / 100).toFixed(2) : (v.serviceCharge - obj[0].discountCharge);
                                    v.serviceCharge = v.serviceCharge <= 0 ? 0.01 : v.serviceCharge;
                                }
                            }
                        }
                        this.roomList = [...this.roomList];
                    }
                }
            })
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
        order(idx) {
            let r = this.roomList[idx];
            if (r.stock == 0) return;
            this.$router.push(`/pay/hotel?id=${this.id}&rid=${r.hotelRoomId}`);
        },
        swiper() {
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: this.info.hotalPicUrlList && this.info.hotalPicUrlList.length > 1,
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        },
        initDate() {
            const that = this;
            let dd = new Date();
            let y = dd.getFullYear();
            let m = dd.getMonth() + 1;
            let d = dd.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            this.year1 = y;
            this.month1 = m;
            this.day1 = d;
            dd.setDate(+d + 1);
            y = dd.getFullYear();
            m = dd.getMonth() + 1;
            d = dd.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            this.year2 = y;
            this.month2 = m;
            this.day2 = d;
            sessionStorage.setItem('hotelDate', `${this.year1}-${this.month1}-${this.day1},${this.year2}-${this.month2}-${this.day2},1`);

            $('#select').calendarSwitch({
				selectors: {
					sections: ".calendar"
				},
                index: 6,      //展示的月份个数
                animateFunction: "slideToggle",        //动画效果
                controlDay: true,    //是否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
                daysnumber: "180",     //控制天数
                comeColor: "#0098AC",       //入住颜色
                outColor: "#0098AC",      //离店颜色
                comeoutColor: "#E0F4F2",        //入住和离店之间的颜色
                callback: function() {  //回调函数
                	$('.mask_calendar').fadeOut(200);
                	var startDate = $('#startDate').val();  //入住的天数
	                var endDate = $('#endDate').val();      //离店的天数
	                var numDate = $('#numDate').val();     //共多少晚
                    let arr1 = startDate.split('-');
                    let arr2 = endDate.split('-');
                    that.year1 = arr1[0];
                    that.month1 = arr1[1];
                    that.day1 = arr1[2];
                    that.year2 = arr2[0];
                    that.month2 = arr2[1];
                    that.day2 = arr2[2];
                    sessionStorage.setItem('hotelDate', `${startDate},${endDate},${numDate}`);
                    that.setPrice();
                },   
                comfireBtn: '.comfire'  //确定按钮的class或者id
            });
        },
        initDate1() {
            const that = this;
            let dd = new Date();
            let y = dd.getFullYear();
            let m = dd.getMonth() + 1;
            let d = dd.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            this.year1 = y;
            this.month1 = m;
            this.day1 = d;
            sessionStorage.setItem('hotelDate', `${this.year1}-${this.month1}-${this.day1}`);

            $('#select').calendarSwitch({
				selectors: {
					sections: ".calendar"
				},
                index: 6,      //展示的月份个数
                animateFunction: "slideToggle",        //动画效果
                controlDay: true,    //是否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
                daysnumber: "180",     //控制天数
                color: "#0098AC",       //选中颜色
                clickToday: true,
                callback: function() {  //回调函数
                    $('.mask_calendar').fadeOut(200);
	                var orderDate = $('#orderDate').val();
                    let arr = orderDate.split('-');
                    that.year1 = arr[0];
                    that.month1 = arr[1];
                    that.day1 = arr[2];
                    sessionStorage.setItem('hotelDate', `${orderDate}`);
                    that.setPrice();
                },   
                comfireBtn: '.comfire'  //确定按钮的class或者id
            });
        },
    },
    mounted() {
        this.id = this.$route.params.id;
        if (this.id) {
            this.getData();
            localStorage.setItem('hotelId', this.id);
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
    }
}
</script>

<style scoped lang="less">
.container-pos {
    padding-bottom: .6rem;
    background: #F8F8F8;
}
.top {
    padding: .1rem .16rem;
    background: linear-gradient(180deg, #0098AC 60%, #fff 40%);
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
            text-align: center;
        }
    }
}
.mid {
    .info {
        padding: .16rem;
        background: #fff;
        .name {
            font-size: .18rem;
            color: #222;
            margin-right: 8px;
            font-weight: bold;
            max-width: 1.6rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .txt {
            font-size: .12rem;
            color: #666;
        }
        .addr {
            font-size: .13rem;
            color: #666;
            line-height: .13rem;
            width: 100%;
            word-break: break-all;
            margin-top: .08rem;
            img {
                width: .15rem;
                height: .15rem;
                vertical-align: top;
                margin-right: 2px;
                margin-top: 1px;
            }
        }
        .detail {
            display: block;
            width: .76rem;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #0098AC;
            border-radius: 3px;
            font-size: 13px;
            color: #fff;
            margin-left: .2rem;
            margin-top: 5px;
        }
        .tags {
            margin-top: .1rem;
            .tag {
                height: 18px;
                display: inline-block;
                padding: 0 5px;
                font-size: 12px;
                color: #0098AC;
                background: #E6F5F7;
                border-radius: 2px;
                margin-right: 2px;
                margin-bottom: 5px;
                transform: scale(.85);
                line-height: normal;
            }
        }
        .time-box {
            margin-top: .1rem;
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
    }
    .room-box {
        width: 100%;
        padding: .12rem 0 .12rem;
        .list {
            width: 100%;
            padding: 0;
        }
        .item {
            width: 100%;
            height: .98rem;
            padding: .12rem;
            background: #fff;
            position: relative;
            margin-bottom: .1rem;
            .pic {
                width: .74rem;
                height: .74rem;
                background-color: #f8f8f8;
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
                position: relative;
                overflow: hidden;
                margin-right: .09rem;
                .num {
                    background: rgba(0, 0, 0, .7);
                    border-radius: 2px;
                    height: 12px;
                    line-height: 12px;
                    font-size: 10px;
                    color: #fff;
                    padding: 0 5px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
            .con {
                overflow: hidden;
                line-height: 1.3;
                position: relative;
            }
            .name {
                font-size: .15rem;
                color: #222;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .txt {
                font-size: .11rem;
                color: #666;
                margin-top: 5px;
                min-height: .12rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .stock {
                font-size: .12rem;
                color: #666;
                margin-top: .05rem;
            }
            .price {
                font-size: .15rem;
                color: #FF5A5E;
                font-weight: bold;
                span {
                    font-size: .12rem;
                }
                .origin {
                    font-weight: normal;
                    color: #c9c9c9;
                    text-decoration: line-through;
                }
            }
            .btn {
                display: block;
                width: .48rem;
                height: .25rem;
                line-height: .25rem;
                text-align: center;
                background: #0098AC;
                border-radius: .02rem;
                font-size: .12rem;
                color: #fff;
                position: absolute;
                bottom: .12rem;
                right: .12rem;
                &.no {
                    background: #c9c9c9;
                }
            }
        }
    }
}
.menus {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .5rem;
    background: #fff;
    border-top: 1px solid #AEDEDE;
    z-index: 1;
    .menu {
        text-align: center;
        font-size: .12rem;
        color: #4c4c4c;
        width: 100%;
        &.on {
            color: #0098AC;
        }
        img {
            height: .23rem;
            width: .23rem;
            margin-bottom: 2px;
        }
    }
}
</style>
<style>
.hotel .swiper-pagination-bullet {
    width: .13rem;
    height: 3px;
    background: rgba(255, 255, 255, .6);
    border-radius: 3px;
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
}
.hotel .swiper-pagination-bullet-active {
    width: .22rem;
    background: #fff;
}
</style>