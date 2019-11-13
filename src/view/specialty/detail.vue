<template>
    <div id="pageContainer">
        <div class="container-pos">
            <div class="top">
                <div class="swiper-container tc">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in info.picUrlList" :key="'img' + index">
                            <img :src="item" />
                        </div>
                    </div>
                    <div class="swiper-pagination tc"></div>
                </div>
                <div class="info">
                    <p class="name">{{info.specialtyName}}</p>
                    <div class="price">
                        <span>¥</span>
                        <span class="num">{{info.price}}</span>
                        <span class="unit">/件</span>
                    </div>
                    <div class="data flex">
                        <!-- <div class="flex fcen" style="margin-right: .4rem;">
                            <img src="../../assets/img/tc/salesnum.png" alt="" />
                            <p>销量： {{info.stock}}件</p>
                        </div> -->
                        <div class="flex fcen">
                            <img src="../../assets/img/tc/stock.png" alt="" />
                            <p>库存： {{info.stock}}件</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mid">
                <div class="desc-box">
                    <p class="title">商品详情</p>
                    <div class="con" v-html="info.specialtyDesc"></div>
                </div>
                <div class="xuzhi">
                    <p class="title">购买须知</p>
                    <div v-html="xuzhi"></div>
                </div>
            </div>
        </div>
        <div class="bot">
            <router-link :to="'/pay/specialty?id='+ id" class="nav">立即购买</router-link>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css';
import { specialtyInfo } from '../../api/specialty';
import { explainInfo } from '../../api/api';
import { setTitle } from '../../utils/setTitle';
import Swiper from 'swiper';
export default {
    data() {
        return {
            info: {},
            xuzhi: '',
            id: '',
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '00:00';
            return t.split(' ')[1].substr(0, 5);
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            specialtyInfo({ specialtyId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    setTitle(res.resultData.specialtyName);
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
        getXuzhi() {
            explainInfo({ refId: this.id, refType: 3 }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.xuzhi = res.resultData.content;
                }
            })
        },
        swiper() {
            let swiper = new Swiper('.swiper-container', {
                autoplay: true,
                loop: this.info.picUrlList && this.info.picUrlList.length > 1,
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        },
    },
    mounted() {
        this.id = this.$route.params.id;
        if(this.id){
            this.getData();
            this.getXuzhi();
        }else{
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
    }
}
</script>

<style scoped lang="less">
.container-pos {
    background: #F8F8F8;
    padding-bottom: .9rem;
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
        padding: .25rem 0;
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
        .data {
            font-size: .13rem;
            color: #666;
            margin-top: .1rem;
            img {
                width: .15rem;
                height: .15rem;
            }
        }
    }
}
.mid {
    padding: .25rem .16rem;
    margin-top: .12rem;
    background: #fff;
    .title {
        font-size: .18rem;
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
    .desc-box {
        padding-bottom: .25rem;
        color: #666;
        img {
            max-width: 100%;
            width: 100%;
            height: auto;
            margin: .1rem 0;
        }
    }
    .xuzhi {
        font-size: .14rem;
        padding: .1rem 0;
        color: #666;
    }
}
.bot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .76rem;
    background: #fff;
    padding: .16rem;
    z-index: 2;
    box-shadow: 0px -1px 0px 0px rgba(234,234,234,1);
    .nav {
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
</style>
<style>
.tc .swiper-pagination-bullet {
    width: .13rem;
    height: 3px;
    background: rgba(255, 255, 255, .6);
    border-radius: 3px;
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
}
.tc .swiper-pagination-bullet-active {
    width: .22rem;
    background: #fff;
}
</style>