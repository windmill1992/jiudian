<template>
    <div id="pageContainer" ref="container">
        <div class="container-pos">
            <div class="top" v-if="hasmore != 0">
                <router-link to="/jingdian/search" class="search flex fcen spc">
                    <img src="/static/img/search.png" alt="" />
                    <p>搜索景点</p>
                </router-link>
            </div>
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading1" @load="load">
                <div class="list" v-if="hasmore != 0">
                    <router-link :to="'/jingdian/detail/' + item.scenicSpotId" class="item flex" v-for="item in list" :key="item.scenicSpotId">
                        <div class="pic fshrink0" :style="'background-image: url(' + item.scenicSpotCover + ')'"></div>
                        <div class="info flex1 fcol spb">
                            <div class="flex1">
                                <p class="title">{{item.scenicSpotName}}</p>
                                <p class="txt">{{item.scenicSpotTypeName}}</p>
                            </div>
                            <div class="price">
                                <span>¥</span>
                                <span class="num">{{item.price}}</span>
                                <span class="unit">起</span>
                            </div>
                        </div>
                    </router-link>
                    <div class="no-more" v-if="hasmore == 1">没有更多数据了~</div>
                </div>
                <div class="nodata fcol fcen spc" v-else>暂无景点数据~</div>
            </mu-load-more>
        </div>
        <div class="menus flex">
            <a href="javascript:;" class="menu fcol fcen spc on">
                <img src="../../assets/img/jd/jd2.png" alt="" />
                <span>景点</span>
            </a>
            <kefu></kefu>
            <router-link to="/orders/ticketOrders" class="menu fcol fcen spc">
                <img src="../../assets/img/jd/order1.png" alt="" />
                <span>订单</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Kefu from '../../components/Kefu.vue';
import { LoadMore } from 'muse-ui';
import { jdList } from '../../api/jingdian';
import { hotelInfo } from '../../api/hotel';
export default {
    components: { Kefu },
    data() {
        return {
            refreshing: false,
            loading1: false,
            list: [],
            hasmore: -1,
            pageIndex: 1,
            pageSize: 10,
        }
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            jdList({ pageIndex: this.pageIndex, pageSize: this.pageSize, keywords: '' }).then(res => {
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
        getHotelTel(id) {
            hotelInfo({ hotelId: id }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    localStorage.setItem('hotelTel', res.resultData.hotelTel);
                    localStorage.setItem('kfTel', res.resultData.serviceTel);
                }
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
        let id = this.$route.query.id;
        if (id) {
            this.getHotelTel(id);
        }
    }
}
Vue.use(LoadMore);
</script>

<style scoped lang="less">
.container-pos {
    padding-bottom: .6rem;
}
.top {
    padding: .2rem .16rem;
    .search {
        width: 100%;
        height: .35rem;
        line-height: 1;
        font-size: .14rem;
        color: #666;
        border: 2px solid #EAEAEA;
        border-radius: .35rem;
        background: #F8F8F8;
        img {
            width: .2rem;
            height: .2rem;
            margin-right: 8px;
        }
    }
}
.list {
    padding: 0 .16rem .6rem;
    // min-height: 100vh;
    .item {
        padding: .22rem 0;
        border-bottom: 1px solid #EAEAEA;
        line-height: 1;
        overflow: hidden;
        &:first-child {
            padding-top: 0;
        }
        .pic {
            width: .85rem;
            height: .85rem;
            background-color: #f8f8f8;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            margin-right: .1rem;
            border-radius: .03rem;
        }
        .title {
            font-size: .18rem;
            color: #222;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .txt {
            display: inline-block;
            font-size: .12rem;
            color: #0098AC;
            margin-top: .1rem;
            border: 1px solid #0098AC;
            border-radius: .03rem;
            padding: 4px 6px;
            line-height: 1;
            transform: scale(.8) translateX(-10%);
        }
        .price {
            font-size: .12rem;
            color: #FF5A5E;
            font-weight: bold;
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
    }
}
.nodata {
    height: 100vh;
    font-size: .14rem;
    color: #666;
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