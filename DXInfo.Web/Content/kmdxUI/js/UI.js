
/* -----------KMDXUI前端框架-------------
* UI.js v0.0.1
* Created & Modified by zhangjunyuan
* Date modified 2016.5.10
*
* Copyright 2015-2016 昆明道讯科技有限公司 All rights reserved.
*
*/
!function(a,b,c){"use strict";var d=function(d,e){var f=!!b.getComputedStyle;f||(b.getComputedStyle=function(a){return this.el=a,this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;return"float"===b&&(b="styleFloat"),c.test(b)&&(b=b.replace(c,function(){return arguments[2].toUpperCase()})),a.currentStyle[b]?a.currentStyle[b]:null},this});var g,h,i,j,k,l,m=function(a,b,c,d){if("addEventListener"in a)try{a.addEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.addEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"attachEvent"in a&&("object"==typeof c&&c.handleEvent?a.attachEvent("on"+b,function(){c.handleEvent.call(c)}):a.attachEvent("on"+b,c))},n=function(a,b,c,d){if("removeEventListener"in a)try{a.removeEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.removeEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"detachEvent"in a&&("object"==typeof c&&c.handleEvent?a.detachEvent("on"+b,function(){c.handleEvent.call(c)}):a.detachEvent("on"+b,c))},o=function(a){if(a.children.length<1)throw new Error("The Nav container has no containing elements");for(var b=[],c=0;c<a.children.length;c++)1===a.children[c].nodeType&&b.push(a.children[c]);return b},p=function(a,b){for(var c in b)a.setAttribute(c,b[c])},q=function(a,b){0!==a.className.indexOf(b)&&(a.className+=" "+b,a.className=a.className.replace(/(^\s*)|(\s*$)/g,""))},r=function(a,b){var c=new RegExp("(\\s|^)"+b+"(\\s|$)");a.className=a.className.replace(c," ").replace(/(^\s*)|(\s*$)/g,"")},s=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,d,a[d])},t=a.createElement("style"),u=a.documentElement,v=function(b,c){var d;this.options={animate:!0,transition:284,label:"Menu",insert:"before",customToggle:"",closeOnNavClick:!1,openPos:"relative",navClass:"nav-collapse",navActiveClass:"js-nav-active",jsClass:"js",init:function(){},open:function(){},close:function(){}};for(d in c)this.options[d]=c[d];if(q(u,this.options.jsClass),this.wrapperEl=b.replace("#",""),a.getElementById(this.wrapperEl))this.wrapper=a.getElementById(this.wrapperEl);else{if(!a.querySelector(this.wrapperEl))throw new Error("The nav element you are trying to select doesn't exist");this.wrapper=a.querySelector(this.wrapperEl)}this.wrapper.inner=o(this.wrapper),h=this.options,g=this.wrapper,this._init(this)};return v.prototype={destroy:function(){this._removeStyles(),r(g,"closed"),r(g,"opened"),r(g,h.navClass),r(g,h.navClass+"-"+this.index),r(u,h.navActiveClass),g.removeAttribute("style"),g.removeAttribute("aria-hidden"),n(b,"resize",this,!1),n(b,"focus",this,!1),n(a.body,"touchmove",this,!1),n(i,"touchstart",this,!1),n(i,"touchend",this,!1),n(i,"mouseup",this,!1),n(i,"keyup",this,!1),n(i,"click",this,!1),h.customToggle?i.removeAttribute("aria-hidden"):i.parentNode.removeChild(i)},toggle:function(){j===!0&&(l?this.close():this.open())},open:function(){l||(r(g,"closed"),q(g,"opened"),q(u,h.navActiveClass),q(i,"active"),g.style.position=h.openPos,p(g,{"aria-hidden":"false"}),l=!0,h.open())},close:function(){l&&(q(g,"closed"),r(g,"opened"),r(u,h.navActiveClass),r(i,"active"),p(g,{"aria-hidden":"true"}),h.animate?(j=!1,setTimeout(function(){g.style.position="absolute",j=!0},h.transition+10)):g.style.position="absolute",l=!1,h.close())},resize:function(){"none"!==b.getComputedStyle(i,null).getPropertyValue("display")?(k=!0,p(i,{"aria-hidden":"false"}),g.className.match(/(^|\s)closed(\s|$)/)&&(p(g,{"aria-hidden":"true"}),g.style.position="absolute"),this._createStyles(),this._calcHeight()):(k=!1,p(i,{"aria-hidden":"true"}),p(g,{"aria-hidden":"false"}),g.style.position=h.openPos,this._removeStyles())},handleEvent:function(a){var c=a||b.event;switch(c.type){case"touchstart":this._onTouchStart(c);break;case"touchmove":this._onTouchMove(c);break;case"touchend":case"mouseup":this._onTouchEnd(c);break;case"click":this._preventDefault(c);break;case"keyup":this._onKeyUp(c);break;case"focus":case"resize":this.resize(c)}},_init:function(){this.index=c++,q(g,h.navClass),q(g,h.navClass+"-"+this.index),q(g,"closed"),j=!0,l=!1,this._closeOnNavClick(),this._createToggle(),this._transitions(),this.resize();var d=this;setTimeout(function(){d.resize()},20),m(b,"resize",this,!1),m(b,"focus",this,!1),m(a.body,"touchmove",this,!1),m(i,"touchstart",this,!1),m(i,"touchend",this,!1),m(i,"mouseup",this,!1),m(i,"keyup",this,!1),m(i,"click",this,!1),h.init()},_createStyles:function(){t.parentNode||(t.type="text/css",a.getElementsByTagName("head")[0].appendChild(t))},_removeStyles:function(){t.parentNode&&t.parentNode.removeChild(t)},_createToggle:function(){if(h.customToggle){var b=h.customToggle.replace("#","");if(a.getElementById(b))i=a.getElementById(b);else{if(!a.querySelector(b))throw new Error("The custom nav toggle you are trying to select doesn't exist");i=a.querySelector(b)}}else{var c=a.createElement("a");c.innerHTML=h.label,p(c,{href:"#","class":"nav-toggle"}),"after"===h.insert?g.parentNode.insertBefore(c,g.nextSibling):g.parentNode.insertBefore(c,g),i=c}},_closeOnNavClick:function(){if(h.closeOnNavClick){var a=g.getElementsByTagName("a"),b=this;s(a,function(c){m(a[c],"click",function(){k&&b.toggle()},!1)})}},_preventDefault:function(a){return a.preventDefault?(a.stopImmediatePropagation&&a.stopImmediatePropagation(),a.preventDefault(),a.stopPropagation(),!1):void(a.returnValue=!1)},_onTouchStart:function(a){Event.prototype.stopImmediatePropagation||this._preventDefault(a),this.startX=a.touches[0].clientX,this.startY=a.touches[0].clientY,this.touchHasMoved=!1,n(i,"mouseup",this,!1)},_onTouchMove:function(a){(Math.abs(a.touches[0].clientX-this.startX)>10||Math.abs(a.touches[0].clientY-this.startY)>10)&&(this.touchHasMoved=!0)},_onTouchEnd:function(a){if(this._preventDefault(a),k&&!this.touchHasMoved){if("touchend"===a.type)return void this.toggle();var c=a||b.event;3!==c.which&&2!==c.button&&this.toggle()}},_onKeyUp:function(a){var c=a||b.event;13===c.keyCode&&this.toggle()},_transitions:function(){if(h.animate){var a=g.style,b="max-height "+h.transition+"ms";a.WebkitTransition=a.MozTransition=a.OTransition=a.transition=b}},_calcHeight:function(){for(var a=0,b=0;b<g.inner.length;b++)a+=g.inner[b].offsetHeight;var c="."+h.jsClass+" ."+h.navClass+"-"+this.index+".opened{max-height:"+a+"px !important} ."+h.jsClass+" ."+h.navClass+"-"+this.index+".opened.dropdown-active {max-height:9999px !important}";t.styleSheet?t.styleSheet.cssText=c:t.innerHTML=c,c=""}},new v(d,e)};"undefined"!=typeof module&&module.exports?module.exports=d:b.responsiveNav=d}(document,window,0);
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement("style")
  msViewportStyle.appendChild(
    document.createTextNode(
      "@-ms-viewport{width:auto!important}"
    )
  )
  document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}
/*placeholder兼容性处理*/
(function(window, document, $) {
	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = 'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {
		placeholder = prototype.placeholder = function() {
			return this;
		};
		placeholder.input = placeholder.textarea = true;
	} else {
		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};
		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;
		hooks = {
			'get': function(element) {
				var $element = $(element);
				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					if (element != safeActiveElement()) {
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			$(document).delegate('form', 'submit.placeholder', function() {
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});
	}

	function args(elem) {
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().prop('type','text');
					} catch(e) {
						$replacement = $('<input>').prop($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (exception) {}
	}
}(this, document, jQuery));
/**/
;(function($) {
    $.extend({
        format : function(str, step, splitor) {
            str = str.toString();
            var len = str.length;
  
            if(len > step) {
                 var l1 = len%step, 
                     l2 = parseInt(len/step),
                     arr = [],
                     first = str.substr(0, l1);
                 if(first != '') {
                     arr.push(first);
                 };
                 for(var i=0; i<l2 ; i++) {
                     arr.push(str.substr(l1 + i*step, step));                                    
                 };
                 str = arr.join(splitor);
             };
             return str;
        }
    });
})(jQuery);
///*Dropdown*/
//+function ($) {
//	'use strict';
//	var backdrop = '.dropdown-backdrop';
//	var toggle   = '[data-toggle="dropdown"]';
//	var Dropdown = function (element) {
//		$(element).on('click.bs.dropdown', this.toggle)
//	}
//	Dropdown.VERSION = '3.3.5';
//	function getParent($this) {
//		var selector = $this.attr('data-target');
//		if (!selector) {
//			selector = $this.attr('href');
//			selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
//		}
//		var $parent = selector && $(selector);
//		return $parent && $parent.length ? $parent : $this.parent();
//	}
//	function clearMenus(e) {
//		if (e && e.which === 3) return
//		$(backdrop).remove();
//		$(toggle).each(function () {
//			var $this = $(this)
//			var $parent = getParent($this)
//			var relatedTarget = { relatedTarget: this }
//			if (!$parent.hasClass('open')) return
//			if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return
//			$parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
//			if (e.isDefaultPrevented()) return
//			$this.attr('aria-expanded', 'false');
//			$parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
//		});
//	}
//	Dropdown.prototype.toggle = function (e) {
//		var $this = $(this)
//		if ($this.is('.disabled, :disabled')) return
//		var $parent  = getParent($this);
//		var isActive = $parent.hasClass('open');
//		clearMenus();
//		if (!isActive) {
//		if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
//			// if mobile we use a backdrop because click events don't delegate
//			$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
//		}
//		var relatedTarget = { relatedTarget: this }
//		$parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
//		if (e.isDefaultPrevented()) return
//			$this.trigger('focus').attr('aria-expanded', 'true');
//			$parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget);
//		}
//		return false
//	}
//	Dropdown.prototype.keydown = function (e) {
//		if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
//		var $this = $(this)
//		e.preventDefault()
//		e.stopPropagation()
//		if ($this.is('.disabled, :disabled')) return
//		var $parent  = getParent($this);
//		var isActive = $parent.hasClass('open');
//		if (!isActive && e.which != 27 || isActive && e.which == 27) {
//			if (e.which == 27) $parent.find(toggle).trigger('focus')
//			return $this.trigger('click')
//		}
//		var desc = ' li:not(.disabled):visible a'
//		var $items = $parent.find('.dropdown-menu' + desc)
//		if (!$items.length) return
//		var index = $items.index(e.target);
//		if (e.which == 38 && index > 0)                 index--         // up
//		if (e.which == 40 && index < $items.length - 1) index++         // down
//		if (!~index)                                    index = 0
//		$items.eq(index).trigger('focus');
//	}
//	function Plugin(option) {
//		return this.each(function () {
//			var $this = $(this);
//			var data  = $this.data('bs.dropdown');
//			if (!data){
//				$this.data('bs.dropdown', (data = new Dropdown(this)));
//			}
//			if (typeof option == 'string'){
//				data[option].call($this);
//			}
//		});
//	}
//	var old = $.fn.dropdown;
//	$.fn.dropdown             = Plugin;
//	$.fn.dropdown.Constructor = Dropdown;
//	$.fn.dropdown.noConflict = function () {
//		$.fn.dropdown = old;
//		return this;
//	}
//	$(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
//}(jQuery);
/*隐藏显示密码*/
!(function ( $ ) {
    $.fn.togglePassword = function( options ) {
        var s = $.extend( $.fn.togglePassword.defaults, options ),
        input = $( this );

        $( s.el ).on( s.ev, function() {
            "password" == $( input ).attr( "type" ) ?
                $( input ).attr( "type", "text" ) :
                $( input ).attr( "type", "password" );
        });
    };

    $.fn.togglePassword.defaults = {
        ev: "click"
    };
}( jQuery ));
/*transition*/
!function ($) {
	"use strict";
	$(function () {
		$.support.transition = (function () {
			var transitionEnd = (function () {
				var el = document.createElement('bootstrap'),
				transEndEventNames = {
					'WebkitTransition' : 'webkitTransitionEnd',
					'MozTransition'    : 'transitionend',
					'OTransition'      : 'oTransitionEnd otransitionend',
					'transition'       : 'transitionend'
				},
				name
				for (name in transEndEventNames){
					if (el.style[name] !== undefined) {
						return transEndEventNames[name]
					}
				}
			}())
			return transitionEnd && {
				end: transitionEnd
			}
		})()
	});
}(window.jQuery);

/*添加收藏
<a title="收藏本站" href="javascript:;" onClick="addFavoritepage('H-ui前端框架','http://www.h-ui.net/');">收藏本站</a>
*/
/*收藏主站*/
function addFavorite(name,site){
	try{window.external.addFavorite(site,name);}
	catch(e){
		try{window.sidebar.addPanel(name,site,"");}
			catch(e){alert("加入收藏失败，请使用Ctrl+D进行添加");}
	}
}
/*收藏页面
<a title="收藏本页" href="javascript:addFavoritepage(0);">收藏本页</a>
*/
function addFavoritepage(){var sURL=window.location.href;var sTitle=document.title;try{window.external.addFavorite(sURL,sTitle);}catch(e){try{window.sidebar.addPanel(sTitle,sURL,"");}catch(e){alert("加入收藏失败，请使用Ctrl+D进行添加");}}}

/*设为首页*/
function setHome(obj){
  try{obj.style.behavior="url(#default#homepage)";obj.setHomePage(webSite);}
  catch(e){if(window.netscape){
	  try {netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");}
	  catch(e){alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入\"about:config\"并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");}
	  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	  prefs.setCharPref('browser.startup.homepage',url);}}
}
/*滚动*/
function marquee(height,speed,delay){
	var scrollT;
	var pause = false;
	var ScrollBox = document.getElementById("marquee");
	if(document.getElementById("holder").offsetHeight <= height) return;
	var _tmp = ScrollBox.innerHTML.replace('holder', 'holder2')
	ScrollBox.innerHTML += _tmp;
	ScrollBox.onmouseover = function(){pause = true}
	ScrollBox.onmouseout = function(){pause = false}
	ScrollBox.scrollTop = 0;
	function start(){
	    scrollT = setInterval(scrolling,speed);
	    if(!pause) ScrollBox.scrollTop += 2;
	}
	function scrolling(){
	    if(ScrollBox.scrollTop % height != 0){
	        ScrollBox.scrollTop += 2;
	        if(ScrollBox.scrollTop >= ScrollBox.scrollHeight/2) ScrollBox.scrollTop = 0;
	    }
		else{
	        clearInterval(scrollT);
	        setTimeout(start,delay);
	    }
	}
	setTimeout(start,delay);
}

/*左侧菜单-隐藏显示*/
function displaynavbar(obj){
	if($(obj).hasClass("open")){
		$(obj).removeClass("open");
		$("body").removeClass("big-page");
	}else{
		$(obj).addClass("open");
		$("body").addClass("big-page");
					
	}
}
var handleSidebarMinify = function() {
    $("[data-click=aside-minify]").click(function(e) {
        e.preventDefault();
        var t = "aside-minified";
        var n = "#page-container";
        if ($(n).hasClass(t)) {
            $(n).removeClass(t);
            $('#Hui-aside .menu_dropdown').children('dl').each(function(i,n){
            	if($(n).children('dt').hasClass('selected')){
            		$(n).children('dd').css('display','block');
            	}
            });
        } else {
            $(n).addClass(t);
            if ($(n).hasClass("aside-fixed")) {
                $('#Hui-aside').removeAttr("style")
            }
            $('#Hui-aside .menu_dropdown dl').children('dd').each(function(i,n){
            	if($(n).css('display')=='block'){
            		$(n).css('display','none');
            	}
            });
        }
        $(window).trigger("resize")
    });
};

/*模拟下拉菜单*/
jQuery.Huiselect = function(divselectid,inputselectid) {
	var inputselect = $(inputselectid);
	$(divselectid+" cite").click(function(){
		var ul = $(divselectid+" ul");
		ul.slideToggle();
	});
	$(divselectid+" ul li a").click(function(){
		var txt = $(this).text();
		$(divselectid+" cite").html(txt);
		var value = $(this).attr("selectid");
		inputselect.val(value);
		$(divselectid+" ul").hide();
	});
	$(document).click(function(){$(divselectid+" ul").hide();});
};

/*hover*/
jQuery.Huihover =function(obj) {
	$(obj).hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});
};
/*得到失去焦点*/
jQuery.Huifocusblur = function(obj) {
	$(obj).focus(function() {$(this).addClass("focus").removeClass("inputError");});
	$(obj).blur(function() {$(this).removeClass("focus");});
};
/*tab选项卡*/
jQuery.Huitab =function(tabBar,tabCon,class_name,tabEvent,i){
  	var $tab_menu=$(tabBar);
	// 初始化操作
	$tab_menu.removeClass(class_name);
	$(tabBar).eq(i).addClass(class_name);
	$(tabCon).hide();
	$(tabCon).eq(i).show();
	
	$tab_menu.on(tabEvent,function(){
		$tab_menu.removeClass(class_name);
		$(this).addClass(class_name);
		var index=$tab_menu.index(this);
		$(tabCon).hide();
		$(tabCon).eq(index).show();
	});
}

/*折叠*/
jQuery.Huifold = function (obj, obj_c, speed, obj_type, Event) {
    if (obj_type == 2) {
        $(obj + ":first").find("b").html("-");
        $(obj_c + ":first").show();
    }
    $(obj).on(Event, function () {
        if ($(this).next().is(":visible")) {
            if (obj_type == 2) {
                return false;
            } else {
                if ($(".aside-minified").length === 0) {
                    $(this).next().slideUp(speed).end().removeClass("selected");
                    if ($(this).find("b")) {
                        $(this).find("b").html("+");
                    }
                }
            }
        }
        else {
            if (obj_type == 3) {
                $(this).next().slideDown(speed).end().addClass("selected");
                if ($(this).find("b")) {
                    $(this).find("b").html("-");
                }
            } else {
                $(obj_c).slideUp(speed);
                $(obj).removeClass("selected");
                if ($(this).find("b")) {
                    $(obj).find("b").html("+");
                }
                $(this).next().slideDown(speed).end().addClass("selected");
                if ($(this).find("b")) {
                    $(this).find("b").html("-");
                }
            }
        }
    });
}
jQuery.Huisubfold = function (obj, obj_c, speed, Event) {
    $(obj).on(Event, function () {
        if ($(this).children('ul').is(":visible")) {
            $(this).children('ul').slideUp(speed).end();
            $(this).removeClass("selected");

            if ($(this).find("b")) {
                $(this).find("b").html("+");
            }
        }
        else {
            $(obj_c).slideUp(speed);
            $(obj).removeClass("selected");
            if ($(obj).find("b")) {
                $(obj).find("b").html("+");
            }
            $(this).children('ul').slideDown(speed).end();
            $(this).addClass("selected");
            if ($(this).find("b")) {
                $(this).find("b").html("-");
            }
        }
    });
}
/*返回顶部*/
var $backToTopEle=$('<a href="javascript:void(0)" class="Hui-iconfont toTop" title="返回顶部" alt="返回顶部" style="display:none">&#xe684;</a>').appendTo($("body")).click(function(){
	$("html, body").animate({ scrollTop: 0 }, 120);
});
var $backToTopFun = function() {
	var st = $(document).scrollTop(), winh = $(window).height();
	(st > 0)? $backToTopEle.show(): $backToTopEle.hide();
	/*IE6下的定位*/
	if(!window.XMLHttpRequest){
		$backToTopEle.css("top", st + winh - 166);
	}
};
/*textarea 字数限制*/
function textarealength(obj,maxlength){
	var v = $(obj).val();
	var l = v.length;
	if( l > maxlength){
		v = v.substring(0,maxlength);
		$(obj).val(v);
	}
	$(obj).parent().find(".textarea-length").text(v.length);
}
/*Huimodalalert*/
function modal_alert(info,speed){
	if(speed==0||typeof(speed) == "undefined"){
		$(document.body).append(
		'<div id="modal-alert" class="modal hide modal-alert">'+
	  		'<div class="modal-alert-info">'+info+'</div>'+
	  		'<div class="modal-footer"> <button class="btn btn-primary radius" onClick="modal_alert_hide()">确定</button></div>'+
		'</div>'
		);
		$("#modal-alert").fadeIn();
	}else{
		$(document.body).append(
		'<div id="modal-alert" class="modal hide modal-alert">'+
	  		'<div class="modal-alert-info">'+info+'</div>'+
		'</div>'
		);
		$("#modal-alert").fadeIn();
		setTimeout("modal_alert_hide()",speed);
	}	
}
function Huimodal_alert_hide() {
	$("#modal-alert").fadeOut("normal",function(){
		$("#modal-alert").remove();
	});
}
/*设置cookie*/
function setCookie(name, value, Days){
	if(Days == null || Days == ''){
		Days = 300;
	}
	var exp  = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
}
/*获取cookie*/
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
}
$(function(){
	/*****表单*****/
    $.Huifocusblur(".input-text,.textarea");
	/*按钮loading*/
	$('.btn-loading').click(function () {
		var $btn = $(this);
		var btnval = $btn.val();
		$btn.addClass("disabled").val("loading").attr("disabled","disabled");
		setTimeout(function(){
			$btn.removeClass("disabled").val(btnval).removeAttr("disabled");
		}, 3000);
	});	
	/**/
	$.Huiselect("#divselect","#inputselect");

	/*全选*/
	$("table thead th input:checkbox").on("click" , function(){
		$(this).closest("table").find("tr > td:first-child input:checkbox").prop("checked",$("table thead th input:checkbox").prop("checked"));
    });
	
    /*上传*/
    $(document).on("change",".input-file",function(){
		var uploadVal=$(this).val();
		$(this).parent().find(".upload-url").val(uploadVal).focus().blur();
	});
	
	/*下拉菜单*/
	$(document).on("mouseenter",".dropDown",function(){
		$(this).addClass("hover");
	});
	$(document).on("mouseleave",".dropDown",function(){
		$(this).removeClass("hover");
	});
	$(document).on("mouseenter",".dropDown_hover",function(){
		$(this).addClass("open");
	});
	$(document).on("mouseleave",".dropDown_hover",function(){
		$(this).removeClass("open");
	});
	$(document).on("click",".dropDown-menu li a",function(){
		$(".dropDown").removeClass('open');
	});
	$(document).on("mouseenter",".menu > li",function(){
		$(this).addClass("open");
	});
	$(document).on("mouseleave",".menu > li",function(){
		$(this).removeClass("open");
	});
	
	/*tag标签*/
	var tags_a = $(".tags a");
	tags_a.each(function(){
		var x = 9;
		var y = 0;
		var rand = parseInt(Math.random() * (x - y + 1) + y);
		$(this).addClass("tags"+rand);
	});
		
	/*对联广告*/
	var dual = $(".dual");
	var dual_close = $("a.dual_close");	
	var screen_w = screen.width;
	if(screen_w>1024){dual.show();}
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		dual.stop().animate({top:scrollTop+260});
	});
	dual_close.click(function(){
		$(this).parent().hide();
		return false;
	});

	/*顶部展开定时自动关闭广告*/ 
	$("#banner").slideDown("slow");
	
	/*图片预览*/
	$("a.preview").hover(
		function(){
			$(this).addClass("active");
			$("#tooltip-preview").remove();
			var winW=$(window).width();
			var winW5=winW/2;
			this.myTitle = this.title;
			this.title = "";
			var midimg = $(this).attr('data-preview');
			if(midimg ==''){return false;}
			else{
				var imgT=$(this).parents(".imgItem").offset().top;
				var imgL=$(this).parents(".imgItem").offset().left;	
				var imgW=$(this).parents(".imgItem").width();
				var imgH=$(this).parents(".imgItem").height();
				var ww=(imgL+imgW/2);
				if(ww < winW5){
					var tooltipLeft=(imgW+imgL)+"px";	
				}
				else{
					var tooltipRight=(winW-imgL)+"px";
				}
				var tooltip_keleyi_com = "<div id='tooltip-preview' style='top:"+ imgT +"px;right:"+ tooltipRight +";left:"+ tooltipLeft +"'><span id='tooltip-keleyi-div' class='loading' style='width:50px; height:50px'></span></div>";
				$("body").append(tooltip_keleyi_com);
				var midimgW = $(this).attr('data-width');
				var midimgH = $(this).attr('data-height');
				var imgTitle = this.myTitle ? "<br />" + this.myTitle + " 产品预览图" : "";
				/*图片预加载*/
				var image = new Image();/*创建一个Image对象*/
				image.onload = function () {
					if($('a.preview.active').attr('data-preview') == midimg){
						var midingW2 = this.width;
						var midingH2 = this.height;
						$("#tooltip-keleyi-div").css({"width":midingW2+"px","height":midingH2+"px"});
						$('#tooltip-keleyi-div').append(this);	
					}
				};
				image.src = midimg;
			}
		},
		function(){
			$(this).removeClass("active");
			this.title = this.myTitle;
			$("#tooltip-preview").remove();
		}
	);
	
    /*Huialert*/
	$.Huihover('.Huialert i');
	$(".Huialert i").on("click",function(){
		var Huialert = $(this).parents(".Huialert");
		Huialert.fadeOut("normal",function(){
		  Huialert.remove();
		});
	});

	/*tag标签*/
	var time1;
	$(".Hui-tags-lable").show();
	$(".Hui-tags-input").val("");
	$(document).on("blur",".Hui-tags-input",function(){
		time1 = setTimeout(function(){
			$(this).parents(".Hui-tags").find(".Hui-tags-list").slideUp();
		}, 400);
	});
	$(document).on("focus",".Hui-tags-input",function(){
		clearTimeout(time1);
	});
	$(document).on("click",".Hui-tags-input",function(){
		$(this).find(".Hui-tags-input").focus();
		$(this).find(".Hui-tags-list").slideDown();
	});
	function gettagval(obj){
		var str ="";
		var token =$(obj).parents(".Hui-tags").find(".Hui-tags-token");
		//alert(token.length)
		if(token.length<1){
			$(obj).parents(".Hui-tags").find(".Hui-tags-val").val("");
			return false;
		}
		for(var i = 0;i< token.length;i++){
			str += token.eq(i).text() + ",";
			$(obj).parents(".Hui-tags").find(".Hui-tags-val").val(str);
		}
	}
	$(document).on("keydown",".Hui-tags-input",function(event){
		$(this).next().hide();
		var v = $(this).val().replace(/\s+/g, "");
		var reg=/^,|,$/gi;
		v=v.replace(reg,"");
		v=$.trim(v);
		var token =$(this).parents(".Hui-tags").find(".Hui-tags-token");
		if(v!=''){
			if(event.keyCode==13||event.keyCode==108||event.keyCode==32){
				$('<span class="Hui-tags-token">'+v+'</span>').insertBefore($(this).parents(".Hui-tags").find(".Hui-tags-iptwrap"));
				$(this).val("");
				gettagval(this);
			}
		}else{
			if(event.keyCode==8){
				if(token.length>=1){
					$(this).parents(".Hui-tags").find(".Hui-tags-token:last").remove();
					gettagval(this);
				}
				else{
					$(this).parents(".Hui-tags").find(".Hui-tags-lable").show();
					return false;
				}
				
			}
		}	
	});
	
	$(document).on("click",".Hui-tags-has span",function(){
		var taghasV = $(this).text();
		taghasV=taghasV.replace(/(^\s*)|(\s*$)/g,"");
		$('<span class="Hui-tags-token">'+taghasV+'</span>').insertBefore($(this).parents(".Hui-tags").find(".Hui-tags-iptwrap"));
		gettagval(this);
		$(this).parents(".Hui-tags").find(".Hui-tags-input").focus();
	});
	$(document).on("click",".Hui-tags-token",function(){
		var token =$(this).parents(".Hui-tags").find(".Hui-tags-token");
		var it = $(this).parents(".Hui-tags");
		$(this).remove();
		switch(token.length){
			case 1 : it.find(".Hui-tags-lable").show();
			break;
		}
		var str ="";
		var token =it.find(".Hui-tags-token");
		//alert(token.length)
		if(token.length<1){
			it.find(".Hui-tags-val").val("");
			return false;
		}
		for(var i = 0;i< token.length;i++){
			str += token.eq(i).text() + ",";
			it.find(".Hui-tags-val").val(str);
		}		
	});
});

function addUIAlter(target, alertmsg, type) {
    if (target == "" || alertmsg == "") {
        return null;
    }
    if (type == "") {
        type = "info";
    }
    if ($(target)) {
        var elalert = document.createElement("div");
        $(elalert).addClass("Huialert Huialert-" + type);
        var elalerti = '<i class="iconfont icon-close"></i>';
        elalerti = elalerti + alertmsg;
        $(elalert).html(elalerti);
        $(elalert).children('i.icon-close').hover(function () { $(this).addClass("hover"); }, function () { $(this).removeClass("hover"); });
        $(elalert).children('i.icon-close').on("click", function () {
            var Huialert = $(this).parents(".Huialert");
            Huialert.fadeOut("normal", function () {
                Huialert.remove();
            });
        });
        $(target).after(elalert);
        setTimeout(function () { $(elalert).children('i.icon-close').click(); }, 10000);
    }
}

function displayimg(){
	$("#banner").slideUp(1000,function(){
		$("#top").slideDown(1000);
	});
}
setTimeout("displayimg()",4000);


var num=0,oUl=$("#min_title_list"),hide_nav=$("#Hui-tabNav");

/*获取顶部选项卡总长度*/
function tabNavallwidth(){
    var taballwidth=0,
        $tabNav = hide_nav.find(".acrossTab"),
        $tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
        $tabNavitem = hide_nav.find(".acrossTab li"),
        $tabNavmore =hide_nav.find(".Hui-tabNav-more");
    if (!$tabNav[0]){return}
    $tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+60))
    });
    $tabNav.width(taballwidth+25);
    var w = $tabNavWp.width();
    if(taballwidth+25>w){
        $tabNavmore.show()}
    else{
        $tabNavmore.hide();
        $tabNav.css({left:0})
    }
}

/*左侧菜单响应式*/
function Huiasidedisplay(){
    if($(window).width()>=768){
        $(".Hui-aside").show()
    }
}
function getskincookie(){
    var v = getCookie("Huiskin");
    var hrefStr=$("#skin").attr("href");
    if(v==null||v==""){
        v="default";
    }
    if(hrefStr!=undefined){
        var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
        $("#skin").attr("href",hrefRes);
    }
}
function Hui_admin_tab(obj){
    if($(obj).attr('_href')){
        var bStop=false;
        var bStopIndex=0;
        var _href=$(obj).attr('_href');
        var _titleName=$(obj).attr("data-title");
        var topWindow=$(window.parent.document);
        var show_navLi=topWindow.find("#min_title_list li");
        show_navLi.each(function() {
            if($(this).find('span').attr("data-href")==_href){
                bStop=true;
                bStopIndex=show_navLi.index($(this));
                return false;
            }
        });
        if(!bStop){
            creatIframe(_href,_titleName);
            min_titleList();
        }
        else{
            show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
            var iframe_box=topWindow.find("#iframe_box");
            iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src",_href);
        }
    }

}
function min_titleList(){
    var topWindow=$(window.parent.document);
    var show_nav=topWindow.find("#min_title_list");
    var aLi=show_nav.find("li");
};
function creatIframe(href,titleName){
    var topWindow=$(window.parent.document);
    var show_nav=topWindow.find('#min_title_list');
    show_nav.find('li').removeClass("active");
    var iframe_box=topWindow.find('#iframe_box');
    show_nav.append('<li class="active"><span data-href="'+href+'">'+titleName+'</span><i></i><em></em></li>');
    var taballwidth=0,
        $tabNav = topWindow.find(".acrossTab"),
        $tabNavWp = topWindow.find(".Hui-tabNav-wp"),
        $tabNavitem = topWindow.find(".acrossTab li"),
        $tabNavmore =topWindow.find(".Hui-tabNav-more");
    if (!$tabNav[0]){return}
    $tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+60))
    });
    $tabNav.width(taballwidth+25);
    var w = $tabNavWp.width();
    if(taballwidth+25>w){
        $tabNavmore.show()}
    else{
        $tabNavmore.hide();
        $tabNav.css({left:0})
    }
    var iframeBox=iframe_box.find('.show_iframe');
    iframeBox.hide();
    iframe_box.append('<div class="show_iframe"><div class="loading"></div><iframe frameborder="0" src='+href+'></iframe></div>');
    var showBox=iframe_box.find('.show_iframe:visible');
    showBox.find('iframe').load(function(){
        showBox.find('.loading').hide();
    });
}
function removeIframe(){
    var topWindow = $(window.parent.document);
    var iframe = topWindow.find('#iframe_box .show_iframe');
    var tab = topWindow.find(".acrossTab li");
    var showTab = topWindow.find(".acrossTab li.active");
    var showBox=topWindow.find('.show_iframe:visible');
    var i = showTab.index();
    tab.eq(i-1).addClass("active");
    iframe.eq(i-1).show();
    tab.eq(i).remove();
    iframe.eq(i).remove();
}
/*弹出层*/
/*
 参数解释：
 title	标题
 url		请求的url
 id		需要操作的数据id
 w		弹出层宽度（缺省调默认值）
 h		弹出层高度（缺省调默认值）
 */
function layer_show(title,url,w,h){
    if (title == null || title == '') {
        title=false;
    };
    if (url == null || url == '') {
        url="404.html";
    };
    if (w == null || w == '') {
        w=800;
    };
    if (h == null || h == '') {
        h=($(window).height() - 50);
    };
    layer.open({
        type: 2,
        area: [w+'px', h +'px'],
        fix: false, //不固定
        maxmin: true,
        shade:0.4,
        title: title,
        content: url
    });
}
/*关闭弹出框口*/
function layer_close(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
$(function(){
    getskincookie();
    //layer.config({extend: 'extend/layer.ext.js'});
    Huiasidedisplay();
    var resizeID;
    $(window).resize(function(){
        clearTimeout(resizeID);
        resizeID = setTimeout(function(){
            Huiasidedisplay();
        },500);
    });

    $(".nav-toggle").click(function(){
        $(".Hui-aside").slideToggle();
    });
    $(".Hui-aside").on("click",".menu_dropdown dd li a",function(){
        if($(window).width()<768){
            $(".Hui-aside").slideToggle();
        }
    });
    /*左侧菜单*/
    $.Huifold(".menu_dropdown dl#menu-article dt", ".menu_dropdown dl dd", "fast", 1, "click");
    $.Huisubfold(".menu_dropdown dl#menu-article dd li.has-sub", ".menu_dropdown dl dd li.has-sub ul", "fast", "click");
    /*选项卡导航*/

    $(".Hui-aside").on("click",".menu_dropdown a",function(){
        Hui_admin_tab(this);
    });

    $(document).on("click","#min_title_list li",function(){
        var bStopIndex=$(this).index();
        var iframe_box=$("#iframe_box");
        $("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
        iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
    });
    $(document).on("click","#min_title_list li i",function(){
        var aCloseIndex=$(this).parents("li").index();
        $(this).parent().remove();
        $('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
        num==0?num=0:num--;
        tabNavallwidth();
    });
    $(document).on("dblclick","#min_title_list li",function(){
        var aCloseIndex=$(this).index();
        var iframe_box=$("#iframe_box");
        if(aCloseIndex>0){
            $(this).remove();
            $('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
            num==0?num=0:num--;
            $("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
            iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
            tabNavallwidth();
        }else{
            return false;
        }
    });
    tabNavallwidth();

    $('#js-tabNav-next').click(function(){
        num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
        toNavPos();
    });
    $('#js-tabNav-prev').click(function(){
        num==0?num=0:num--;
        toNavPos();
    });

    function toNavPos(){
        oUl.stop().animate({'left':-num*100},100);
    }

    /*换肤*/
    $("#Hui-skin .dropDown-menu a").click(function(){
        var v = $(this).attr("data-val");
        setCookie("Huiskin", v);
        var hrefStr=$("#skin").attr("href");
        var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';

        $(window.frames.document).contents().find("#skin").attr("href",hrefRes);
        //$("#skin").attr("href",hrefResd);
    });
});

var handlePageContentView = function() {
    "use strict";
    $.when($("#page-loader").addClass("hide")).done(function() {
        $("#page-container").addClass("in")
    })
};
var handleAfterPageLoadAddClass = function() {
    if ($("[data-pageload-addclass]").length !== 0) {
        $(window).load(function() {
            $("[data-pageload-addclass]").each(function() {
                var e = $(this).attr("data-pageload-addclass");
                $(this).addClass(e)
            })
        })
    }
};
var handlePanelAction = function() {
    "use strict";
    $("[data-click=panel-remove]").click(function(e) {
        e.preventDefault();
        $(this).closest(".panel").remove()
    });
    $("[data-click=panel-collapse]").click(function(e) {
        e.preventDefault();
        $(this).closest(".panel").find(".panel-body").slideToggle()
    });
    $("[data-click=panel-reload]").click(function(e) {
        e.preventDefault();
        var t = $(this).closest(".panel");
        if (!$(t).hasClass("panel-loading")) {
            var n = $(t).find(".panel-body");
            var r = '<div class="panel-loader"><span class="spinner-small"></span></div>';
            $(t).addClass("panel-loading");
            $(n).prepend(r);
            setTimeout(function() {
                $(t).removeClass("panel-loading");
                $(t).find(".panel-loader").remove()
            },
            2e3)
        }
    });
    $("[data-click=panel-expand]").click(function(e) {
        e.preventDefault();
        var t = $(this).closest(".panel");
        var n = $(t).find(".panel-body");
        var r = 40;
        if ($(n).length !== 0) {
            var i = $(t).offset().top;
            var s = $(n).offset().top;
            r = s - i
        }
        if ($("body").hasClass("panel-expand") && $(t).hasClass("panel-expand")) {
            $("body, .panel").removeClass("panel-expand");
            $(".panel").removeAttr("style");
            $(n).removeAttr("style")
        } else {
            $("body").addClass("panel-expand");
            $(this).closest(".panel").addClass("panel-expand");
            if ($(n).length !== 0 && r != 40) {
                var o = 40;
                $(t).find(" > *").each(function() {
                    var e = $(this).attr("class");
                    if (e != "panel-heading" && e != "panel-body") {
                        o += $(this).height() + 30
                    }
                });
                if (o != 40) {
                    $(n).css("top", o + "px")
                }
            }
        }
        $(window).trigger("resize")
    })
};

function panelLoading(obj) {
    "use strict";
    var t = $(obj).closest(".panel");
    if (t.length == 0) {
        t = $(obj).closest(".tab-content");
        if (!$(t).hasClass("panel-loading")) {
            var r = '<div class="panel-loader"><span class="spinner-small"></span></div>';
            $(t).addClass("panel-loading");
            $(t).prepend(r);
        }
    } else {
        if (!$(t).hasClass("panel-loading")) {
            var n = $(t).children(".panel-body");
            var r = '<div class="panel-loader"><span class="spinner-small"></span></div>';
            $(t).addClass("panel-loading");
            $(n).prepend(r);
        }
    }
};

function panelLoaded(obj) {
    "use strict";
    var t = $(obj).closest(".panel");
    if (t.length == 0) {
        t = $(obj).closest(".tab-content");
        if ($(t).hasClass("panel-loading")) {
            $(t).removeClass("panel-loading");
            $(t).find(".panel-loader").remove()
        }
    } else {
        if ($(t).hasClass("panel-loading")) {
            $(t).removeClass("panel-loading");
            $(t).find(".panel-loader").remove()
        }
    }
};

var renderSwitcher = function (switchlist) {
    var green = "#00acac"
      , red = "#ff5b57"
      , blue = "#348fe2"
      , purple = "#727cb6"
      , orange = "#f59c1a"
      , black = "#2d353c";
    if ($("[data-render=switchery]").length !== 0) {
        $("[data-render=switchery]").each(function () {
            var e = green;
            if ($(this).attr("data-theme")) {
                switch ($(this).attr("data-theme")) {
                    case "red":
                        e = red;
                        break;
                    case "blue":
                        e = blue;
                        break;
                    case "purple":
                        e = purple;
                        break;
                    case "orange":
                        e = orange;
                        break;
                    case "black":
                        e = black;
                        break
                }
            }
            var t = {};
            t.color = e;
            t.secondaryColor = $(this).attr("data-secondary-color") ? $(this).attr("data-secondary-color") : "#dfdfdf";
            t.className = $(this).attr("data-classname") ? $(this).attr("data-classname") : "switchery";
            t.disabled = $(this).attr("data-disabled") ? true : false;
            t.disabledOpacity = $(this).attr("data-disabled-opacity") ? $(this).attr("data-disabled-opacity") : .5;
            t.speed = $(this).attr("data-speed") ? $(this).attr("data-speed") : "0.5s";
            var n = new Switchery(this, t);
            if ($.inArray($(n.element).data('id'), switchlist) >= 0) {
                n.setPosition(true);
            }
        }
        )
    }
};

var App = function() {
    "use strict";
    return {
        init: function() {
        	handleSidebarMinify();
        	handleAfterPageLoadAddClass();
        	handlePanelAction();
            handlePageContentView()
        }
    }
} ();
