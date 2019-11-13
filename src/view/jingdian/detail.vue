<template>
    <div id="pageContainer">
        <div class="top">
            <div class="swiper-container jd">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in info.scenicSpotPicUrlList" :key="'img' + index">
                        <img :src="item" />
                    </div>
                </div>
                <div class="swiper-pagination jd"></div>
            </div>
            <div class="info flex" v-if="info.scenicSpotId">
                <div class="flex1">
                    <div class="flex fcen">
                        <p class="name">{{info.scenicSpotName}}</p>
                        <p class="type">{{info.scenicSpotTypeName}}</p>
                    </div>
                    <div class="addr flex">
                        <img src="../../assets/img/jd/map.png" alt="" />
                        <p>{{info.scenicSpotAddress}}</p>
                    </div>
                    <div class="state flex fcen" v-if="info.ticketsVOList">
                        <p class="tag">{{info.ticketsVOList[0] | fmt1}}</p>
                        <p>{{info.ticketsVOList[0].startTime | fmt}} - {{info.ticketsVOList[0].endTime | fmt}} 开放</p>
                    </div>
                </div>
                <!-- <router-link to="" class="nav">景点详情</router-link> -->
            </div>
        </div>
        <div class="mid">
            <div class="ticket">
                <p class="title flex spb fcen">
                    <span>门票购买</span>
                    <router-link :to="'/jingdian/tickets/' + id" class="all">全部 ></router-link>
                </p>
                <div class="list">
                    <div class="item flex fcen spb" v-for="(item,index) in info.ticketsVOList" :key="'t' + index" v-if="index < 3">
                        <div>
                            <div class="flex">
                                <p class="name line2">{{item.ticketsName}}</p>
                                <span class="tag">{{item.ticketsType == 0 ? '自由行' : '跟团游'}}</span>
                            </div>
                            <div class="time flex fcen">
                                <img src="../../assets/img/jd/time.png" alt="" />
                                <p>{{info.ticketsVOList[0].startTime | fmt}} - {{info.ticketsVOList[0].endTime | fmt}}可用</p>
                            </div>
                            <div class="xuzhi flex fcen">
                                <img src="../../assets/img/jd/info.png" alt="" />
                                <a href="javascript:;" class="a" @click="showInfo(index)">预订须知</a>
                            </div>
                        </div>
                        <div class="price-box">
                            <p class="price"><span>¥</span> {{item.ticketsCharge}}</p>
                            <router-link :to="'/pay/ticket?id=' + info.scenicSpotId + '&tid=' + item.ticketsId" class="btn">预订</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="desc-box">
                <p class="title">景点介绍</p>
                <div class="con" v-html="info.scenicSpotDescribe"></div>
            </div>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <div class="top1">
                <span>{{form.ticketsName}}</span>
                <a href="javascript:;" class="close" @click="openSel = false"></a>
            </div>
            <div class="con">
                <p class="title">预订须知</p>
                <div class="txt" v-html="form.orderExplain"></div>
            </div>
            <div class="btns">
                <router-link :to="'/pay/jingdian?id=' + info.scenicSpotId + '&tid=' + form.ticketsId" class="btn">花¥{{form.ticketsCharge}}预定</router-link>
            </div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'swiper/dist/css/swiper.min.css';
import { BottomSheet } from 'muse-ui';
import { jdInfo, jdTypeList } from '../../api/jingdian';
import { setTitle } from '../../utils/setTitle';
import Swiper from 'swiper';
import moment from 'moment';
export default {
    data() {
        return {
            info: {},
            openSel: false,
            form: {},
            id: '',
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '00:00';
            return t.split(' ')[1].substr(0, 5);
        },
        fmt1(a) {
            if (!a) return '未开放';
            let t = Date.now();
            let dd = moment(t).format('YYYY-MM-DD') + ' ';
            let st = new Date(dd + a.startTime.split(' ')[1]).getTime();
            let et = new Date(dd + a.endTime.split(' ')[1]).getTime();
            if (t >= et || t <= st) {
                return '未开放';
            }
            return '开放中';
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            jdInfo({ scenicSpotId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    this.getTypeList();
                    setTitle(res.resultData.scenicSpotName);
                    setTimeout(() => {
                        this.swiper();
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
        getTypeList() {
            jdTypeList().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let o = res.resultData.filter(item => {
                        return item.scenicSpotTypeId == this.info.scenicSpotTypeId;
                    });
                    o.length > 0 && (this.info.scenicSpotTypeName = o[0].scenicSpotTypeName);
                    this.info = Object.assign({}, this.info);
                }
            })
        },
        showInfo(idx) {
            let a = this.info.ticketsVOList[idx];
            this.form = Object.assign({}, a);
            this.openSel = true;
        },
        swiper() {
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: this.info.scenicSpotPicUrlList && this.info.scenicSpotPicUrlList.length > 1,
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        },
    },
    mounted() {
        this.id = this.$route.params.id;
        if (this.id) {
            this.getData();
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
    }
}
Vue.use(BottomSheet);
</script>

<style scoped lang="less">
#pageContainer {
    min-height: 100vh;
    background: #F8F8F8;
    padding-bottom: .4rem;
}
.top {
    padding: .1rem .16rem;
    background: linear-gradient(180deg, #0098AC 37%, #fff 20%);
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
    .info {
        padding: .25rem 0 .15rem;
        .name {
            font-size: .18rem;
            color: #222;
            margin-right: .06rem;
            font-weight: bold;
        }
        .type {
            padding: 4px 6px;
            border: 1px solid #0098AC;
            border-radius: 3px;
            font-size: .12rem;
            color: #0098AC;
            line-height: 1;
            transform: scale(.8);
        }
        .addr {
            font-size: .13rem;
            color: #666;
            line-height: 1.5;
            margin-top: .1rem;
            img {
                width: .16rem;
                height: .16rem;
                transform: translateY(2px);
            }
        }
        .state {
            font-size: .13rem;
            color: #666;
            margin-top: .1rem;
            .tag {
                font-size: .12rem;
                color: #2C700B;
                background: #EAF7EB;
                border-radius: 3px;
                padding: 3px 6px;
                transform: scale(.8) translateX(-10%);
                letter-spacing: 1px;
            }
        }
        .nav {
            display: block;
            width: .76rem;
            height: .3rem;
            line-height: .3rem;
            text-align: center;
            background: #0098AC;
            border-radius: .03rem;
            font-size: .13rem;
            color: #fff;
        }
    }
}
.mid {
    padding: .25rem .16rem;
    margin-top: .12rem;
    background: #fff;
    .title {
        font-size: .17rem;
        color: #222;
        font-weight: bold;
        position: relative;
        padding-left: .1rem;
        line-height: 1;
        margin-bottom: .12rem;
        &::before {
            content: '';
            display: inline-block;
            width: 3px;
            height: .18rem;
            background: #0699AC;
            position: absolute;
            top: 0;
            left: 0;
            vertical-align: top;
        }
    }
    .ticket {
        .all {
            font-size: .13rem;
            color: #0098AC;
            line-height: 1.5;
        }
        .list {
            overflow: hidden;
        }
        .item {
            margin-top: .16rem;
            padding: .15rem .16rem; 
            background: #F8F8F8;
            border-radius: .03rem;
            line-height: 1;
            .name {
                font-size: .17rem;
                color: #222;
                margin-right: 5px;
                max-width: 75%;
                line-height: 1.2;
            }
            .tag {
                display: inline-block;
                min-width: 40px;
                height: 21px;
                font-size: .12rem;
                color: #E66300;
                padding: 3px 6px;
                border: 1px solid #E66300;
                border-radius: 3px;
                transform: scale(.8);
            }
            .time {
                margin-top: .06rem;
                font-size: .11rem;
                color: #666;
                img {
                    width: .16rem;
                    height: .16rem;
                    transform: translateY(.5px);
                }
            }
            .xuzhi {
                margin-top: .06rem;
                img {
                    width: .16rem;
                    height: .16rem;
                    transform: translateY(.5px);
                }
                .a {
                    font-size: .11rem;
                    color: #2C700B;
                }
            }
            .price {
                font-size: .18rem;
                color: #FF5A5E;
                font-weight: bold;
                text-align: right;
                span {
                    font-size: .12rem;
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
                margin-top: .1rem;
            }
        }
    }
    .desc-box {
        margin-top: .25rem;
        padding-bottom: .25rem;
        img {
            max-width: 100%;
            width: 100%;
            height: auto;
            margin: .1rem 0;
        }
    }
}
.bot-s2 {
    border-radius: .2rem .2rem 0 0;
    .top1 {
        line-height: 1.5;
        padding: .15rem .2rem;
        text-align: center;
        font-size: .2rem;
        font-weight: bold;
        position: relative;
        .close {
            display: block;
            width: .5rem;
            height: .5rem;
            font-size: 0;
            background: url(/static/img/close.png) no-repeat;
            background-position: center center;
            background-size: .18rem .18rem;
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .con {
        margin-top: .1rem;
        padding: 0 .16rem .2rem;
        max-height: 400px;
        overflow-y: auto;
        .title {
            font-size: .16rem;
            color: #222;
            font-weight: bold;
            padding-left: .15rem;
            position: relative;
            line-height: 1;
            &::before {
                content: '';
                display: inline-block;
                width: 3px;
                height: .18rem;
                background: #0699AC;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        .txt {
            margin-top: .16rem;
            font-size: .14rem;
            color: #666;
            text-align: justify;
            line-height: 1.5;
        }
    }
    .btns {
        padding: .16rem;
        width: 100%;
        box-shadow: 0px -1px 0px 0px rgba(234,234,234,1);
        .btn {
            display: block;
            width: 100%;
            height: .44rem;
            line-height: .44rem;
            text-align: center;
            background: #0098AC;
            border-radius: .04rem;
            font-size: .16rem;
            color: #fff;
            font-weight: bold;
            letter-spacing: 1px;
        }
    }
}
</style>
<style>
.jd .swiper-pagination-bullet {
    width: .13rem;
    height: 3px;
    background: rgba(255, 255, 255, .6);
    border-radius: 3px;
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
}
.jd .swiper-pagination-bullet-active {
    width: .22rem;
    background: #fff;
}
</style>