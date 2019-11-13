<template>
    <div id="pageContainer" ref="container">
        <div class="container-pos">
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading1" @load="load">
                <div class="list" v-if="hasmore != 0">
                    <router-link :to="'/orders/hotel?id=' + item.hotelOrderId" class="item" v-for="item in list" :key="item.hotelOrderId">
                        <div class="top flex spb">
                            <p class="title">{{item.hotelName}}</p>
                            <p class="state">{{stateArr[item.orderStatus]}}</p>
                        </div>
                        <div class="room">{{item.hotelRoomName}}</div>
                        <div class="other flex spb fcen">
                            <div class="flex fcen">
                                <p>{{item.startTime | fmt}}</p>
                                <template v-if="!notHotel">
                                    <img src="/static/img/jiantou.png" alt="" />
                                    <p>{{item.endTime | fmt}}</p>
                                    <span class="tag">共{{item.hotelRoomCount}}晚</span>
                                </template>
                            </div>
                            <div class="price flex fend">
                                <span>¥</span>
                                <span class="num">{{item.totalCharge}}</span>
                            </div>
                        </div>
                    </router-link>
                    <div class="no-more" v-if="hasmore == 1">没有更多数据了~</div>
                </div>
                <div class="nodata fcol fcen spc" v-else>暂无订单数据~</div>
            </mu-load-more>
        </div>
        <div class="menus flex">
            <router-link :to="'/hotel/' + id" class="menu fcol fcen spc">
                <img src="../../assets/img/hotel/hotel1.png" alt="" />
                <span>预订</span>
            </router-link>
            <Kefu></Kefu>
            <a href="javascript:;" class="menu fcol fcen spc on">
                <img src="../../assets/img/hotel/order2.png" alt="" />
                <span>订单</span>
            </a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Kefu from '../../components/Kefu.vue';
import { LoadMore } from 'muse-ui';
import { hotelOrderList } from '../../api/hotel';
import moment from 'moment';
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
            stateArr: ['未支付', '已支付', '已完成', '已取消', '已退款', '待确认', '已确认', '待退款', '待取消', '已过期'],
            id: '',
            notHotel: false,
        }
    },
    filters: {
        fmt(t) {
            if (!t) return '/';
            return moment(t).format('MM-DD');
        },
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            hotelOrderList({ pageIndex: this.pageIndex, pageSize: this.pageSize }).then(res => {
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
        this.id = this.$route.params.id;
        if (this.id) {
            this.getData();
            this.notHotel = localStorage.getItem('notHotel') == 1;
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
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
        .room {
            font-size: .14rem;
            color: #666;
            margin-top: .1rem;
        }
        .other {
            font-size: .14rem;
            color: #666;
            margin-top: .1rem;
            img {
                height: 2px;
                width: auto;
                margin: 0 4px;
            }
        }
        .tag {
            margin-left: .05rem;
            background: #E6F5F7;
            padding: 1px 5px;
            display: inline-block;
            line-height: .16rem;
            font-size: .12rem;
            color: #666;
            transform: scale(.8);
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