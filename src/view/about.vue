<template>
    <div id="pageContainer">
        <div class="top">
            <div class="box flex fcen spb">
                <a href="javascript:;" class="title">酒店联盟平台</a>
                <div>
                    <router-link to="/" class="nav">业务介绍</router-link>
                    <a href="javascript:;" class="nav on">关于我们</a>
                </div>
            </div>
        </div>
        <div class="container-pc">
            <div class="wrap">
                <p class="name">关于我们</p>
                <p class="con">酒店联盟是以微信公众号和小程序的形式存在的，依托在拥有11亿用户量的微信平台之上，为每个酒店量身打造的微信公众号和小程序。我们以新颖大气的版面，丰富实用的功能，专业独到的运营，帮助你实现100%的会员转化捆绑不仅可以提升酒店的品牌效应，树立高大的品牌形象，还可扩宽你的营销渠道让你走上无成本无佣金的营销之路。</p>
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
    .con {
        font-size: 28px;
        color: #fff;
        letter-spacing: 1px;
        margin-top: 8px;
        line-height: 48px;
        max-width: 1000px;
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