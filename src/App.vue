<template>
	<div id="app" v-cloak>
		<transition name="fade">
			<router-view />
		</transition>
	</div>
</template>

<script>
import md5 from "js-md5";
import { kefuTel } from "./api/api";
export default {
	name: "App",
	methods: {
		getData() {
			kefuTel().then(res => {
				if (res.resultCode == 200 && res.resultData) {
					this.$store.commit('setKefu', res.resultData);
				}
			});
		}
	},
	mounted() {
		this.getData();
		let version = localStorage.getItem("version");
		if (version != md5("1.1")) {
			this.$Cookies.remove("uid");
			this.$Cookies.remove("mobile");
			this.$Cookies.remove("uname");
			localStorage.setItem("version", md5("1.1"));
		}
	}
};
</script>

<style>
@import url(./assets/common/base.css);
#app {
	font-family: "PingFang-regular", "微软雅黑", "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	-webkit-overflow-scrolling: touch;
}
.fade-enter-active,
.fade-leave-active {
  	transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  	opacity: 0;
}
</style>
