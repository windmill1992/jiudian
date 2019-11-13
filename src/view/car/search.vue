<template>
    <div id="pageContainer" ref="container">
        <div class="top flex fcen">
            <div class="search-box flex fcen flex1">
                <img src="/static/img/search.png" alt="" />
                <input type="text" v-model="keywords" @input="search" ref="searchInp" class="inp" placeholder="搜索车辆" />
            </div>
            <a href="javascript:;" class="cancel" onclick="history.go(-1)">取消</a>
        </div>
        <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading1" @load="load">
            <div class="list" v-if="hasmore != 0">
                <router-link :to="'/pay/car?id=' + item.carId" class="item flex" v-for="item in list" :key="item.carId">
                    <div class="pic fshrink0" :style="'background-image: url(' + item.carUrl + ')'"></div>
                    <div class="info flex1 fcol spb">
                        <div class="flex1">
                            <p class="title">{{item.carType}}</p>
                            <div class="desc flex fcen">
                                <img src="../../assets/img/car/car-icon.png" alt="" />
                                <p>{{item.carBrieflyDesc}}</p>
                            </div>
                            <p class="txt">{{item.carMerchant}}</p>
                        </div>
                        <div class="price">
                            <span>¥</span>
                            <span class="num">{{item.price}}</span>
                            <span class="unit">/天</span>
                        </div>
                    </div>
                </router-link>
                <div class="no-more" v-if="hasmore == 1">没有更多数据了~</div>
            </div>
            <div class="nodata" v-else>未搜索到结果,请重试</div>
        </mu-load-more>
    </div>
</template>

<script>
import Vue from 'vue';
import { LoadMore } from 'muse-ui';
import { carList } from '../../api/car';
export default {
    data() {
        return {
            refreshing: false,
            loading1: false,
            keywords: '',
            list: [],
            hasmore: -1,
            pageIndex: 1,
            pageSize: 10,
            timer: null,
        }
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            carList({ pageIndex: this.pageIndex, pageSize: this.pageSize, keywords: this.keywords }).then(res => {
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
        search() {
            if (!this.keywords) return;
            const that = this;
            that.timer && clearTimeout(that.timer);
            that.timer = null;
            this.timer = setTimeout(() => {
                that.timer = null;
                that.pageIndex = 1;
                that.getData();
            }, 1500);
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
        keyEnter(e) {
            if (e.keyCode == 13) {
                this.pageIndex = 1;
                this.getData();
            }
        },
    },
    mounted() {
        const that = this;
        window.addEventListener('keypress', that.keyEnter, false);
        this.$refs['searchInp'].focus();
    },
    beforeDestroy() {
        const that = this;
        window.removeEventListener('keypress', that.keyEnter, false);
    },
}
Vue.use(LoadMore);
</script>

<style scoped lang="less">
.top {
    padding: .1rem .16rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: .55rem;
    background: #fff;
    z-index: 1;
    .search-box {
        width: 100%;
        height: .35rem;
        line-height: 1;
        font-size: .14rem;
        color: #666;
        border: 2px solid #EAEAEA;
        border-radius: .35rem;
        background: #F8F8F8;
        padding: 0 .16rem;
        margin-right: .1rem;
        img {
            width: .2rem;
            height: .2rem;
        }
        .inp {
            height: .2rem;
            line-height: .2rem;
            padding: 0 .1rem;
            color: #222;
            font-size: .14rem;
            border: none;
            outline: none;
            background: none;
        }
    }
    .cancel {
        font-size: .14rem;
        color: #666;
    }
}
.mu-load-more {
    margin-top: .55rem;
}
.list {
    padding: .1rem .16rem .6rem;
    .item {
        padding: .22rem 0;
        border-bottom: 1px solid #EAEAEA;
        line-height: 1;
        overflow: hidden;
        &:first-child {
            padding-top: 0;
        }
        .pic {
            width: 40%;
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
        .desc {
            font-size: .13rem;
            color: #666;
            margin-top: .08rem;
            img {
                width: .15rem;
                height: .15rem;
                margin-right: 3px;
            }
        }
        .txt {
            font-size: .12rem;
            color: #9c9c9c;
            margin-top: .08rem;
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
    padding-top: .3rem;
    font-size: .14rem;
    color: #666;
    text-align: center;
}
</style>