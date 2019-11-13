<template>
    <a href="javascript:;" class="menu fcol fcen spc" @click="$store.commit('setKfShow', true);">
        <img src="/static/img/kefu.png" alt="" />
        <span>客服</span>
        <div class="dialog" v-show="this.$store.state.kefuShow">
            <div class="mask"></div>
            <div class="con">
                <div class="times">
                    <p class="bold">客服时间</p>
                    <p>{{this.$store.state.kefuInfo.serviceTime}}</p>
                </div>
                <div class="box">
                    <div class="tel flex fcen spb">
                        <div>
                            <p class="bold">电话客服</p>
                            <p>{{this.$store.state.kefuInfo.mobile}}</p>
                        </div>
                        <a :href="'tel:' + this.$store.state.kefuInfo.mobile" class="call">拨打热线</a>
                    </div>
                    <div class="qr">
                        <img :src="this.$store.state.kefuInfo.wxQrcode" alt="" />
                        <p>长按识别二维码添加客服</p>
                    </div>
                </div>
                <div class="close" @click.stop="$store.commit('setKfShow', false);"></div>
            </div>
        </div>
    </a>
</template>

<script>

export default {
    props: {},
}
</script>

<style lang="less" scoped>
.menu {
    img {
        height: .23rem;
        width: .23rem;
        margin-bottom: 2px;
    }
}
.dialog, .dialog .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9998;
}
.dialog .mask {
    background: rgba(0, 0, 0, .7);
}
.dialog .con {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 9999;
    .times {
        height: .8rem;
        padding: .15rem .2rem;
        font-size: .15rem;
        color: #fff;
        line-height: 1.5;
        background: #0098AC;
        text-align: left;
        border-radius: .2rem .2rem 0 0;
    }
    .box {
        background: #fff;
        line-height: 1.5;
        border-radius: 0 0 .2rem .2rem;
        .tel {
            padding: .15rem .2rem;
            border-bottom: 1px solid rgba(40, 324, 295, .1);
            font-size: .15rem;
            color: #222;
            text-align: left;
        }
        .call {
            width: .72rem;
            height: 30px;
            line-height: 28px;
            border: 1px solid #0098AC;
            border-radius: 4px;
            font-size: .15rem;
            color: #0098AC;
            text-align: center;
        }
        .qr {
            padding: .15rem 0;
            text-align: center;
            font-size: .13rem;
            color: #222;
            img {
                width: 1.1rem;
                height: 1.1rem;
                margin-bottom: .1rem;
                display: inline-block;
            }
        }
    }
    .close {
        position: absolute;
        left: 50%;
        bottom: -.4rem;
        width: .2rem;
        height: .2rem;
        transform: translate3d(-50%, 0, 0);
        z-index: 9999;
        background: url(/static/img/close1.png) no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        cursor: pointer;
    }
}

</style>