export const util = {
	isWx: function(){
		const ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	},
	isIos: function() {
		var u = navigator.userAgent;
		return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	},
	telValidate: function(tel){
		const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|166|17[0135678]|18[0-9]|19[89])\d{8}$/;
		if(!reg.test(tel)){
	        return false;
	    }else{
	    	return true;
	    }
	},
	formatTime: function(ts, div = '-', flag){
		if (!ts || isNaN(Number(ts))) {
			return '';
		}
		let dd = new Date(ts);
		let y = dd.getFullYear();
		let m = dd.getMonth() + 1;
		let d = dd.getDate();
		let h = dd.getHours();
		let mm = dd.getMinutes();
		let s = dd.getSeconds();
		return [y, m, d].map(this.formatNum).join(div) + ' ' + [h, mm, s].map(this.formatNum).join(':');
	},
	formatNum: function(n){
		n = n.toString();
		return n[1] ? n : '0' + n;
	},
	getPageStyle: function(){
		var winw = document.body.offsetWidth;
		var fz = Math.round(winw * 100 / 375);
		fz = fz > 100 ? 100 : fz;
		document.documentElement.style.fontSize =  fz + 'px';
		window.addEventListener('resize', function() {
			winw = document.body.offsetWidth;
			fz = Math.round(winw * 100 / 375);
			fz = fz > 100 ? 100 : fz;
			document.documentElement.style.fontSize = fz + 'px';
		}, false);
	},
	showTips: function(txt, duration) {
		if(!duration){
			duration = 2000;
		}
		if($('#tips').length > 0) return false;
		$('body').append('<div id="tips" class="tips"></div>');
		var $tip = $('#tips');
		$tip.html(txt).fadeIn();
		setTimeout(function() {
			$tip.fadeOut(function() {
				$tip.remove();
			});
		}, duration);
	},
	closeTips: function() {
		if($('#tips').length > 0) {
			$('#tips').remove();
		}
	},
	wxshare(config, share) {
		if(this.isWx){
			wx.config({
				debug: false,
				appId: config.appId,
				nonceStr: config.nonceStr,
				signature: config.signature,
				timestamp: config.timeStamp,
				jsApiList: ["updateTimelineShareData", "updateAppMessageShareData", "onMenuShareTimeline", "onMenuShareAppMessage"],
			});
			wx.ready(function(){
				wx.checkJsApi({
					jsApiList: [
						'updateAppMessageShareData',
						'updateTimelineShareData',
						'onMenuShareAppMessage',
						'onMenuShareTimeline'
					],
					success: function(res) {
						let r = res.checkResult;
						if(r.updateAppMessageShareData){
							wx.updateAppMessageShareData({
								imgUrl: share.img_url,
								link: share.link,
								desc: share.desc,
								title: share.title,
							});
						}
						if(r.updateTimelineShareData){
							wx.updateTimelineShareData({
								imgUrl: share.img_url,
								link: share.link,
								title: share.title,
							});
						}
						if(r['menu:share:appmessage'] || r.onMenuShareAppMessage){
							wx.onMenuShareAppMessage({
								imgUrl: share.img_url,
								link: share.link,
								desc: share.desc,
								title: share.title,
							});
						}
						if(r['menu:share:timeline'] || r.onMenuShareTimeline){
							wx.onMenuShareTimeline({
								imgUrl: share.img_url,
								link: share.link,
								title: share.title,
							});
						}
					}
				});
			});
		}
	},
}
