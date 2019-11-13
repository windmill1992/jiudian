<template>
    <div id="pageContainer" class="login">
        <div class="form">
            <p class="title">手机号登录</p>
            <div class="form-item">
                <input type="number" v-model="mobile" class="inp" @input="valid" placeholder="输入手机号" />
                <a href="javascript:;" class="btn" @click="getCode" v-if="!loading1 && !loading2">获取验证码</a>
                <a href="javascript:;" class="btn" @click="getCode" v-if="!loading1 && loading2">重新获取</a>
                <a href="javascript:;" class="btn on" v-if="loading1">{{time}}s</a>
            </div>
            <div class="form-item">
                <input type="number" v-model="code" class="inp" @input="valid" placeholder="输入短信验证码" />
            </div>
            <a href="javascript:;" class="submit" :class="{no: !valided}" @click="login" v-loading="loading3" data-mu-loading-text="" data-mu-loading-size="24">立即登录</a>
        </div>
        <p class="txt">登录/注册即代表同意<a href="" class="prot">用户服务协议</a></p>
        <div class="other">
            <div class="txt1 flex fcen spc">
                <span class="ln"></span>
                <span class="txt2">快捷登录</span>
                <span class="ln"></span>
            </div>
            <a href="javascript:;" class="wx-login" @click="auth">
                <img src="/static/img/wx.png" alt="" />
                <span>微信登录</span>
            </a>
        </div>
    </div>
</template>

<script>
import { login, sendCode, wxlogin, wxAuth } from '../api/api';
export default {
    data() {
        return {
            mobile: '',
            code: '',
            loading1: false,
            loading2: false,
            loading3: false,
            valided: false,
            timer: null,
            time: 60,
            from: '',
        }
    },
    methods: {
        getCode() {
            if(!this.mobile || !this.$util.telValidate(this.mobile)){
                this.$toast.error('请输入正确的手机号！');
                return;
            }
            sendCode({ mobile: this.mobile }).then(res => {
                if (res.resultCode == 200 && res.resultData) {
                    this.$toast.success('验证码发送成功，请查收');
                    this.countdown();
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('发送失败，请重试！');
                    }
                }
            })
        },
        countdown() {
            this.time = 60;
            this.loading1 = true;
            this.timer = setInterval(() => {
                this.time--;
                if (this.time <= -1) {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.loading1 = false;
                    this.loading2 = true;
                }
            }, 1000);
        },
        login() {
            if (!this.valided || this.loading3) return;
            if (!this.mobile || !this.$util.telValidate(this.mobile)) {
                this.$toast.error('请输入正确的手机号！');
                return;
            }
            if (!this.code || this.code.length != 6) {
                this.$toast.error('请输入正确的验证码！');
                return;
            }
            this.loading = this.$loading({ text: '正在登录...' });
            this.loading3 = true;
            this.f = true;
            login({ mobile: this.mobile, captcha: this.code }).then(res => {
                this.loading && this.loading.close();
                this.loading3 = false;
                if (res.resultCode == 200 && res.resultData) {
                    this.$Cookies.set('uid', res.resultData.userId, { expires: 7 });
                    this.$Cookies.set('uname', res.resultData.userName, { expires: 7 });
                    this.$Cookies.set('mobile', res.resultData.mobile, { expires: 7 });
                    this.$toast.success('登录成功,正在跳转...');
                    if (this.from) {
                        // location.href = this.from;
                        location.replace(this.from);
                    } else {
                        history.go(-1);
                    }
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('服务器开了小差，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.loading3 = false;
                this.loading.close();
                this.$toast.error('未知异常！');
                console.log(err);
            });
        },
        auth() {
            let rurl = location.protocol + '//' + location.host + this.$route.fullPath;
            wxAuth(rurl);
        },
        wxlogin() {
            this.loading = this.$loading();
            wxlogin({ code: this.code }).then(res => {
                this.loading && this.loading.close();
                if (res.resultCode == 200 && res.resultData) {
                    this.$Cookies.set('uid', res.resultData.userId, { expires: 7 });
                    this.$Cookies.set('uname', res.resultData.userName, { expires: 7 });
                    this.$Cookies.set('mobile', res.resultData.mobile || '', { expires: 7 });
                    this.$toast.success('登录成功,正在跳转...');
                    if (this.from) {
                        location.replace(this.from);
                    } else {
                        history.go(-1);
                    }
                } else {
                    if (res.resultMsg) {
                        this.$toast.error(res.resultMsg);
                    } else {
                        this.$toast.error('网络异常，请稍后再试！');
                    }
                }
            })
            .catch(err => {
                this.loading.close();
                console.log(err);
            })
        },
        valid() {
            if (this.mobile && this.code) {
                this.valided = true;
            } else {
                this.valided = false;
            }
        },
        keyFn(e) {
            if (e.keyCode == 13) {
                this.login();
            }
        },
    },
    mounted() {
        this.from = decodeURIComponent(this.$route.query.from);
        document.body.addEventListener('keypress', this.keyFn, false);
        let code = this.$route.query.code;
        let uid = this.$Cookies.get('uid');
        if (!uid || uid == null || uid == 'null') {
            if (code) {
                this.code = code;
                let urls = '/login' + (this.from ? '?from=' + encodeURIComponent(this.from) : '');
                history.pushState(null, null, urls);
                this.wxlogin();
            }
        } else {
            this.$router.replace('/home?id=' + localStorage.getItem('hotelId'));
        }
    },
    beforeDestroy() {
        document.body.removeEventListener('keypress', this.keyFn, false);
    }
}
</script>

<style lang="less" scoped>
.form {
    padding: .5rem .25rem 0;
    .title {
        font-size: .23rem;
        color: #222;
        font-weight: bold;
    }
    .form-item {
        padding: .12rem 0;
        border-bottom: 1px solid #EAEAEA;
        line-height: 1;
        margin-top: .15rem;
        position: relative;
    }
    .inp {
        width: 100%;
        height: .2rem;
        line-height: .2rem;
        font-size: .14rem;
        color: #222;
        border: none;
        outline: none;
    }
    .btn {
        font-size: .14rem;
        color: #038488;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        &.on {
            color: #9C9C9C;
        }
    }
    .submit {
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
        margin-top: .3rem;
        &.no {
            background: #7FCCD6;
        }
    }
}
.txt {
    text-align: center;
    font-size: .12rem;
    color: #7E7E7E;
    margin-top: .12rem;
    .prot {
        color: #0098AC;
    }
}
.other {
    position: absolute;
    bottom: .4rem;
    left: 0;
    width: 100%;
    .ln {
        width: 1rem;
        height: 1px;
        background: #c9c9c9;
        transform: scaleY(.5);
    }
    .txt2 {
        font-size: .14rem;
        color: #9c9c9c;
        margin: 0 .1rem;
    }
    .wx-login {
        font-size: .12rem;
        color: #666;
        display: block;
        text-align: center;
        margin-top: .2rem;
        img {
            display: block;
            width: .4rem;
            height: .4rem;
            margin: 0 auto 3px;
        }
    }
}
</style>
