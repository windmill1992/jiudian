(function($) {
	"use strict";
	var calendarSwitch = (function() {
		function calendarSwitch(element, options) {
			this.settings = $.extend(true, $.fn.calendarSwitch.defaults, options || {});
			this.element = element;
			this.init();
		}
		calendarSwitch.prototype = {
			init: function() {
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.selectors.sections;
				me.index = me.settings.index;
				me.comfire = me.settings.comfireBtn;
				var html = "<div class='headerWrapper'><div class='headerTip'>请选择入住离店日期</div><div class='close'></div></div><table class='dateZone'><tr><td class='colo'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class='colo'>六</td></tr></table>" + "<div class='tbody'></div><div class='btns'><div class='comfire no'>确定</div><?div>"
				$(me.sections).append(html);
				var html1 = "<div class='box'><div class='flex spb'><p>入住时间</p><p>离店时间</p></div><div class='time flex spb'><p id='st'>2019</p><p id='et'>2019</p><div class='num flex fcen'><span class='xian'></span><p class='txt'>共<span id='dateNum'>0</span>晚</p><span class='xian'></div></div></div>";
				$(me.sections).find('.headerWrapper').append(html1);
				$(me.sections).find('.headerWrapper').css({
					"height": "126px",
					"width": "100%",
					"padding": "55px 16px 6px",
					"background": "#fff",
					"position": "fixed",
					"z-index": "9999"
				});
				$(me.sections).find('.headerTip').css({
					"text-align": "left",
					"line-height": "1",
					"padding": "0 0 30px",
					"border-bottom": "1px solid #EAEAEA",
					"font-size": "20px",
					"font-weight": "bold",
				});
				$(me.sections).find('.box').css({
					"padding": "0 0 20px",
					"font-size": "11px",
					"color": "#222",
					"border-bottom": "1px solid #EAEAEA",
					"position": "relative",
					"z-index": "9999",
					"background": "#fff"
				})
				.find('.time').css({
					"margin-top": "5px",
					"font-size": "18px",
					"position": "relative"
				})
				.children('p').css({
					"font-weight": "bold"
				});
				$(me.sections).find('.box .num').css({
					"position": "absolute",
					"left": "50%",
					"top": "50%",
					"font-size": "12px",
					"color": "#666",
					"transform": "translate3d(-50%, -50%, 0)",
				})
				.find('.txt').css({
					"margin": "0 8px",
					"letter-spacing": "1px"
				})
				.siblings('.xian').css({
					"width": "21px",
					"height": "1px",
					"background": "#666",
				})
				$(me.sections).find('.close').css({
					"width": "16px",
					"height": "16px",
					"background": "url(/static/img/close.png) no-repeat 0 0 / 100% 100%",
					"font-size": "0",
					"position": "absolute",
					"top": "22px",
					"right": "16px"
				});
				$(me.sections).find('.btns').css({
					"width": "100%",
					"height": "76px",
					"background": "#fff",
					"position": "fixed",
					"bottom": "-2px",
					"left": "0",
					"padding": "16px",
					"box-shadow": "0px -1px 0px 0px rgba(234,234,234,1)",
					"z-index": "9999"
				});
				$(me.sections).find(me.comfire).css({
					"height": "44px",
					"line-height": "44px",
					"width": "100%",
					"color": "#fff",
					"text-align": "center",
					"font-size": "15px",
					"cursor": "pointer",
					"border-radius": "44px",
				});
				$(me.sections).find('.box').hide();
				for(var q = 0; q < me.index; q++) {
					var select = q;
					$(me.sections).find(".tbody").append("<p class='ny1'></p><table class='dateTable'></table>")
					var currentDate = new Date();
					currentDate.setDate(1);
					currentDate.setMonth(currentDate.getMonth() + select);
					var currentYear = currentDate.getFullYear();
					var currentMonth = currentDate.getMonth();
					var setcurrentDate = new Date(currentYear, currentMonth, 1);
					var firstDay = setcurrentDate.getDay();
					var yf = currentMonth + 1;
					if(yf < 10) {
						$(me.sections).find('.ny1').eq(select).text(currentYear + '.' + '0' + yf);
					} else {
						$(me.sections).find('.ny1').eq(select).text(currentYear + '.' + yf);
					}
					var DaysInMonth = [];
					if(me._isLeapYear(currentYear)) {
						DaysInMonth = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
					} else {
						DaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
					}
					var Ntd = firstDay + DaysInMonth[currentMonth];
					var Ntr = Math.ceil(Ntd / 7);
					for(var i = 0; i < Ntr; i++) {
						$(me.sections).find('.dateTable').eq(select).append('<tr></tr>');
					};
					var createTd = $(me.sections).find('.dateTable').eq(select).find('tr');
					createTd.each(function(index, element) {
						for(var j = 0; j < 7; j++) {
							$(this).append('<td></td>')
						}
					});
					var arryTd = $(me.sections).find('.dateTable').eq(select).find('td');
					for(var m = 0; m < DaysInMonth[currentMonth]; m++) {
						arryTd.eq(firstDay++).text(m + 1).attr('data-day', m + 1);
					}
				}
				me._initselected();
				me.element.on('click', function(event) {
					event.preventDefault();
					me._slider(me.sections)
				});
				$(me.sections).find('.close').on('click', function(e) {
                    e.preventDefault();
                    me._slider(me.sections);
                    $('.mask_calendar').fadeOut(200);
                });
				$(me.comfire).on('click', function(event) {
					if ($(this).hasClass('no')) return;	
					event.preventDefault();
					$(me.sections).find('.tbody .rz').each(function(index, element) {
						if($(this).text() == '离店') {
							$(me.sections).find('.tbody .rz').each(function(index, element) {
								if($(this).text() == '入住') {
									var day = parseInt($(this).parent().data('day'));
									if(day < 10) {
										day = "0" + day;
									}
									var startDayArrays = $(this).parents('table').prev('p').text().split('.');
									var startDayYear = "";
									var startDayMonth = "";
									startDayYear = startDayArrays[0];
									startDayMonth = startDayArrays[1];
									$('#startDate').val(startDayYear + '-' + startDayMonth + '-' + day);
									startDayArrays = [];
								}
								if($(this).text() == '离店') {
									var day = $(this).parent().data('day');
									if(day < 10) {
										day = "0" + day;
									}
									var endDayArrays = $(this).parents('table').prev('p').text().split('.');
									var endDayYear = "";
									var endDayMonth = "";
									endDayYear = endDayArrays[0];
									endDayMonth = endDayArrays[1];
									$('#endDate').val(endDayYear + '-' + endDayMonth + '-' + day);
									if(parseInt($("#startDate").val().replace(/[^0-9]/ig, "")) == parseInt($("#endDate").val().replace(/[^0-9]/ig, ""))) {
										var x = $('#startDate').val();
										var a = new Date(x.replace(/-/g, "/"));
										var b = new Date();
										b = new Date(a.getTime() + 24 * 3600 * 1000);
										var ye = b.getFullYear();
										var mo = b.getMonth() + 1;
										var da = b.getDate();
										$('#endDate').val(ye + '-' + mo + '-' + da);
									}
									endDayArrays = [];
								}
							});
							if($('#dateNum').text() != "") {
								var numDate = $('#dateNum').text().replace(/[^0-9]/ig, "");
								$('#numDate').val(numDate);
							}
							var st = $('#startDate').val();
							var en = $('#endDate').val();
							if(st) {
								me._slider(me.sections)
								me._callback();
							} else {
								var b = new Date();
								var ye = b.getFullYear();
								var mo = b.getMonth() + 1;
								var da = b.getDate();
								$('#startDate').val(ye + '-' + mo + '-' + da);
								b = new Date(b.getTime() + 24 * 3600 * 1000);
								var ye = b.getFullYear();
								var mo = b.getMonth() + 1;
								var da = b.getDate();
								$('#endDate').val(ye + '-' + mo + '-' + da);
								$('#numDate').val("1");
								me._slider(me.sections)
								me._callback()
							}
						}
					});
				});
			},
			_isLeapYear: function(year) {
				return(year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
			},
			_slider: function(id) {
				var me = this;
				me.animateFunction = me.settings.animateFunction;
				if(me.animateFunction == "fadeToggle") {
					$(id).fadeToggle();
				} else if(me.animateFunction == "slideToggle") {
					$(id).slideToggle();
				} else if(me.animateFunction == "toggle") {
					$(id).toggle();
				}
			},
			_initselected: function() {
				var me = this;
				me.comeColor = me.settings.comeColor;
				me.outColor = me.settings.outColor;
				me.daysnumber = me.settings.daysnumber;
				var strDays = new Date().getDate();
				var arry = [];
				var arry1 = [];
				$(me.sections).find('.tbody').find('td').each(function(index, element) {
					if($(this).text() != '') {
						arry.push(element);
					}
				});
				for(var i = 0; i < strDays - 1; i++) {
					$(arry[i]).css('color', '#c6c6c6');
				}
				if(me.daysnumber) {
					for(var i = strDays - 1; i < strDays + parseInt(me.daysnumber); i++) {
						arry[i] && arry1.push(arry[i])
					}
					for(var i = strDays + parseInt(me.daysnumber); i < $(arry).length; i++) {
						$(arry[i]).css('color', '#c6c6c6')
					}
				} else {
					for(var i = strDays - 1; i < $(arry).length; i++) {
						arry1.push(arry[i])
					}
				}
				me._selectDate(arry1)
			},
			_checkColor: function(comeColor, outColor) {
				var me = this;
				var rz = $(me.sections).find('.rz');
				for(var i = 0; i < rz.length; i++) {
					if(rz.eq(i).text() == "入住") {
						rz.eq(i).closest('td').css({
							'background': comeColor,
							'color': '#fff'
						});
					} else {
						rz.eq(i).closest('td').css({
							'background': outColor,
							'color': '#fff'
						});
					}
				}
			},
			_callback: function() {
				var me = this;
				if(me.settings.callback && $.type(me.settings.callback) === "function") {
					me.settings.callback();
				}
			},
			_selectDate: function(arry1) {
				var me = this;
				me.comeColor = me.settings.comeColor;
				me.outColor = me.settings.outColor;
				me.comeoutColor = me.settings.comeoutColor;
				me.sections = me.selectors.sections;
				var flag = 0;
				var first;
				var sum;
				var second;
				$(arry1).on('click', function(index) {
					index.stopPropagation();
					index.preventDefault();
					if($('.calendar').css('display') != "none") {
						$('.headerTip').hide();$('.box').show();
						if(flag == 0) {
							$(me.sections).find('.hover').remove();
							var $p = $(me.sections).find('.tbody').find('p.rz');
							$p.each(function() {
								$(this).parent().html($(this).parent().data('day'));
							})
							$(me.sections).find('.tbody').find('br').remove();
							$(arry1).css({
								'background': '#fff',
								'color': '#222'
							});
							$(this).html('<p class="rz">入住</p>');
							var t1 = $(this).parents('table').prev().text() + '.' + $(this).data('day');
							$('#st').text(t1);
							$('#et').text('');
							$('#dateNum').text(0);
							if (!$(me.comfire).hasClass('no')) {
								$(me.comfire).addClass('no');
							}
							first = $(arry1).index($(this));
							me._checkColor(me.comeColor, me.outColor)
							flag = 1;
							$(me.sections).find('.rz').each(function(index, element) {
								if($(this).text() == '入住') {
									// $(this).parent('td').append('<span class="hover ruzhu_hover">选择离店日期</span>');
									$(this).parent('td').css('position', 'relative');
								}
							});
							$('.hover').css({
								'position': 'absolute',
								'left': '-17px',
								'top': '0px'
							})
							$('.ruzhu_hover').css({
								'width': '100%',
								'height': '41px',
								'left': '0px',
								'top': '-45px',
								'background': '#434949',
								'color': '#fff',
								'z-index': '2'
							})
						} else if(flag == 1) {
							$(me.sections).find('.rz').each(function(index, element) {
								if($(this).text() == '入住') {
									$(this).parent('td').find('.ruzhu_hover').remove();
									$(this).parent('td').css('position', 'relative');
								}
							});
							flag = 0;
							second = $(arry1).index($(this))
							if(first >= second) {
								var t1 = $(this).parents('table').prev().text() + '.' + $(this).data('day');
								$('#st').text(t1);
								$('#et').text('');
								$('#dateNum').text(0);
								if (!$(me.comfire).hasClass('no')) {
									$(me.comfire).addClass('no');
								}
								$(me.sections).find('.hover').remove();
								var $p = $(me.sections).find('.tbody').find('p.rz');
								$p.each(function() {
									$(this).parent().html($(this).parent().data('day'));
								})
								$(me.sections).find('.tbody').find('br').remove();
								$(arry1).css({
									'background': '#fff',
									'color': '#222'
								});
								$(this).html('<p class="rz">入住</p>')
								first = $(arry1).index($(this));
								me._checkColor(me.comeColor, me.outColor)
								flag = 1;
								$(me.sections).find('.rz').each(function(index, element) {
									if($(this).text() == '入住') {
										// $(this).parent('td').append('<span class="hover ruzhu_hover">选择离店日期</span>');
										$(this).parent('td').css('position', 'relative');
									}
								});
								$('.hover').css({
									'position': 'absolute',
									'left': '-17px',
									'top': '0px'
								})
								$('.ruzhu_hover').css({
									'width': '100%',
									'height': '41px',
									'left': '0px',
									'top': '-45px',
									'background': '#434949',
									'color': '#fff',
									'z-index': '2'
								});
								return;
							}
							sum = Math.abs(second - first);
							if(sum == 0) {
								sum = 1;
							}
							if(first < second) {
								$(this).html('<p class="rz">离店</p>')
								first = first + 1;
								for(first; first < second; first++) {
									$(arry1[first]).css({
										'background': me.comeoutColor,
										'color': '#222'
									});
								}
								var t2 = $(this).parents('table').prev().text() + '.' + $(this).data('day');
								$('#et').text(t2);
								$('#dateNum').text(sum);
								$(me.comfire).removeClass('no');
							} else if(first == second) {} else if(first > second) {
								$(me.sections).find('.rz').text('离店');
								$(this).html('<p class="rz">入住</p>')
								second = second + 1;
								for(second; second < first; second++) {
									$(arry1[second]).css({
										'background': me.comeoutColor,
										'color': '#222'
									});
								}
								var t1 = $(this).parents('table').prev().text() + '.' + $(this).data('day');
								$('#st').text(t1);
								$('#et').text('');
								$('#dateNum').text(0);
								if (!$(me.comfire).hasClass('no')) {
									$(me.comfire).addClass('no');
								}
							}
							$(me.sections).find('.rz').each(function(index, element) {
								if($(this).text() == '离店') {
									// $(this).parent('td').append('<span class="hover lidian_hover">共' + sum + '晚</span>');
									$(this).parent('td').css('position', 'relative');
								}
							});
							$('.hover').css({
								'position': 'absolute',
								'left': '-17px',
								'top': '0px'
							})
							$('.ruzhu_hover').css({
								'width': '200%',
								'left': '0px',
								'top': '-24px',
								'background': '#434949',
								'color': '#fff',
								'z-index': '2'
							})
							$('.lidian_hover').css({
								'width': '100%',
								'left': '0px',
								'top': '-24px',
								'background': '#434949',
								'color': '#fff'
							})
							me._slider('firstSelect')
							var myweek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
							var st = new Date($('#startDate').val());
							var en = new Date($('#endDate').val());
							$('.week').text(myweek[st.getDay()])
							$('.week1').text(myweek[en.getDay()])
							me._checkColor(me.comeColor, me.outColor)
						}
					}
				})
			}
		}
		return calendarSwitch;
	})();
	$.fn.calendarSwitch = function(options) {
		return this.each(function() {
			var me = $(this),
				instance = me.data("calendarSwitch");
			if(!instance) {
				me.data("calendarSwitch", (instance = new calendarSwitch(me, options)));
			}
			if($.type(options) === "string") return instance[options]();
		});
	};
	$.fn.calendarSwitch.defaults = {
		selectors: {
			sections: "#calendar"
		},
		index: 4,
		animateFunction: "toggle",
		controlDay: false,
		daysnumber: "30",
		comeColor: "blue",
		outColor: "red",
		comeoutColor: "#0cf",
		callback: "",
		comfireBtn: '.comfire'
	};
})(jQuery);