<template>
    <div id="pageContainer">
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
            <div class="box">
                <div class="tabs flex">
                    <a href="javascript:;" class="tab" :class="{on: tab == 0}" @click="changeTab(0)">{{notHotel ? '产品介绍' : '酒店介绍'}}</a>
                    <a href="javascript:;" class="tab" :class="{on: tab == 1}" @click="changeTab(1)">{{notHotel ? '预订须知' : '入住须知'}}</a>
                    <a href="javascript:;" class="tab" :class="{on: tab == 2}" @click="changeTab(2)">{{notHotel ? '配套设施' : '酒店设施'}}</a>
                    <span class="ln" :class="{r1: tab == 1, r2: tab == 2}"></span>
                </div>
                <div class="list" v-show="tab == 0">
                    <div v-html="info.hotelDesc" v-if="info.hotelDesc"></div>
                    <div class="def" v-else>暂无{{notHotel ? '产品介绍' : '酒店介绍'}}</div>
                </div>
                <div class="list" v-show="tab == 1">
                    <div v-html="info.notice" v-if="info.notice"></div>
                    <div class="def" v-else>暂无{{notHotel ? '预订须知' : '入住须知'}}</div>
                </div>
                <div class="list flex fwrap" v-show="tab == 2">
                    <template v-if="info.hotelFacilityList.length > 0">
                        <div class="item flex fcen" v-for="(item,index) in info.hotelFacilityList" :key="'hf' + index">
                            <img :src="item.hotelFacilityCover" alt="" />
                            <p>{{item.hotelFacilityName}}</p>
                        </div>
                    </template>
                    <div class="def" v-else>暂无{{notHotel ? '配套设施' : '酒店设施'}}</div>
                </div>
            </div>
        </template>
        <div class="nodata fcol fcen spc" v-else>未查询到数据，请检查参数或网络情况</div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import { hotelInfo } from '../../api/hotel';
import { setTitle } from '../../utils/setTitle';
import Swiper from 'swiper';
export default {
    data() {
        return {
            info: {},
            tab: 0,
            id: '',
            hasData: false,
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
                    setTitle(res.resultData.hotelName);
                    this.hasData = true;

                    if (res.resultData.hotelName.indexOf('酒店') == -1) {
                        this.notHotel = true;
                    } else {
                        this.notHotel = false;
                    }
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
        changeTab(t) {
            if (t == this.tab) return;
            this.tab = t;
        },
        swiper() {
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: true,
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
</script>

<style scoped lang="less">
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
.box {
    min-height: 50vh;
    padding: .2rem .16rem;
    .tabs {
        position: relative;
        line-height: 1.5;
    }
    .tab {
        font-size: .15rem;
        color: #222;
        margin-right: .35rem;
        position: relative;
        z-index: 2;
        &.on {
            font-weight: bold;
            color: #323232;
        }
    }
    .ln {
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 51px;
        height: 9px;
        background: linear-gradient(90deg,rgba(0,152,172,1) 0%,rgba(235,253,255,1) 100%);
        -webkit-transition: all .2s linear;
        transition: all .2s linear;
        &.r1 {
            left: .95rem;
        }
        &.r2 {
            left: 1.9rem;
        }
    }
    .list {
        overflow: hidden;
        padding-top: .15rem;
    }
    .item {
        font-size: .14rem;
        color: #222;
        margin-bottom: .15rem;
        margin-right: .2rem;
        img {
            width: auto;
            height: .4rem;
            margin-right: 5px;
        }
    }
    .def {
        font-size: .14rem;
        color: #9c9c9c;
        text-align: center;
        margin-top: 1rem;
    }
}
.nodata {
    height: 100vh;
    font-size: .14rem;
    color: #9c9c9c;
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