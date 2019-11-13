<template>
    <div id="pageContainer">
        <div class="box fcol">
            <div class="pic flex1">
                <img :src="info.background" class="img" />
                <router-link to="/user" class="nav"></router-link>
                <!-- <div class="up fcol fcen spc">
                    <img src="/static/img/up.png" alt="" />
                    <p>上滑查看更多</p>
                </div> -->
            </div>
            <div class="links flex fcen spb">
                <router-link :to="'/hotel/' + id" class="link fcol fcen spc">
                    <img src="/static/img/hotel.png" alt="" />
                    <span>{{notHotel ? '产品预订' : '客房预订'}}</span> 
                </router-link>
                <router-link to="/car" class="link fcol fcen spc">
                    <img src="/static/img/car.png" alt="" />
                    <span>本地租车</span> 
                </router-link>
                <router-link to="/jingdian" class="link fcol fcen spc">
                    <img src="/static/img/ticket.png" alt="" />
                    <span>景点门票</span> 
                </router-link>
                <router-link to="/specialty" class="link fcol fcen spc">
                    <img src="/static/img/tc.png" alt="" />
                    <span>本地特产</span> 
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { hotelInfo } from '../api/hotel';
import { setTitle } from '../utils/setTitle';
export default {
    data() {
        return {
            id: '',
            info: {},
            notHotel: false,
        }
    },
    methods: {
        getData() {
            hotelInfo({ hotelId: this.id }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                    setTitle(res.resultData.hotelName);
                    localStorage.setItem('hotelTel', res.resultData.hotelTel);
                    localStorage.setItem('kfTel', res.resultData.serviceTel);
                    if (res.resultData.hotelName.indexOf('酒店') == -1) {
                        localStorage.setItem('notHotel', 1);
                        this.notHotel = true;
                    } else {
                        localStorage.removeItem('notHotel');
                        this.notHotel = false;
                    }
                } else {
                    $('#app').hide();
                    this.$util.showTips('加载失败，请稍后重试');
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('网络异常，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.$toast.error('网络异常，请稍后再试！');
            });
        },
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            localStorage.setItem('hotelId', this.id);
            this.getData();
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
    },
}
</script>

<style lang="less" scoped>
.box {
    height: 100vh;
    overflow: hidden;
    .pic {
        width: 100%;
        position: relative;
        .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .nav {
            display: block;
            width: .35rem;
            height: .35rem;
            background: url(/static/img/user.png) no-repeat;
            background-size: 100% 100%;
            background-position: 0 0;
            position: absolute;
            top: .14rem;
            right: .14rem;
            z-index: 2;
        }
        .up {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: .8rem;
            font-size: .12rem;
            color: #fff;
            z-index: 2;
            img {
                width: .25rem;
                height: .25rem;
                margin-bottom: .1rem;
                animation: slide 1s linear infinite;
            }
        }
    }
    .links {
        height: .8rem;
        background: rgba(255, 255, 255, .5);
        padding: 0 .15rem;
        .link {
            width: 25%;
            font-size: .12rem;
            color: #222;
            img {
                height: .25rem;
                width: auto;
                margin-bottom: 3px;
            }
        }
    }
}
@keyframes slide {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-.1rem);
    }
    100% {
        transform: translateY(0);
    }
}
</style>