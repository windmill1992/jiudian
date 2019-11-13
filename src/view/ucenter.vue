<template>
    <div id="pageContainer">
        <div class="top flex fcen">
            <p class="bold">{{userName}}</p>
            <a href="javascript:;" class="edit" @click="openSel = true;"></a>
        </div>
        <div class="mid">
            <router-link :to="'/orders/hotelOrders/'+ id" class="nav flex fcen spb">
                <p>酒店订单</p>
                <img src="/static/img/arr1.png" alt="" />
            </router-link>
            <router-link to="/orders/carOrders" class="nav flex fcen spb">
                <p>租车订单</p>
                <img src="/static/img/arr1.png" alt="" />
            </router-link>
            <router-link to="/orders/ticketOrders" class="nav flex fcen spb">
                <p>门票订单</p>
                <img src="/static/img/arr1.png" alt="" />
            </router-link>
            <router-link to="/orders/specialtyOrders" class="nav flex fcen spb">
                <p>特产订单</p>
                <img src="/static/img/arr1.png" alt="" />
            </router-link>
            <a href="javascript:;" class="logout" @click="logout">退出登录</a>
        </div>
        <a href="javascript:;" class="nav-index" @click="toIndex">回到首页</a>
        <mu-bottom-sheet :open.sync="openSel" class="bot-s" :overlay="false">
            <div class="top1">
                <div class="flex spb fcen">
                    <a href="javascript:;" class="close" @click="openSel = false;"></a>
                    <a href="javascript:;" class="save" @click="save">保存</a>
                </div>
                <div class="inp-box">
                    <input type="text" v-model="nick" @input="getCount" :maxlength="12" class="inp" placeholder="请输入昵称" />
                </div>
                <p class="txt">{{count}}/12</p>
            </div>
        </mu-bottom-sheet>
        <a href="javascript:;" class="overlay" v-show="openSel" @click="openSel = false;"></a>
    </div>
</template>

<script>
import Vue from 'vue';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import { BottomSheet, Dialog } from 'muse-ui';
import { saveUser } from '../api/api';
export default {
    data() {
        return {
            userName: '',
            openSel: false,
            nick: '',
            count: 0,
            id: '',
        }
    },
    methods: {
        save() {
            if (this.nick) {
                saveUser({ userName: this.nick }).then(res => {
                    if (res.resultCode == 200 && res.resultData) {
                        this.$toast.success('保存成功');
                        this.openSel = false;
                        this.userName = this.nick;
                        this.$Cookies.set('uname', this.nick, { expires: 7 });
                    } else {
                        if (res.resultMsg) {
                            this.$toast.error(res.resultMsg);
                        } else {
                            this.$toast.error('网络异常，请稍后再试！');
                        }
                    }
                })
            } else {
                this.$toast.error('请填写昵称！');
            }
        },
        getCount() {
            this.count = this.nick.length;
        },
        logout() {
            const that = this;
            this.$confirm('确定要退出登录吗？', '提示', {
                type: 'warning'
            }).then(({ result }) => {
                if (result) {
                    that.$Cookies.remove('uid');
                    that.$router.push('/login?from='+ encodeURIComponent(that.$route.fullPath));
                }
            });
        },
        toIndex() {
            this.$router.replace('/home?id=' + this.id);
        },
    },
    mounted() {
        let uid = this.$Cookies.get('uid');
        let uname = this.$Cookies.get('uname');
        let mobile = this.$Cookies.get('mobile');
        this.id = localStorage.getItem('hotelId');
        if (uid) {
            this.uid = uid;
            this.userName = uname || mobile || '用户';
        } else {
            this.$router.push('/login?from='+ encodeURIComponent(this.$route.fullPath));
        }
    },
}
Vue.use(BottomSheet);
Vue.use(Message);
Vue.use(Dialog);
</script>

<style lang="less" scoped>
.top {
    padding: .4rem .25rem;
    font-size: .23rem;
    color: #222;
    .edit {
        width: .2rem;
        height: .2rem;
        background: url(/static/img/edit.png) no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        margin-left: .05rem;
    }
}
.mid {
    padding: .4rem .25rem;
    .nav {
        padding: .2rem 0;
        line-height: 1;
        font-size: .16rem;
        color: #222;
        box-shadow: 0px 1px 0px 0px rgba(238,238,238,1);
        img {
            width: .2rem;
            height: .2rem;
        }
    }
    .logout {
        font-size: .16rem;
        color: #0098AC;
        margin-top: .22rem;
        display: block;
    }
}
.bot-s {
    border-radius: .2rem .2rem 0 0;
    width: 100%;
    .top1 {
        padding: .2rem .16rem;
    }
    .close {
        width: .16rem;
        height: .16rem;
        background: url(/static/img/close.png) no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
    }
    .save {
        font-size: .16rem;
        color: #0098AC;
        font-weight: bold;
    }
    .inp-box {
        margin-top: .15rem;
        padding: .12rem 0;
        text-align: center;
        border-bottom: 1px solid #eaeaea;
    }
    .inp {
        width: 100%;
        text-align: center;
        font-size: .15rem;
        color: #222;
        font-weight: bold;
        border: none;
        outline: none;
    }
    .txt {
        font-size: .13rem;
        color: #C6C6C6;
        text-align: right;
        margin-top: .05rem;
    }
}
.nav-index {
    display: block;
    position: fixed;
    right: .16rem;
    bottom: .2rem;
    width: .5rem;
    height: .5rem;
    line-height: 1.2;
    padding: .11rem .08rem;
    text-align: center;
    word-break: break-all;
    font-size: .12rem;
    color: #fff;
    background: #0098AC;
    border-radius: .5rem;
}
</style>