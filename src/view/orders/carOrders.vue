<template>
    <div id="pageContainer" ref="container">
        <div class="container-pos">
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading1" @load="load">
                <div class="list" v-if="hasmore != 0">
                    <router-link :to="'/orders/car?id=' + item.carOrder.carOrderId" class="item" v-for="(item,index) in list" :key="'car' + index">
                        <div class="top flex spb">
                            <p class="title">{{item.car ? item.car.carType : ''}}</p>
                            <p class="state">{{stateArr[item.carOrder.orderStatus]}}</p>
                        </div>
                        <div class="time flex fcen">
                            <span>{{item.carOrder.startTime | fmt}}</span>
                            <span style="padding: 0 5px;"> - </span>
                            <span>{{item.carOrder.endTime | fmt}}</span>
                            <span style="padding-left: 10px;">{{item.carOrder.endTime - item.carOrder.startTime | fmt1}}天</span>
                        </div>
                        <div class="desc flex fcen">
                            <img src="../../assets/img/car/car-icon.png" alt="" />
                            <p>{{item.car.carBrieflyDesc}}</p>
                        </div>
                        <div class="other flex spb fcen">
                            <p>{{item.car.carMerchant}}</p>
                            <div class="price flex fend">
                                <span>¥</span>
                                <span class="num">{{item.carOrder.totalCharge}}</span>
                            </div>
                        </div>
                    </router-link>
                    <div class="no-more" v-if="hasmore == 1">没有更多数据了~</div>
                </div>
                <div class="nodata fcol fcen spc" v-else>暂无订单数据~</div>
            </mu-load-more>
        </div>
        <div class="menus flex">
            <router-link to="/car" class="menu fcol fcen spc">
                <img src="../../assets/img/car/car1.png" alt="" />
                <span>租车</span>
            </router-link>
            <Kefu></Kefu>
            <a href="javascript:;" class="menu fcol fcen spc on">
                <img src="../../assets/img/car/order2.png" alt="" />
                <span>订单</span>
            </a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Kefu from '../../components/Kefu.vue';
import { LoadMore } from 'muse-ui';
import { carOrderList } from '../../api/car';
import moment from 'moment';
import Cookies from 'js-cookie';
export default {
    components: { Kefu },
    data() {
        return {
            refreshing: false,
            loading1: false,
            list: [],
            hasmore: 0,
            pageIndex: 1,
            pageSize: 10,
            id: '',
            stateArr: ['未支付', '已支付', '已完成', '已取消', '已退款', '待确认', '已确认', '待退款', '待退款', '已过期'],
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '/';
            return moment(t).format('MM月DD日 HH:mm');
        },
        fmt1(ts) {
            return Math.ceil(ts / 1000 / 3600 / 24);
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            carOrderList({ pageIndex: this.pageIndex, pageSize: this.pageSize }).then(res => {
                this.loading && this.loading.close();
                this.refreshing = false;
                this.loading1 = false;
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    if (this.pageIndex == 1) {
                        this.list = [];
                    }
                    r.list = r.list || [];
                    this.hasmore = r.total == 0 ? 0 : (r.hasNextPage ? 2 : 1);
                    this.list = [...this.list, ...r.list];
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
                this.refreshing = false;
                this.loading1 = false;
                this.$toast.error('未知异常！');
                console.log(err);
            })
        },
        refresh() {
            this.refreshing = true;
            this.$refs.container.scrollTop = 0;
            this.pageIndex = 1;
            this.getData();
        },
        load() {
            if (this.hasmore != 2) return;
            this.loading1 = true;
            this.pageIndex++;
            this.getData();
        },
    },
    mounted() {
        this.getData();
    }
}
Vue.use(LoadMore);
</script>

<style scoped lang="less">
.container-pos {
    padding-bottom: .6rem;
}
.list {
    padding: 0 .16rem .7rem;
    min-height: 80vh;
    .item {
        display: block;
        padding: .2rem 0;
        border-bottom: 1px solid #EAEAEA;
        line-height: 1;
        .title {
            font-size: .18rem;
            color: #222;
            font-weight: bold;
            max-width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .state {
            font-size: .14rem;
            color: #9c9c9c;
        }
        .time {
            font-size: .13rem;
            color: #666;
            margin-top: .1rem;
        }
        .desc {
            font-size: .14rem;
            color: #666;
            margin-top: .1rem;
            img {
                width: .16rem;
                height: .16rem;
                margin-right: 3px;
            }
        }
        .other {
            font-size: .12rem;
            color: #9C9C9C;
            margin-top: .1rem;
        }
        .price {
            font-size: .14rem;
            color: #FF5A5E;
            font-weight: bold;
            span:first-child {
                display: inline-block;
                line-height: 1.4;
            }
            .num {
                font-size: .18rem;
            }
        }
    }
}
.nodata {
    height: 100vh;
    font-size: .14rem;
    color: #999;
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