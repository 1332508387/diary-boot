$(function(){
	$("img.private-idv-avater-default").on("error",function(){
		$(this).attr("src",rootPath+"/images/peruser.png");
		this.onerror=null;
	});

	$("img.private-com-avater-default").on("error",function(){
		$(this).attr("src",rootPath+"/images/comuser.png");
		this.onerror=null;
	});
	
	$("#header-search-btn-id").click(function(){
		
		$("#header-search-input-id").each(function(){
			if($(this).hasClass("on")){
				$("#header-search-form-id").submit();
				//var purl = $(this).attr("purl");
				//window.location.href=purl+$(this).val();
			}else{
				$(this).addClass("on");
				$(this).focus()
			}
			
		});
	});
	
	$("#header-search-input-id").blur(function(){
		$(this).removeClass("on");
	});
	
	$("#header-search-input-id").keyEnter(function(){
		$("#header-search-btn-id").click();
	});
});


(function($, undefined) {

	var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;
	$.cleanData = function(elems) {
		for (var i = 0, elem; (elem = elems[i]) != null; i++) {
			try {
				$(elem).triggerHandler("remove");

			} catch (e) {
			}
		}
		_cleanData(elems);
	};

	$.cecp = function(name, base, prototype) {
		var fullName, existingConstructor, constructor, basePrototype, namespace = name
				.split(".")[0];

		name = name.split(".")[1];
		fullName = namespace + "-" + name;

		if (!prototype) {
			prototype = base;
			base = $.Cecp;
		}

		// create selector for plugin
		$.expr[":"][fullName.toLowerCase()] = function(elem) {
			return !!$.data(elem, fullName);
		};

		$[namespace] = $[namespace] || {};
		existingConstructor = $[namespace][name];
		constructor = $[namespace][name] = function(options, element) {
			// allow instantiation without "new" keyword
			if (!this._createCecp) {
				return new constructor(options, element);
			}

			// allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if (arguments.length) {
				this._createCecp(options, element);
			}
		};
		// extend with the existing constructor to carry over any static
		// properties
		$.extend(constructor, existingConstructor, {
					version : prototype.version,
					// copy the object used to create the prototype in case we
					// need to

					_proto : $.extend({}, prototype),

					_childConstructors : []
				});

		basePrototype = new base();
		// we need to make the options hash a property directly on the new
		// instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.cecp.extend({}, basePrototype.options);
		$.each(prototype, function(prop, value) {
			if ($.isFunction(value)) {
				prototype[prop] = (function() {
					var _super = function() {
						return base.prototype[prop].apply(this, arguments);
					}, _superApply = function(args) {
						return base.prototype[prop].apply(this, args);
					};
					return function() {
						var __super = this._super, __superApply = this._superApply, returnValue;

						this._super = _super;
						this._superApply = _superApply;

						returnValue = value.apply(this, arguments);

						this._super = __super;
						this._superApply = __superApply;

						return returnValue;
					};
				})();
			}
		});
		constructor.prototype = $.cecp.extend(basePrototype, {

					// always use the name + a colon as the prefix, e.g.,
					// draggable:start

					cecpEventPrefix : existingConstructor
							? basePrototype.cecpEventPrefix
							: name
				}, prototype, {
					constructor : constructor,
					namespace : namespace,
					cecpName : name,
					cecpBaseClass : fullName,
					cecpFullName : fullName
				});

		if (existingConstructor) {
			$.each(existingConstructor._childConstructors, function(i, child) {
						var childPrototype = child.prototype;

						// originally used, but inherit from the new version of
						// the base
						$.cecp(childPrototype.namespace + "."
										+ childPrototype.cecpName,
								constructor, child._proto);
					});
			// remove the list of existing child constructors from the old
			// constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else {
			base._childConstructors.push(constructor);
		}

		$.cecp.bridge(name, constructor);
	};

	$.cecp.extend = function(target) {
		var input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length, key, value;
		for (; inputIndex < inputLength; inputIndex++) {
			for (key in input[inputIndex]) {
				value = input[inputIndex][key];
				if (input[inputIndex].hasOwnProperty(key)
						&& value !== undefined) {
					// Clone objects
					if ($.isPlainObject(value)) {
						target[key] = $.isPlainObject(target[key]) ? $.cecp
								.extend({}, target[key], value) :
								// Don't extend strings, arrays, etc. with
								// objects
								$.cecp.extend({}, value);
						// Copy everything else by reference
					} else {
						target[key] = value;
					}
				}
			}
		}
		return target;
	};

	$.cecp.bridge = function(name, object) {
		var fullName = object.prototype.cecpFullName || name;
		$.fn[name] = function(options) {
			var isMethodCall = typeof options === "string", args = slice.call(
					arguments, 1), returnValue = this;

			// allow multiple hashes to be passed on init
			options = !isMethodCall && args.length ? $.cecp.extend.apply(
					null, [options].concat(args)) : options;

			if (isMethodCall) {
				this.each(function() {
					var methodValue, instance = $(this).data(fullName);// $.data(
																		// this,
																		// fullName
																		// );
					if (!instance) {
						return $.error("cannot call methods on " + name
								+ " prior to initialization; "
								+ "attempted to call method '" + options + "'");
					}
					if (!$.isFunction(instance[options])
							|| options.charAt(0) === "_") {
						return $.error("no such method '" + options + "' for "
								+ name + " instance");
					}
					methodValue = instance[options].apply(instance, args);
					if (methodValue !== instance && methodValue !== undefined) {
						returnValue = methodValue && methodValue.jquery
								? returnValue.pushStack(methodValue.get())
								: methodValue;
						return false;
					}
				});
			} else {
				this.each(function() {
							var instance = $(this).data(fullName);// $.data(
																	// this,
																	// fullName
																	// );
							if (instance) {
								instance.option(options || {})._init();
							} else {
								$(this).data(fullName,
										new object(options, this));
								// $.data( this, fullName, new object( options,
								// this ) );
							}
						});
			}

			return returnValue;
		};
	};

	$.Cecp = function( /* options, element */) {
	};
	$.Cecp._childConstructors = [];

	$.Cecp.prototype = {
		cecpName : "cecp",
		cecpEventPrefix : "",
		defaultElement : "<div>",
		options : {
			disabled : false,

			create : null
		},
		_createCecp : function(options, element) {
			element = $(element || this.defaultElement || this)[0];
			this.element = $(element);
			this.uuid = uuid++;
			this.eventNamespace = "." + this.cecpName + this.uuid;
			this.options = $.cecp.extend({}, this.options, this
							._getCreateOptions(), options);

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();

			if (element !== this) {

				$.data(element, this.cecpName, this);
				$.data(element, this.cecpFullName, this);
				this._on(true, this.element, {
							remove : function(event) {
								if (event.target === element) {
									this.destroy();
								}
							}
						});
				this.document = $(element.style ?

				element.ownerDocument :

				element.document || element);
				this.window = $(this.document[0].defaultView
						|| this.document[0].parentWindow);
			}

			this._create();
			this._trigger("create", null, this._getCreateEventData());
			this._init();
		},
		_getCreateOptions : $.noop,
		_getCreateEventData : $.noop,
		_create : $.noop,
		_init : $.noop,

		destroy : function() {
			this._destroy();

			this.element.unbind(this.eventNamespace)

			.removeData(this.cecpName).removeData(this.cecpFullName)

			.removeData($.camelCase(this.cecpFullName));
			this.cecp().unbind(this.eventNamespace)
					.removeAttr("aria-disabled")
					.removeClass(this.cecpFullName + "-disabled "
									+ "ui-state-disabled");

			this.bindings.unbind(this.eventNamespace);
			this.hoverable.removeClass("ui-state-hover");
			this.focusable.removeClass("ui-state-focus");
		},
		_destroy : $.noop,

		cecp : function() {
			return this.element;
		},

		option : function(key, value) {
			var options = key, parts, curOption, i;

			if (arguments.length === 0) {

				return $.cecp.extend({}, this.options);
			}

			if (typeof key === "string") {

				options = {};
				parts = key.split(".");
				key = parts.shift();
				if (parts.length) {
					curOption = options[key] = $.cecp.extend({},
							this.options[key]);
					for (i = 0; i < parts.length - 1; i++) {
						curOption[parts[i]] = curOption[parts[i]] || {};
						curOption = curOption[parts[i]];
					}
					key = parts.pop();
					if (value === undefined) {
						return curOption[key] === undefined
								? null
								: curOption[key];
					}
					curOption[key] = value;
				} else {
					if (value === undefined) {
						return this.options[key] === undefined
								? null
								: this.options[key];
					}
					options[key] = value;
				}
			}

			this._setOptions(options);

			return this;
		},
		_setOptions : function(options) {
			var key;

			for (key in options) {
				this._setOption(key, options[key]);
			}

			return this;
		},
		_setOption : function(key, value) {
			this.options[key] = value;

			if (key === "disabled") {
				this.cecp().toggleClass(
						this.cecpFullName + "-disabled ui-state-disabled",
						!!value).attr("aria-disabled", value);
				this.hoverable.removeClass("ui-state-hover");
				this.focusable.removeClass("ui-state-focus");
			}

			return this;
		},

		enable : function() {
			return this._setOption("disabled", false);
		},
		disable : function() {
			return this._setOption("disabled", true);
		},

		_on : function(suppressDisabledCheck, element, handlers) {
			var delegateElement, instance = this;

			if (typeof suppressDisabledCheck !== "boolean") {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			if (!handlers) {
				handlers = element;
				element = this.element;
				delegateElement = this.cecp();
			} else {

				element = delegateElement = $(element);
				this.bindings = this.bindings.add(element);
			}

			$.each(handlers, function(event, handler) {
				function handlerProxy() {

					if (!suppressDisabledCheck
							&& (instance.options.disabled === true || $(this)
									.hasClass("ui-state-disabled"))) {
						return;
					}
					return (typeof handler === "string"
							? instance[handler]
							: handler).apply(instance, arguments);
				}

				if (typeof handler !== "string") {
					handlerProxy.guid = handler.guid = handler.guid
							|| handlerProxy.guid || $.guid++;
				}

				var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1]
						+ instance.eventNamespace, selector = match[2];
				if (selector) {
					delegateElement.delegate(selector, eventName, handlerProxy);
				} else {
					element.bind(eventName, handlerProxy);
				}
			});
		},

		_off : function(element, eventName) {
			eventName = (eventName || "").split(" ").join(this.eventNamespace
					+ " ")
					+ this.eventNamespace;
			element.unbind(eventName).undelegate(eventName);
		},

		_delay : function(handler, delay) {
			function handlerProxy() {
				return (typeof handler === "string"
						? instance[handler]
						: handler).apply(instance, arguments);
			}
			var instance = this;
			return setTimeout(handlerProxy, delay || 0);
		},

		_hoverable : function(element) {
			this.hoverable = this.hoverable.add(element);
			this._on(element, {
						mouseenter : function(event) {
							$(event.currentTarget).addClass("ui-state-hover");
						},
						mouseleave : function(event) {
							$(event.currentTarget)
									.removeClass("ui-state-hover");
						}
					});
		},

		_focusable : function(element) {
			this.focusable = this.focusable.add(element);
			this._on(element, {
						focusin : function(event) {
							$(event.currentTarget).addClass("ui-state-focus");
						},
						focusout : function(event) {
							$(event.currentTarget)
									.removeClass("ui-state-focus");
						}
					});
		},

		_trigger : function(type, event, data) {
			var prop, orig, callback = this.options[type];

			data = data || {};
			event = $.Event(event);
			event.type = (type === this.cecpEventPrefix
					? type
					: this.cecpEventPrefix + type).toLowerCase();

			event.target = this.element[0];

			orig = event.originalEvent;
			if (orig) {
				for (prop in orig) {
					if (!(prop in event)) {
						event[prop] = orig[prop];
					}
				}
			}

			this.element.trigger(event, data);
			return !($.isFunction(callback)
					&& callback.apply(this.element[0], [event].concat(data)) === false || event
					.isDefaultPrevented());
		}
	};

	$.each({
				show : "fadeIn",
				hide : "fadeOut"
			}, function(method, defaultEffect) {
				$.Cecp.prototype["_" + method] = function(element, options,
						callback) {
					if (typeof options === "string") {
						options = {
							effect : options
						};
					}
					var hasOptions, effectName = !options
							? method
							: options === true || typeof options === "number"
									? defaultEffect
									: options.effect || defaultEffect;
					options = options || {};
					if (typeof options === "number") {
						options = {
							duration : options
						};
					}
					hasOptions = !$.isEmptyObject(options);
					options.complete = callback;
					if (options.delay) {
						element.delay(options.delay);
					}
					if (hasOptions
							&& $.effects
							&& ($.effects.effect[effectName] || $.uiBackCompat !== false
									&& $.effects[effectName])) {
						element[method](options);
					} else if (effectName !== method && element[effectName]) {
						element[effectName](options.duration, options.easing,
								callback);
					} else {
						element.queue(function(next) {
									$(this)[method]();
									if (callback) {
										callback.call(element[0]);
									}
									next();
								});
					}
				};
			});

	// DEPRECATED
	if ($.uiBackCompat !== false) {
		$.Cecp.prototype._getCreateOptions = function() {
			return $.metadata
					&& $.metadata.get(this.element[0])[this.cecpName];
		};
	}

})(jQuery);


/**
 * @api {js} jQuery.isNumber(str) isNumber(验证数字格式)
 * @apiName isNumber 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是有效数字格式
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是有效的数字;false 不是有效的数字
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("12345")){
 *  	alert("是有效的数字");
 *  }else{
 *  	alert("不是有效的数字");
 *  }
 *  
 */
jQuery.isNumber = function(str){
	var reg = /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/;
	return reg.test(str+"");
};

/**
 * @api {js} jQuery.isNumber(str) isNumber(验证正整数字格式)
 * @apiName isNumberZ 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是有效数字格式
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是有效的数字;false 不是有效的数字
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("12345")){
 *  	alert("是有效的数字");
 *  }else{
 *  	alert("不是有效的数字");
 *  }
 *  
 */
jQuery.isNumberZ = function(str){
	var reg = /^^[1-9]\d*$/;
	return reg.test(str+"");
};

/**
 * @api {js} jQuery.isDateStr(str) isDateStr(验证日期格式)
 * @apiName isDateStr 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是有效日期字符串格式
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是有效的日期字符串;false 不是有效的日期字符串
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("2016-01-01")){
 *  	alert("是有效的日期字符串");
 *  }else{
 *  	alert("不是有效的日期字符串");
 *  }
 *  
 */
jQuery.isDateStr=function(str){
	var reg = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
	return reg.test(str);
};

/**
 * @api {js} jQuery.isUrl(str) isUrl(验证url格式)
 * @apiName isUrl 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是一个url
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串
 * @apiSuccess {boolean} return true 是一个url;false 不是一个url
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("是一个url");
 *  }else{
 *  	alert("不是一个url");
 *  }
 *  
 */
jQuery.isUrl = function(str){
	var reg = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    return reg.test(str+"");
};

/**
 * @api {js} jQuery.isCardNo(str) isCardNo(验证身份证格式)
 * @apiName isCardNo 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是符合身份证格式
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串
 * @apiSuccess {boolean} return true 符合身份证格式;false 不符合身份证格式
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("符合身份证格式");
 *  }else{
 *  	alert("不符合身份证格式");
 *  }
 *  
 */
jQuery.isCardNo = function(v) {
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return reg.test(v);
};

/**
 * @api {js} jQuery.isMoney(num) isMoney(验证价格格式)
 * @apiName isMoney 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否是符合价格证格式
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} num 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 符合价格格式;false 不符合价格证格式
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber(100)){
 *  	alert("符合价格格式");
 *  }else{
 *  	alert("不符合价格格式");
 *  }
 *  
 */
jQuery.isMoney=function(v){
	var reg = /^(([1-9])\d*.[0-9]+|([1-9])\d*)$/;
	return reg.test(v);
};


/**
 * @api {js} jQuery.isSpecialChar(str) isSpecialChar(验证是否含特殊字符)
 * @apiName isSpecialChar 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否含特殊字符
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 含有特殊字符;false 不含有特殊字符
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("含有特殊字符");
 *  }else{
 *  	alert("不含有特殊字符");
 *  }
 *  
 */
jQuery.isSpecialChar = function(v){
	var reg = /[~#^$@%&!*:\,._]/gi;
	return reg.test(v);
};

/**
 * @api {js} jQuery.isZZNum(num) isZZNum(非负整数判断)
 * @apiName isZZNum 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否非负整数
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} num 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是非负整数;false 不是非负整数
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("是非负整数");
 *  }else{
 *  	alert("不是非负整数");
 *  }
 *  
 */
jQuery.isZZNum = function(v){
	var reg = /^(([1-9])\d*|0{1})$/;
	return reg.test(v);
};

/**
 * @api {js} jQuery.isLetterNumber(num) isLetterNumber(是否只有字母和数字组成)
 * @apiName isLetterNumber 
 * @apiGroup jQuery-is
 * @apiDescription 验证入参是否只有字母和数字组成
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} num 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是只有字母和数字组成;false 不是只有字母和数字组成
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("是只有字母和数字组成");
 *  }else{
 *  	alert("不是只有字母和数字组成");
 *  }
 *  
 */
jQuery.isLetterNumber = function(v) {
	var reg = /^[0-9a-zA-Z]+$/;
	return reg.test(v);
};

/**
 * @api {js} jQuery.isEmpty(str) isEmpty(字符串是否为空)
 * @apiName isLetterNumber 
 * @apiGroup jQuery-is
 * @apiDescription 验证字符串v是否为空（null 或者 空字符串——""）
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 空字符串;false 非空字符串
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("http://www.baidu.com")){
 *  	alert("是空字符串");
 *  }else{
 *  	alert("不空字符串");
 *  }
 *  
 */
jQuery.isEmpty = function(v) {
	if (v == null || $.trim(v) == "") {
		return true;
	} else {
		return false;
	}
};

/**
 * @api {js} jQuery.isTelphone(str) isTelphone(验证固定电话)
 * @apiName isTelphone 
 * @apiGroup jQuery-is
 * @apiDescription 验证固定电话
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是固定电话;false 不是固定电话
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber(15200005056)){
 *  	alert("是固定电话");
 *  }else{
 *  	alert("不是固定电话");
 *  }
 *  
 */
jQuery.isTelphone = function(v){
	//var reg = /^0\d{2,3}-?\d{7,8}$/;
	var reg = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
	return reg.test(v);
};


jQuery.isFax = function(v){
	var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
	return reg.test(v);
};


/**
 * @api {js} jQuery.isPhone(str) isPhone(验证移动电话)
 * @apiName isPhone 
 * @apiGroup jQuery-is
 * @apiDescription 验证移动电话
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是移动电话;false 不是移动电话
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber(15200005056)){
 *  	alert("是移动电话");
 *  }else{
 *  	alert("不是移动电话");
 *  }
 *  
 */
jQuery.isPhone = function(v) {
	var reg = /^(12[0-9]|13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
	return reg.test(v);
};

/**
 * @api {js} jQuery.isEmail(str) isEmail(验证邮箱地址)
 * @apiName isEmail 
 * @apiGroup jQuery-is
 * @apiDescription 验证邮箱地址
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要被验证的字符串或者数字
 * @apiSuccess {boolean} return true 是邮箱地址;false 不是邮箱地址
 * @apiExample {js} 示例:
 * 
 *  if($.isNumber("163@163.com")){
 *  	alert("是邮箱地址");
 *  }else{
 *  	alert("不是邮箱地址");
 *  }
 *  
 */
jQuery.isEmail = function(v) {
	var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return reg.test(v);
};


/**
 * @api {js} jQuery.getLength(str) getLength(获取字符串长度)
 * @apiName getLength 
 * @apiGroup jQuery-get
 * @apiDescription 获取字符串长度
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} str 需要获取长度的字符串
 * @apiSuccess {number} return 字符串长度（1个中文字符=2个字节）
 * @apiExample {js} 示例:
 * 
 *  var nlen = $.getLength("需要获取长度字符串");
 *  
 */
jQuery.getLength = function(v) {
	if ($.isEmpty(v)) {
		return 0;
	} else {
		return v.replace(/[^\x00-\xff]/ig, "**").length;
	}
};




/**
 * @api {js} jQuery.iFormatDate(s) iFormatDate(日期格式化)
 * @apiName iFormatDate 
 * @apiGroup jQuery-format
 * @apiDescription 日期格式化
 * @apiVersion 1.0.0
 * 
 * @apiParam {number} time 时间戳
 * @apiParam {string} pattern 日期格式 缺省值"yyyy-MM-dd hh:mm:ss"
 * 
 * @apiSuccess {string} return 格式化后的日期字符串
 * @apiExample {js} 示例:
 * 
 *  var str = $.iFormatDate({
 *  				time:1457600527725,
 *  				pattern: "yyyy-MM-dd hh:mm:ss"
 *  				});
 *  
 */
jQuery.iFormatDate = function(s) {
	var d;
	var pattern;
	if (typeof(s) == "number") {
		d = new Date(parseInt(s));
		s = {};
	} else if (typeof(s.time) == "number" || typeof(s.time) == "string") {
		d = new Date(parseInt(s.time));
	} else if (typeof(s.time) == "object") {
		d = new Date(parseInt(s.time.time));
	} else {
		d = new Date();
	}

	pattern = s.pattern || "yyyy-MM-dd hh:mm:ss";

	var y = d.getFullYear();
	var MM = d.getMonth() + 1;
	var dd = d.getDate();
	var hh = d.getHours();
	var mm = d.getMinutes();
	var ss = d.getSeconds();

	return format(y, MM, dd, hh, mm, ss, pattern);

	function format(y, M, d, h, m, s, pattern) {

		var yy = (y + "").substring(2);
		var MM = M;
		var dd = d;
		var hh = h;
		var mm = m;
		var ss = s;

		if (MM < 10) {
			MM = "0" + MM;
		}
		if (dd < 10) {
			dd = "0" + dd;
		}
		if (hh < 10) {
			hh = "0" + hh;
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (ss < 10) {
			ss = "0" + ss;
		}

		pattern = pattern.replace(/[y]{4}/g, y);
		pattern = pattern.replace(/[y]{2}/g, yy);
		pattern = pattern.replace(/[M]{2}/g, MM);
		pattern = pattern.replace(/[M]{1}/g, M);
		pattern = pattern.replace(/[d]{2}/g, dd);
		pattern = pattern.replace(/[d]{1}/g, d);
		pattern = pattern.replace(/[h]{2}/g, hh);
		pattern = pattern.replace(/[h]{1}/g, h);
		pattern = pattern.replace(/[m]{2}/g, mm);
		pattern = pattern.replace(/[m]{1}/g, m);
		pattern = pattern.replace(/[s]{2}/g, ss);
		pattern = pattern.replace(/[s]{1}/g, s);

		return pattern;
	}
};


/**
 * @api {js} jQuery.iFeedTimeF(s) iFeedTimeF(消息化日期格式化)
 * @apiName iFeedTimeF 
 * @apiGroup jQuery-format
 * @apiDescription 日期格式化
 * @apiVersion 1.0.0
 * 
 * @apiParam {number} time 数据时间戳
 * @apiParam {string} pattern 日期格式 缺省值"yyyy-MM-dd hh:mm:ss"
 * @apiParam {number} nowTime 当前服务器时间戳 缺省 则获取当前用户终端（浏览器所在系统）的时间
 * 
 * @apiSuccess {string} return 格式化后的日期字符串
 * @apiExample {js} 示例:
 * 
 *  var str = $.iFeedTimeF({
 *  			dtime:1457600527725,
 *  			nowTime:1457600527725,
 *  			pattern: "yyyy-MM-dd hh:mm:ss"
 *  			});
 *  
 */
jQuery.iFeedTimeF = function(s){
	if(s==null || s.dtime==null){
		return "";
	}
	if($.isEmpty(s.nowTime)){
		s.nowTime = 0;
	}
	s.nowTime = s.nowTime ||new Date().getTime();
	s.time = s.nowTime-s.dtime;
	s.time = parseInt(s.time/1000);
	if(s.time<10){
		return "刚刚";
	}else if(s.time<60){
		return s.time+"秒前";
	}else if(s.time<3600){
		s.time = Math.ceil(s.time/60.0);
		return s.time+"分前";
	}else{
		s.time = Math.round(s.time/3600.0);
		if(s.time<24){
			return s.time+"小时前";
		}else{
			return $.iFormatDate({time:s.dtime,pattern: s.pattern});
		}
		
	}
};

/**
 * @api {js} jQuery.setICookie(name,value,path,Days) setICookie(设置写入cookie)
 * @apiName setICookie 
 * @apiGroup jQuery-cookie
 * @apiDescription 设置写入一对cookie
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} name 设置写入cookie的名
 * @apiParam {string} value 设置写入cookie的值
 * @apiParam {string} path 设置写入cookie的路径
 * @apiParam {number} Days 设置写入cookie保存的天数
 * 
 * @apiExample {js} 示例:
 * 
 *  $.setICookie("UID","sdfsdf11","/",1);
 *  
 */
jQuery.setICookie = function(name, value, path, Days) {
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	var pstr = (path != null && path != "") ? (";path=" + path) : "";
	exp = Days != null ? (";expires=") + exp.toGMTString() : "";
	document.cookie = name + "=" + escape(value) + exp + pstr;

};

/**
 * @api {js} jQuery.getICookie(name) getICookie(读取cookie)
 * @apiName getICookie 
 * @apiGroup jQuery-cookie
 * @apiDescription 读取name对应的cookie值
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} name 要读取的cookie的名
 * 
 * @apiSuccess {string} return 读取到的name对应的cookie的值
 * @apiExample {js} 示例:
 * 
 *  var str = $.getICookie("UID");
 *  
 */
jQuery.getICookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
};

/**
 * @api {js} jQuery.delICookie(name) delICookie(删除cookie)
 * @apiName delICookie 
 * @apiGroup jQuery-cookie
 * @apiDescription 删除name对应的cookie
 * @apiVersion 1.0.0
 * 
 * @apiParam {string} name 要删除的cookie的名
 * 
 * @apiExample {js} 示例:
 *  $.delICookie("UID");
 */
jQuery.delICookie = function(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = jQuery.getYKCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};


/**
 * @api {js} jQuery.logout() logout(退出静态方法)
 * @apiName logout 
 * @apiGroup jQuery
 * @apiDescription 退出当前登录状态
 * @apiVersion 1.0.0
 * @apiExample {js} 示例:
 * 
 *  $.logout();
 *  
 */
jQuery.logout=function(){
	//清除本地存储中保存的用户名和密码后再退出
	var storage = window.localStorage;
	storage.removeItem("autologin_userName");
	storage.removeItem("autologin_password");
	
	location.href = $.cec.loginPath + "/logout.do";
};

/**
 * 克隆对象o的一个副本
 * @param o 需要被克隆的对象
 * @reutrn 克隆出的副本
 */

/**
 * @api {js} jQuery.objectClone(obj) objectClone(克隆对象)
 * @apiName objectClone 
 * @apiGroup jQuery
 * @apiDescription 克隆对象o的一个副本
 * @apiVersion 1.0.0
 * 
 * @apiParam {object} o 被克隆的对象
 * 
 * @apiSuccess {object} return 克隆生成的对象
 * 
 * @apiExample {js} 示例:
 *  
 *  var o = $.objectClone({name:"1123"});
 *  
 */
jQuery.objectClone = function(o){
	var o1= {};
	if(o && typeof o == "object"){
		var v;
		for(var k in o){
			v = o[k];
			if(typeof v == "object"){
				v = $.objectClone(v);
			}
			o1[k]=v;
		}
	}
	
	return o1;
};

/**
 * 百分比验证小于100的两位小数如：30.20%
 */
jQuery.isDouble = function(str){
	var reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/;
	return reg.test(str+"");
};

/**
 * 验证数字或小数点后面两位小数
 */
jQuery.isDoubleCheck = function(str){
	var reg = /^((\d*[0-9])|([0-9]+\.\d{1,2}))$/;
	return reg.test(str+"");
};

/**
 * 序列化url参数部分
 * 将参数部分作为json 对象返回
 * 其中 #后面部分 为此json 对象的 _hashO 属性
 */
jQuery.getYKArgs = function() {
	var args = {};
	var query = location.search.substring(1);
	var pairs = query.split("&");
	var pairstem, pos, argname, argvalue;
	for (var i = 0, len = pairs.length; i < len; i++) {
		pairstem = pairs[i];
		pos = pairstem.indexOf("=");
		if (pos == -1)
			continue;
		argname = pairstem.substring(0, pos);
		argvalue = pairstem.substring(pos + 1);
		argvalue = decodeURIComponent(argvalue);
		if(args[argname]){
			if(args[argname] instanceof Array){
				args[argname].push(argvalue);
			}else{
				args[argname] = [args[argname],argvalue];
			}
		
		}else{
			args[argname] = argvalue;
		}
		
	}
	var _hashO = {};
	query = location.hash.substring(1);
	pairs = query.split("&");
	for (var i = 0, len = pairs.length; i < len; i++) {
		pairstem = pairs[i];
		pos = pairstem.indexOf("=");
		if (pos == -1)
			continue;
		argname = pairstem.substring(0, pos);
		argvalue = pairstem.substring(pos + 1);
		_hashO[argname] = argvalue;
	}
	args["_hashO"] = _hashO;
	return args;
};




/**
 * 分页组件
 * var option = {     //pageNo页码       pageSize每页条数   totalCount总条数
					pageNo : pn,
					pageSize : ps,
					totalCount : tcount,
					bindev : function(pno){
						companyBuyerBidList.getProjectListAjax(pno);
					}
			};
			$("#list-page-id").page(option).page("reset");//点击分页触发
 * @param $
 */
(function($) {
	$.cecp("cecplugin.page", {
		options : {
			//分页默认序列数
			count :1,
			totalPages:0,
			totalCount:0,
			pageSize : 0,
			pageNo:1,
			pageType:1,
			
			pageNumList : [],
			//ajax 分页页码绑定click的bindev事件处理， url 分页绑定url
			bindtype : "ajax",
			
			bindev : function(pn){alert("请设置bindev参数");return "url";}

		},
		
		/***********************************************************************
		 * 创建初始化
		 * 
		 * @author xulihua
		 * 
		 */
		_create : function(){
			var self = this,
			o = self.options;
			o.pageNumList = [];
			var $this = self.element;
			if(o.pageSize>0 && o.totalCount>0){
				o.totalPages = parseInt(o.totalCount/o.pageSize);
				if((o.totalCount%o.pageSize)>0){
					o.totalPages++;
				}
				
			}
			if(o.totalPages<1){
				return;
				
			}
			
			/*for(var k in o){
				var klow = k.toLowerCase( );
				klow = $($this).attr(klow);
				if(klow!=null){
					o[k] = klow;
				}
			}*/
			
			if(typeof(o.bindev)=="string"){
				o.userbindev = o.bindev;
				o.bindev = function(pn){
					eval(o.userbindev);
				};
			}
			
			self._dealPageNum();
			
			
			
			self._dealDom();
			
			
		},
		
		reset : function(){
			var self = this,o = self.options,$this = self.element;
			o.pageNumList = new Array();
			$($this).find("[pagecover=pagecover]").remove();
			
			self._create();
			
		},
		
		pageHtml : function(m){
			var html
				if(m.c!="private-no-pn"){
					html = '<a href="javascript:void(0);">'+m.txt+'</a>';
				}else{
					html = '<b class="pn-break">…</b>';
				}
				
			return html;
		},
		
		coverHtml : function(o){
			
			var html = [];
			
			html.push('<div class="page private-pager"><div class="p-wrap " style="margin:0 auto;width:200px;"><span class="p-num" style="margin:0 auto;"><a class="btn btn-lg btn-success" name="page-left" style="width:100px;height:40px;">上一页</a>');
			html.push('<div class="div-num private-page-list" style="display:none"></div><a href="javascript:void(0);" id="next_save" class="btn btn-lg btn-success" name="page-right" style="width:100px;height:40px;">下一页</a></span>');
			html.push('<div class="clear"></div></div></div>');
			
			
//			html.push('<div class="page private-pager"><div class="p-wrap"><span class="p-num fl"><a class="pn-prev" name="page-left"><</a>');
//			html.push('<div class="div-num private-page-list"></div><a href="javascript:void(0);" class="pn-next" name="page-right">></a><a href="javascript:void(0);" class="pn-next" name="page-end">尾页</a></span>');
//			html.push('<span class="p-skip fl"><em>共<b>'+o.totalPages+'</b>页&nbsp;&nbsp; 转到</em><input type="text" value="'+o.totalPages+'"  class="input-txt"><em>页</em>');
//			html.push('<a href="javascript:void(0);" class="btn btn-default" name="v-btn">GO</a></span><div class="clear"></div></div></div>');
			return html.join("");
		},
		
		_pageDom : function(m){
			var o = this.options;
			var $html = $(this.pageHtml(m));
			if(m.pn){
				$($html).attr("pn",m.pn);
			}
			
			$($html).addClass(m.c);
			
			return $html;
		},
		
		_cover : function(){
			var o = this.options;
			var $html = $(this.coverHtml(o));
			$(this.element).remove(".private-pager");
			$(this.element).html($html);
			
			return $(this.element).find(".private-pager");
		},
		
		_dealDom : function(){
			var self = this,o = self.options;
			var cover = self._cover();
			var list = self.options.pageNumList;
			var $list = $(cover).find(".private-page-list");
			for (var i = 0; i < list.length; i++) {
				$($list).append(self._pageDom(list[i]));
			}
			if(o.pageNo==1){
				$(cover).find("[name=page-right]").html("下一页");
				$(cover).find("[name=page-left]").html("").remove();
				findPw.init();
				
			}else{
				if(o.bindtype == "ajax"){
					
					findPw.init();
					$(cover).find("[name=page-left]").click({pself:self},function(e){
						var p = $(this).parent();
						var pn = $(p).parent().find(".page-curr").text();
						pn--;
						if(pn>=1){
							e.data.pself.options.bindev.call(e.data.pself,pn);
						}
						
					});
				}else if(o.bindtype=="url"){
					$(cover).find("[name=page-left]").each(function(){
						var pn = $(this).attr("pn");
						var p = $(this).parent();
						var pn = $(p).parent().find(".page-curr").text();
						pn--;
						if(pn>=1){
							var url = o.bindev.call(self,pn);
							var a = this;
							if(!$(this).is("a")){
								a = $(this).find("a");
							}
							
							if($(a).length>0){
								$(a).attr("href",url);
							}
						}
						
					});
					
				}
				
			}
			
			if(o.pageNo>=o.totalPages){
				$(cover).find("[name=page-right]").html("查看结果");
				$(cover).find("[name=page-right]").click(function(){
					findPw.getMarks();
				});
				
			}else{
				if(o.bindtype=="ajax"){
					$(cover).find("[name=page-right]").click({pself:self},function(e){
						var p = $(this).parent();
						var pn = $(p).parent().find(".page-curr").text();
						pn = pn-0+1;
						if(pn<=e.data.pself.options.totalPages){
							e.data.pself.options.bindev.call(e.data.pself,pn);
						}
						
					});
				}else if(o.bindtype=="url"){
					$(cover).find("[name=page-right]").each(function(){
						var p = $(this).parent();
						var pn = $(p).parent().find(".page-curr").text();
						pn = pn-0+1;
						if(pn<=o.totalPages){
							var url = o.bindev.call(self,pn);
							var a = this;
							if(!$(this).is("a")){
								a = $(this).find("a");
							}
							
							if($(a).length>0){
								$(a).attr("href",url);
							}
						}
						
						
					});
				}
				
			}
			
			if(o.pageNo==o.totalPages){
					$(cover).find("[name=page-end]").addClass("disabled");
			}else{
				$(cover).find("[name=page-end]").click({pself:self},function(e){
					var ops = e.data.pself.options;
					ops.bindev.call(e.data.pself,ops.totalPages);
				});
			}
			
			$(cover).find(".private-no-pn").addClass("v_a");
			
			
			$(cover).find("input:text").bind("inputpncheck",{pself:self},function(e){
				var v = $(this).val();
				if($.isZZNum(v)){
					if(v<=e.data.pself.options.totalPages){
						e.data.pself.options.bindev.call(e.data.pself,v);
					}else{
						alert("跳转的页面不正确");
					}
				}else{
					alert("跳转的页面不正确");
				}
				
			});
			
			//页码转跳确定按钮点击事件
			$(cover).find("[name=v-btn]").click(function(){
				$(this).parent().find("input:text").trigger("inputpncheck",[true]);
			});
			
			
			if(o.bindtype=="ajax"){
				$(cover).find(".private-page").click({pself:self},function(e){
					var pn = $(this).attr("pn");
					e.data.pself.options.bindev.call(e.data.pself,pn);
				});
			}else if(o.bindtype=="url"){
				$(cover).find(".private-page").each(function(){
					var pn = $(this).attr("pn");
					var url = o.bindev.call(self,pn);
					var a = this;
					if(!$(this).is("a")){
						a = $(this).find("a");
					}
					
					if($(a).length>0){
						$(a).attr("href",url);
					}
				});
				
			}
		},
		
		_dealPageNum : function(){
			var o = this.options;
			var pageCount  = parseInt(o.totalPages||0);
			var pageNo = o.pageNo ||1;
			if(pageCount<1 ){
				return ;
			}
			
			if(pageNo==1){
				//o.pageNumList.push({txt:"《",c:"click"});
				//o.pageNumList.push({txt:"&lt;",c:"click"});
			}else{
				//o.pageNumList.push({pn:1,txt:"《",c:"private-page"});
				//o.pageNumList.push({pn:pageNo-1,txt:"&lt;",c:"private-page"});
			}
			
			if(pageNo<3){
				
				for(var i=1,len=(pageCount>3?3:pageCount);i<=len;i++){
					if(i==pageNo){
						//pageList += '<span class="current">'+i+'</span>';
						o.pageNumList.push({txt:i,c:"page-curr"});
						continue;
					}
					//pageList += '<span class="private-page"> '+i+' </span>';
					o.pageNumList.push({pn:i,txt:i,c:"private-page"});
				}
				if(pageCount>3){
					o.pageNumList.push({txt:"...",c:"private-no-pn"});
					o.pageNumList.push({pn:pageCount,txt:pageCount,c:"private-page"});
				}
				
				
			}else{
				o.count = 1;
				if(pageCount>3 || pageCount<=3){
					o.count=pageCount;
				}else if(pageCount<=1){
					o.count=0;
				}
				var pageNo = parseInt(o.pageNo);
				var startIndex =1;
				var startB=false;
				var endB=false;
				
				//页码起始位置计算
				if(o.count>3 && pageNo>3){
					startIndex=pageNo-1;
					startB=true;
				}
				
				//页码结束位置计算
				if(pageCount>=(pageNo+1)){
					o.count=pageNo+1;
					endB=true;
				}
				if(o.count>1){
					
					if(startB){
							o.pageNumList.push({pn:1,txt:1,c:"private-page"});
							//o.pageNumList.push({pn:2,txt:2,c:"private-page"});
							o.pageNumList.push({txt:"...",c:"private-no-pn"});
							//pageList += '<span class="private-page"> '+1+' </span><span>...</span>';
					}	
					for(var i=startIndex;i<=o.count;i++){
						if(i==pageNo){
							//pageList += '<span class="current">'+i+'</span>';
							o.pageNumList.push({txt:i,c:"page-curr"});
							continue;
						}
						//pageList += '<span class="private-page"> '+i+' </span>';
						o.pageNumList.push({pn:i,txt:i,c:"private-page"});
					}
					if(endB){
							/*console.log(pageCount+":"+o.count);*/
							if(pageCount<(o.count+1)){
								//pageList += '<span class="private-page"> '+pageCount+' </span>';
								//o.pageNumList.push({pn:i,txt:i,c:"private-page"});
							}else{
								//pageList += '<span>...</span><span class="private-page"> '+pageCount+' </span>';
								o.pageNumList.push({txt:"...",c:"private-no-pn"});
								o.pageNumList.push({pn:pageCount,txt:pageCount,c:"private-page"});
							}
					}
					
				}else{
					o.pageNumList.push({pn:1,txt:1,c:"private-no-pn page-curr"});
				}
			}
			

			if(pageNo==pageCount){
				//o.pageNumList.push({txt:"&gt;",c:"click"});
				//o.pageNumList.push({txt:"》",c:"click"});
			}else{
				//o.pageNumList.push({pn:pageNo+1,txt:"&gt;",c:"private-page"});
				//o.pageNumList.push({pn:pageCount,txt:"》",c:"private-page"});
			}
			
			
		
		}
	})
	
})(jQuery);


try{
	/**
	 * 前端分页控制显示插件
	 * $element 分页列表元素选择器
	 * pageSize 分页大小
	 * $pnShowDom  显示当前分页的dom 选择器
	 * $pcountShowDom 显示分页总数的dom 选择器
	 * $nextPageBtn 下一页按钮 选择器
	 * $prevPageBtn 前一页按钮 选择器
	 * $iconBtn	分页小图片
	 * $isPage	是否为数字展示分页
	 */
	(function($){
		$.fn.miniPageShow = function(option){
			if(option==null){
				return;
			}
			$(this).each(function(){
				var $ele = $(this).find(option.$element);
				var ps = option.pageSize;
				$($ele).filter(":gt("+(ps-1)+")").hide();
				var len = $($ele).length;
				var pcount = (len%ps)>0?1:0;
				pcount += parseInt(len/ps);
				option.pcount = pcount;
				$(this).data("miniPageShowData",option);
				if(option.$pnShowDom){
					$(this).find(option.$pnShowDom).html(option.pn);
				}
				
				if (option.isPage == -1) {
					$(this).data("miniPageShowData",option).find(option.$iconBtn+'[index='+option.pn+']').addClass("on");
				}
				$(this).find(option.$pcountShowDom).html(pcount);
				
				$(this).bind({
					"changepage" : function(e,pn){
						var data = $(this).data("miniPageShowData");
						var ps = data.pageSize-0;
						var pageele = data.$element;
						var start = ps*(pn-1)-1;
						var end = ps*pn;
						var dom = $(this).find(pageele).hide();
						if(start>0){
							dom = $(dom).filter(":gt("+start+")");
						}
						dom.filter(":lt("+(ps)+")").show();
						
						data.pn=pn;
						if (data.isPage == -1) {
							$(this).data("miniPageShowData",data).find(data.$iconBtn).removeClass("on");
							$(this).data("miniPageShowData",data).find(data.$iconBtn+'[index='+pn+']').addClass("on");
						}else{
							$(this).data("miniPageShowData",data).find(data.$pnShowDom).html(pn);
						}
					},
					"nextpage" : function(){
						var data = $(this).data("miniPageShowData");
						var pn = data.pn-0;
						var pcount = data.pcount-0;
						pn++;
						if(pn>pcount){
							pn = 1;
						}
						
						$(this).trigger("changepage",[pn]);
					},
					"prevpage" : function(){
						var data = $(this).data("miniPageShowData");
						var pn = data.pn-0;
						var pcount = data.pcount-0;
						pn--;
						if(pn<1){
							pn = pcount;
						}
						$(this).trigger("changepage",[pn]);
					}
				});
				
				var $this = this;
				$(this).find(option.$nextPageBtn).click({$this:$this},function(){
					$($this).trigger("nextpage");
				});
				$(this).find(option.$prevPageBtn).click({$this:$this},function(){
					$($this).trigger("prevpage");
				});
			});
		}
	})(jQuery);
}catch(e){
	
}

/**
 * 记录浏览记录
 * $.browseRecord({
 * 		resId:  资源的id
 * 		resType: 资源类型
 * 		resTitle :资源标题
 * 		ip		:访问的ip
 * 		platform：访问平台
 *   });
 */
jQuery.browseRecord = function(data){
	$.ajax({
		url:rootPath+"/ajax/browseRecord/add",	
		type:"post",
		dataType:"json",
		data:data,
		async: false,
		cache : false,
		success:function(json){
			if(json.result==1){//成功
				
			}
		},
		error:function(json){
			
		}
	 });
};


/**
 * 自定义jquery事件--回车事件
 * @param $
 */
(function($) {
	$.fn.keyEnter = function(options) {
		var op = {};
		if (typeof(options) == "function") {
			op.handler = options;
		} else {
			for (var key in options) {
				op[key] = options[key];
			}
		}
		
		$(this).each(function() {
			if (typeof(options) == "function") {
				$(this).keyup({
					o : op
				}, function(e) {
					if (e && e.keyCode == 13) {
						e.data.o.handler.call(e.target, e);
					}
				});
			}
		});
	}
})(jQuery);



/**
 * 添加收藏
 * $.addCollect({
 * 		resId:  资源的id
 * 		resType: 资源类型
 *   });
 */
jQuery.collect = function(data){
	$.ajax({
		url:rootPath+"/ajax/login/user/collect/add",	
		type:"post",
		dataType:"json",
		data:data,
		async: false,
		cache : false,
		success:function(json){
			if(json.result==1){//成功
				
			}else{
				alert(json.mes);
			}
		},
		error:function(json){
			alert(json.mes);
		}
	 });
};

/**
 * tag标签分隔 主要对空格和英文逗号分隔
 */
jQuery.tagSplit = function(str){
	if(str==null){
		return [];
	}
	
	return str.split(/[\s,]+/g);
}


$(window).ajaxSuccess(function(event, XMLHttpRequest, ajaxOptions) {
	 /*console.log(event);
	 console.log(XMLHttpRequest);
	 console.log(ajaxOptions);*/
	var t = XMLHttpRequest.responseText;
	t = $.parseJSON(t);
	if(t.result==-1){
		window.location.href=rootPath+"/user/login";
	}
});


jQuery.isLogin=function(){
	return !$.isEmpty(loginUser.id);
}

