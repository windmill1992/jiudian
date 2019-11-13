<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box flex fcen spb">
                <a href="javascript:;" class="title">酒店联盟平台</a>
                <div>
                    <a href="javascript:;" class="nav on">业务介绍</a>
                    <router-link to="/about" class="nav">关于我们</router-link>
                </div>
            </div>
        </div>
        <div class="container-pc">
            <div class="wrap flex fcen spb">
                <div>
                    <p class="name">酒店联盟平台</p>
                    <p class="slogan">一站式酒店及周边业务管理平台</p>
                </div>
                <img src="/static/img/index-mobile.png" alt="" class="mobile" />
            </div>
            <div class="txt">
                <span>海南聚洋网络科技有限公司</span>
                <span>琼ICP备19003924号</span>
                <span>+8619876808555</span>
                <span>三亚市天涯区机场路海航城E栋东区商铺2号</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    mounted() {
        $('html, body').addClass('jykj');
    },
    beforeDestroy() {
        $('html, body').removeClass('jykj');
    },
}
</script>

<style scoped lang="less">
.w1200 {
    width: 1200px;
    margin: 0 auto;
}
#pageContainer {
    width: 100%;
    min-width: 1200px;
    min-height: 800px;
    background: url(/static/img/index-bg.png) no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
}
.top {
    height: 96px;
    border-bottom: 1px solid rgba(255, 255, 255, .3);
    .box {
        height: 96px;
        width: 1200px;
        margin: 0 auto;
        font-size: 21px;
        font-weight: bold;
        letter-spacing: .5px;
        .title {
            color: #fff;
        }
    }
    .nav {
        font-size: 17px;
        color: #fff;
        display: inline-block;
        margin-left: 40px;
        &.on {
            color: #0098AC;
        }
        &:hover {
            color: #0098AC;
        }
    }
}
.container-pc {
    width: 1200px;
    margin: 0 auto;
    min-height: 750px;
    .wrap {
        padding: 60px 0;
        position: relative;
        height: 100%;
    }
    .name {
        font-size: 64px;
        color: #fff;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 90px;
    }
    .slogan {
        font-size: 32px;
        color: #fff;
        letter-spacing: 1px;
        margin-top: 8px;
        line-height: 45px;
    }
    .mobile {
        height: 500px;
        width: auto;
        vertical-align: top;
    }
    .txt {
        font-size: 17px;
        color: #fff;
        text-align: center;
        margin-top: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 30px 0 35px;
        span {
            display: inline-block;
            margin-right: 40px;
        }
        &::before {
            content: '';
            display: inline-block;
            width: 100%;
            height: 1px;
            background: rgba(255, 255, 255, .3);
            transform: scaleY(.5);
            position: absolute;
            top: 0;
            left: 0;
        }
    }
}
</style>
<style>
.jykj {
    max-width: none;
    font-size: 14px!important;
}
.jykj #app {
    overflow: auto;
}
.jykj #app::-webkit-scrollbar {
    display: block;
}
</style>