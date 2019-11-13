<template>
    <div id="pageContainer">
        <div class="box fcol fcen">
            <img src="/static/img/success.png" alt="" />
            <p class="txt">支付成功</p>
            <p class="txt1">如有疑问请咨询商家</p>
            <div class="btns">
                <a href="javascript:;" class="btn btn1" @click="detail">订单详情</a>
                <a href="javascript:;" class="btn" @click="openSel = true;" v-if="type != 'specialty'">电话咨询</a>
            </div>
        </div>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s2" :overlay="false">
            <a :href="'tel:' + kefu" class="item" v-if="type != 'hotel'">{{kefu}}</a>
            <a :href="'tel:' + hotelTel" class="item" v-else>{{hotelTel}}</a>
            <a href="javascript:;" class="item no" @click="openSel = false;">取消</a>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import { BottomSheet } from 'muse-ui';
import { hotelInfo } from '../api/hotel';
import { kefuTel } from '../api/api';
export default {
    data() {
        return {
            info: {},
            openSel: false,
            type: '',
            hotelTel: '',
            kefu: '',
        }
    },
    methods: {
        getData() {
            this.loading = this.$loading();
            hotelInfo({ orderId: this.id }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.info = res.resultData;
                } else if (res.resultCode == 4002){
                    localStorage.removeItem('uid');
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
        getKefuTel() {
            kefuTel().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.kefu = res.resultData.mobile;
                }
            })
        },
        detail() {
            this.$router.push(`/orders/${this.type}?id=${this.id}`);
        },
    },
    mounted() {
        this.type = this.$route.params.type;
        this.id = this.$route.params.id;
        if (this.type && this.id) {
            this.hotelTel = localStorage.getItem('hotelTel');
            this.getKefuTel();
        } else {
            this.$toast.error('参数错误');
            this.$router.replace('/404');
        }
    }
}
Vue.use(BottomSheet);
</script>

<style scoped lang="less">
.box {
    padding: .2rem .15rem;
    img {
        width: .65rem;
        height: .65rem;
        vertical-align: top;
        margin-bottom: .25rem;
    }
    .txt {
        font-size: .2rem;
        color: #222;
    }
    .txt1 {
        font-size: .14rem;
        color: #9c9c9c;
        margin-top: 10px;
    }
    .btns {
        width: 100%;
        margin-top: .25rem;
    }
    .btn {
        display: block;
        width: 100%;
        height: .44rem;
        line-height: .42rem;
        text-align: center;
        border: 1px solid #0098AC;
        font-size: .16rem;
        color: #0098AC;
        border-radius: .44rem;
        font-weight: bold;
        letter-spacing: 1px;
        &.btn1 {
            background: #0098AC;
            color: #fff;
            margin-bottom: .16rem;
        }
        &:active {
            background: rgba(0, 0, 0, .05);
        }
    }
}
.bot-s2 {
    .item {
        display: block;
        height: .44rem;
        line-height: .44rem;
        text-align: center;
        font-size: .16rem;
        color: #0098AC;
        &.no {
            color: #9c9c9c;
            border-top: 1px solid #eaeaea;
        }
    }
}
</style>