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
				var html = "<div class='headerWrapper'><div class='headerTip'>请选择预定时间</div><div class='close'></div></div><table class='dateZone'><tr><td class='colo'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class='colo'>六</td></tr></table>" + "<div class='tbody'></div><div class='btns'><div class='comfire no'>确定</div><p class='txt'>请提前一天预定</p></div>"
				$(me.sections).append(html);
				$(me.sections).find('.headerWrapper').css({
					"width": "100%",
					"padding": "0 16px",
					"background": "#fff",
                    "position": "fixed",
					"z-index": "9999"
				});
				$(me.sections).find('.headerTip').css({
                    "height": "66px",
                    "line-height": "66px",
					"text-align": "center",
					"border-bottom": "1px solid #EAEAEA",
					"font-size": "20px",
					"font-weight": "bold",
				});
				$(me.sections).find('.close').css({
					"width": "16px",
					"height": "16px",
					"background": "url(/static/img/close.png) no-repeat 0 0 / 100% 100%",
					"font-size": "0",
					"position": "absolute",
					"top": "25px",
					"right": "16px"
				});
				$(me.sections).find('.btns').css({
					"width": "100%",
					"height": "109px",
					"background": "#fff",
					"position": "fixed",
					"bottom": "-1px",
					"left": "0",
					"padding": "16px 16px 24px",
					"box-shadow": "0px -1px 0px 0px rgba(234,234,234,1)",
					"z-index": "9999"
                })
                .find('.txt').css({
                    "text-align": "center",
                    "font-size": "13px",
                    "color": "#9C9C9C",
                    "margin-top": "12px",
                    "line-height": "1",
                });
				$(me.sections).find(me.comfire).css({
					"height": "44px",
					"line-height": "44px",
					"width": "100%",
					"color": "#fff",
					"text-align": "center",
					"font-size": "15px",
					"cursor": "pointer",
					"border-radius": "4px",
				});
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
                    me._slider(me.sections);
                });
                $(me.sections).find('.close').on('click', function(e) {
                    e.preventDefault();
                    me._slider(me.sections);
                    $('.mask_calendar').fadeOut(200);
                });
				$(me.comfire).on('click', function(event) {
					if ($(this).hasClass('no')) return;	
                    event.preventDefault();
                    var $sel = $('.tbody td.sel');
                    var day = $sel.data('day');
                    if(day < 10) {
                        day = "0" + day;
                    }
                    var dayArrays = $sel.parents('table').prev('p').text().split('.');
                    var dayYear = "";
                    var dayMonth = "";
                    dayYear = dayArrays[0];
                    dayMonth = dayArrays[1];
                    $('#orderDate').val(dayYear + '-' + dayMonth + '-' + day);
                    dayArrays = [];
                    me._slider(me.sections);
                    me._callback();
                    $('.mask_calendar').fadeOut(200);
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
				me.color = me.settings.color;
				me.daysnumber = me.settings.daysnumber;
				var strDays = new Date().getDate();
				var arry = [];
				var arry1 = [];
				$(me.sections).find('.tbody').find('td').each(function(index, element) {
					if($(this).text() != '') {
						arry.push(element);
					}
				});
				var len = me.settings.clickToday ? strDays - 1 : strDays;
				for(var i = 0; i < len; i++) {
                    $(arry[i]).css('color', '#c6c6c6');
                    if (i == strDays - 1) {
                        $(arry[i]).css({
                            "color": "#fff",
                            "background": "#0098AC",
                            "opacity": "0.3",
                        })
                    }
				}
				if(me.daysnumber) {
					for(var i = len; i < strDays + parseInt(me.daysnumber); i++) {
						arry[i] && arry1.push(arry[i])
					}
					for(var i = strDays + parseInt(me.daysnumber); i < $(arry).length; i++) {
						$(arry[i]).css('color', '#c6c6c6')
					}
				} else {
					for(var i = len; i < $(arry).length; i++) {
						arry1.push(arry[i])
					}
				}
				me._selectDate(arry1)
			},
			_checkColor: function(color) {
				var me = this;
				var sel = $(me.sections).find('.sel');
				sel.css({
					'background': color,
					'color': '#fff'
				});
			},
			_callback: function() {
				var me = this;
				if(me.settings.callback && $.type(me.settings.callback) === "function") {
					me.settings.callback();
				}
			},
			_selectDate: function(arry1) {
				var me = this;
				me.color = me.settings.color;
				me.sections = me.selectors.sections;
				$(arry1).on('click', function(index) {
					index.stopPropagation();
					index.preventDefault();
					if($('.calendar').css('display') != "none") {
                        $(arry1).css({
                            'background': '#fff',
                            'color': '#222'
                        });
                        $(arry1).each(function() {
                            $(this).removeClass('sel');
                        });

                        $(this).addClass('sel');

                        if ($(me.comfire).hasClass('no')) {
                            $(me.comfire).removeClass('no');
                        }
                        
                        me._checkColor(me.color);
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
		daysnumber: "31",
		color: "#0098AC",
		callback: "",
		comfireBtn: '.comfire',
		clickToday: false,
	};
})(jQuery);