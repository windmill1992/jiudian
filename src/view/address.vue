<template>
    <div id="pageContainer">
        <div class="container-pos">
            <div class="form">
                <div class="item">
                    <input type="text" v-model="form.userName" class="inp" :maxlength="20" placeholder="请输入姓名" />
                </div>
                <div class="item">
                    <input type="text" v-model="form.mobile" class="inp" :maxlength="11" placeholder="请输入手机号" />
                </div>
                <div class="item">
                    <a href="javascript:;" class="inp no" id="city" v-if="!address">请选择省市区</a>
                    <a href="javascript:;" class="inp" id="city" v-else>{{address}}</a>
                </div>
                <div class="item">
                    <input type="text" v-model="form.address" class="inp" :maxlength="30" placeholder="请填写详细地址" />
                </div>
            </div>
        </div>
        <div class="bot">
            <a href="javascript:;" class="btn" @click="submit" v-loading="loading" data-mu-loading-text="" data-mu-loading-size="24">保存地址</a>
        </div>
        <div id="cityContainer"></div>
    </div>
</template>

<script>
import { saveAddr, userAddr } from '../api/api';
import { cityArr} from '../utils/cities';
import MultiPicker from 'mob-multi-picker';
export default {
    data() {
        return {
            form: {},
            openSel: false,
            loading: false,
            address: '',
            addrInfo: {},
            screenHeight: '',
        }
    },
    methods: {
        getUserAddr() {
            userAddr().then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    let r = res.resultData;
                    this.form = {
                        userName: r.userName,
                        mobile: r.mobile,
                        address: r.address,
                    };
                    this.address = r.province + ' ' + r.city + ' ' + r.area;
                } else {
                    this.form = {};
                }
            })
            .catch(err => {
                console.error(err);
                this.addrInfo = {};
            });
        },
        submit() {
            if (this.loading || !this.valid()) return;
            this.loading = true;
            let arr = this.address.split(' ');
            this.form.province = arr[0];
            this.form.city = arr[1];
            this.form.area = arr[2] ? arr[2] : '';
            saveAddr(this.form).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.$toast.success('保存成功');
                    this.$router.back(-1);
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('服务器开了小差，请稍后再试');
                    }
                }
            })
            .catch(err => {
                console.error(err);
                this.loading = false;
                this.$toast.error('未知异常');
            })
        },
        valid() {
            if (!this.form.userName) {
                this.$toast.error('请输入姓名');
                return false;
            }
            if (!this.form.mobile || !this.$util.telValidate(this.form.mobile)) {
                this.$toast.error('请输入正确的手机号');
                return false;
            }
            if (!this.form.address) {
                this.$toast.error('请选择省市区');
                return false;
            }
            return true;
        },
    },
    mounted() {
        const that = this;
        this.edit = this.$route.query.edit == 1;
        if (this.edit) {
            this.getUserAddr();
        }
        this.$nextTick(() => {
            new MultiPicker({
                input: 'city',
                container: 'cityContainer',
                jsonData: cityArr,
                success: arr => {
                    that.address = '';
                    let arr1 = [];
                    for (let v of arr) {
                        arr1.push(v.value);
                    }
                    that.address = arr1.join(' ');
                }
            })
        });
        this.screenHeight = document.documentElement.clientHeight;
    },
    updated () {
        let that = this;
        if (this.$util.isWx() && this.$util.isIos()) {
            this.$nextTick(function () {
                let $inputs = Array.from(document.getElementsByTagName('input'));
                let body = document.body;
                $inputs.forEach(item => {
                    item.onblur = function () { // onblur是核心方法
                        window.scroll(0, 0);
                        window.innerHeight = window.outerHeight = that.screenHeight;
                    }
                })
            })

        }
    },
}
</script>

<style lang="less" scoped>
.container-pos {
    overflow: hidden;
    background: #f8f8f8;
}
.form {
    padding-left: .16rem;
    padding-bottom: .3rem;
    background: #fff;
    .item {
        padding: .2rem .16rem .2rem 0;
        border-bottom: 1px solid #eaeaea;
        .inp {
            font-size: .14rem;
            color: #222;
            border: none;
            outline: none;
            width: 100%;
            display: inline-block;
            &.no {
                color: #c6c6c6;
            }
        }
    }
}
.bot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .76rem;
    background: #fff;
    padding: .16rem;
    z-index: 2;
    .btn {
        display: block;
        width: 100%;
        height: .44rem;
        line-height: .44rem;
        text-align: center;
        background: #0098AC;
        border-radius: .04rem;
        font-size: .16rem;
        color: #fff;
        font-weight: bold;
        letter-spacing: 1px;
    }
}
</style>