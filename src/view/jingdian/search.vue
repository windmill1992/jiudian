<template>
    <div id="pageContainer" ref="container">
        <div class="top flex fcen">
            <div class="search-box flex fcen flex1">
                <img src="/static/img/search.png" alt="" />
                <input type="text" v-model="keywords" @input="search" ref="searchInp" class="inp" placeholder="搜索景点" />
            </div>
            <a href="javascript:;" class="cancel" onclick="history.go(-1)">取消</a>
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
            <div class="nodata" v-else>未搜索到结果,请重试</div>
        </mu-load-more>
    </div>
</template>

<script>
import Vue from 'vue';
import { LoadMore } from 'muse-ui';
import { jdList } from '../../api/jingdian';
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
            jdList({ pageIndex: this.pageIndex, pageSize: this.pageSize, keywords: this.keywords }).then(res => {
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
    padding-top: .3rem;
    font-size: .14rem;
    color: #666;
    text-align: center;
}
</style>