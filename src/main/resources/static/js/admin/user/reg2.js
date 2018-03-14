$(function(){
	reg.init();
	reg2.init();
	reg2.jspinint();
	/**
	 * 验证密码强度调用
	 */
	$("#lpw-id-strong-g span").removeClass("bg3")
	$("#lpw-id-strong span").removeClass("bg3")
	//$('#lpw-id').trigger("keyup",e)
	$('#lpw-id').keyup(function(e) {
	     reg.strongFlag=reg.pwStrongCheck($(this).val());
	     return true;
	});	
	
	$('#lpw-id-g').keyup(function(e) {
	     reg2.strongFlag=reg2.pwStrongCheck($(this).val());
	     return true;
	});	
	$("#btn-id").click(function() {
		if (!reg.submitCheck()) {
			return;
		}
		$.ajax({
			url : rootPath + "/admin/user/doComRegist",
			type : "POST",
			dataType : "json",
			data : $("#registForm").serialize(),
			timeout : 1000,
			cache : false,
			success : function(r) {
				if (r.result == 1) {
					location.href = "/admin";
				} else {
					alert(r.mes);
				}
			}
		});
	});
	$("#smb-id").click(function() {
		if (!reg2.submitCheck()) {
			return;
		}
		$.ajax({
			url : rootPath + "/admin/user/doPerRegist",
			type : "POST",
			dataType : "json",
			data : $("#registForm").serialize(),
			timeout : 1000,
			cache : false,
			success : function(r) {
				if (r.result == 1) {
					location.href = "/admin";
				} else {
					alert(r.mes);
				}
			}
		});
	});
});

var reg ={
	//防止重复提交true 提交中，false 未提交
	strongFlag:1,
	
	init:function(){
		$("#rand-img-id-a").click(function(){
			$("#rand-img-id").trigger("click");
		})
		$("#rand-img-id").click(function(){
			var psrc=$(this).attr("psrc");
			$(this).attr("src",psrc+"?time="+new Date().getTime());
		})
		$(".wrong,.corret").removeClass("on");
		
		$("#company-id").val("");
		$("#org-id").val("");
		$("#email-id").val("");
		$("#lpw-id").val("");
		$("#lpw2-id").val("");
		$("#checkCode-id").val("");
		
		$("#lpw-id-strong span:eq(0)").attr("class","bg0");
		$("#lpw-id-strong span:eq(1)").attr("class","bg0");
		$("#lpw-id-strong span:eq(2)").attr("class","bg0");
		$("#tong-reg i").attr("class","");
		$("#tong-reg").click(function(){
			if($("#tong-reg i").hasClass("on")){
				$("#tong-reg i").attr("class","");
			}else{
				$("#tong-reg i").attr("class","on");
			}
		})
	     
//		$("#btn-id").click(function(){
//			reg.regemailAjax();				
//		});
		$("#company-id").blur(function(){
			var b=reg.nameCheck();
			$("#company-id-i i").removeClass("on");
			if(b){
				$("#company-id-i i:eq(0)").addClass("on");
			}else{
				$("#company-id-i i:eq(1)").addClass("on");
			}
		});
		$("#org-id").blur(function(){
			var b=reg.orgCheck();
			$("#org-id-i i").removeClass("on");
			if(b){
				$("#org-id-i i:eq(0)").addClass("on");
			}else{
				$("#org-id-i i:eq(1)").addClass("on");
			}
		});
		$("#email-id").blur(function(){
			var b=reg.emailCheck();
			$("#email-id-i i").removeClass("on")
			if(b){
				$("#email-id-i i:eq(0)").addClass("on")
			}else{
				$("#email-id-i i:eq(1)").addClass("on")
			}
		});
		$("#checkCode-id").blur(function(){
			var b=reg.captchaCheck();
			$("#checkCode-id-i i").removeClass("on")
			if(b){
				$("#checkCode-id-i i:eq(0)").addClass("on")
			}else{
				$("#checkCode-id-i i:eq(1)").addClass("on")
			}
		})
		$("#lpw-id").blur(function(){
			var b=reg.pwd1Check();
			$("#lpw-id-i i").removeClass("on")
			if(b){
				$("#lpw-id-i i:eq(0)").addClass("on")
			}else{
				$("#lpw-id-i i:eq(1)").addClass("on")
			}
		})
		$("#lpw2-id").blur(function(){
			var b=reg.pwd2Check();
			$("#lpw2-id-i i").removeClass("on")
			if(b){
				$("#lpw2-id-i i:eq(0)").addClass("on")
			}else{
				$("#lpw2-id-i i:eq(1)").addClass("on")
			}
		});
		/**
		 * 省市下拉选择 - 暂用js维护数据，后期使用redis+mysql
		 */
		$("#company-area-country-select-id").on("change",function(){
			var provinceList=new Array();
			provinceList['请选择国家']=['请选择省份'];
			provinceList['中国']=['请选择省份','北京','上海','天津','重庆','河北','山西','河南','辽宁','吉林','黑龙江','内蒙古','江苏','山东','安徽','浙江',
					'福建','湖北','湖南','广东','广西','江西','四川','海南','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'];
			var province=document.forms[0].comProvince;//文档中的第一个省份；
			province.options.length=0;//把province下拉列表的选项清0
		    var index=document.forms[0].comCountry.value; //文档中的第一个国家；
		    province.options.length=0;
		    for(var j in provinceList[index]){
		    	newOption=new Option(provinceList[index][j],provinceList[index][j]);
		    	province.options.add(newOption);		
		    	var city=document.forms[0].comCity;//文档中的第一个市区；
		    	city.options.length=1;//把city下拉列表的选项清0
		    }
		})
		$("#company-area-province-select-id").on("change",function(){
			var cityList=new Array();
			cityList['请选择省份']=['请选择城市'];
			cityList['北京']=['请选择城市','朝阳区','海淀区','西城区','东城区','崇文区','宣武区','丰台区','石景山区','门头沟','房山区','通州区','大兴区','顺义区','怀柔区','密云区','昌平区','平谷区','延庆县'];
			cityList['上海']=['请选择城市','黄浦区','徐汇区','长宁区','静安区','闸北区','虹口区','杨浦区','宝山区','闵行区','嘉定区','浦东新区','青浦区','松江区','金山区','奉贤区','普陀区','崇明县'];
			cityList['天津']=['请选择城市','东丽区','和平区','河北区','河东区','河西区','红桥区','蓟县','静海县','南开区','塘沽区','西青区','武清区','津南区','汉沽区','大港区','北辰区','宝坻区','宁河县'];
			cityList['重庆']=['请选择城市','万州区','涪陵区','梁平县','南川区','潼南县','大足区','黔江区','武隆县','丰都县','奉节县','开县','云阳县','忠县','巫溪县','巫山县','石柱县','彭水县','垫江县','酉阳县','秀山县','城口县','璧山县','荣昌县','铜梁县','合川区','巴南区','北碚区','江津区','渝北区','长寿区','永川区','江北区','南岸区','九龙坡区','沙坪坝区','大渡口区','綦江区','渝中区','高新区','北部新区'];
			cityList['河北']=['请选择城市','石家庄市','邯郸市','邢台市','保定市','张家口市','承德市','秦皇岛市','唐山市','沧州市','廊坊市','衡水市'];
			cityList['山西']=['请选择城市','太原市','大同市','阳泉市','晋城市','朔州市','晋中市','忻州市','吕梁市','临汾市','运城市','长治市'];
			cityList['河南']=['请选择城市','郑州市','开封市','洛阳市','平顶山市','焦作市','鹤壁市','新乡市','安阳市','濮阳市','许昌市','漯河市','三门峡市','南阳市','商丘市','周口市','驻马店市','信阳市','济源市'];
			cityList['辽宁']=['请选择城市','沈阳市','大连市','鞍山市','抚顺市','本溪市','丹东市','锦州市','葫芦岛市','营口市','盘锦市','阜新市','辽阳市','朝阳市','铁岭市'];
			cityList['吉林']=['请选择城市','长春市','吉林市','四平市','通化市','白山市','松原市','白城市','延边州','辽源市'];
			cityList['黑龙江']=['请选择城市','哈尔滨市','齐齐哈尔市','鹤岗市','双鸭山市','鸡西市','大庆市','伊春市','牡丹江市','佳木斯市','七台河市','黑河市','绥化市','大兴安岭地区'];
			cityList['内蒙古']=['请选择城市','呼和浩特市','包头市','乌海市','赤峰市','乌兰察布市','锡林郭勒盟','呼伦贝尔市','鄂尔多斯市','巴彦淖尔市','阿拉善盟','兴安盟','通辽市'];
			cityList['江苏']=['请选择城市','南京市','徐州市','连云港市','淮安市','宿迁市','盐城市','扬州市','泰州市','南通市','镇江市','常州市','无锡市','苏州市'];
			cityList['山东']=['请选择城市','济南市','青岛市','淄博市','枣庄市','东营市','潍坊市','烟台市','威海市','莱芜市','德州市','临沂市','聊城市','滨州市','菏泽市','日照市','泰安市','济宁市'];
			cityList['安徽']=['请选择城市','铜陵市','合肥市','淮南市','淮北市','芜湖市','蚌埠市','马鞍山市','安庆市','黄山市','滁州市','阜阳市','亳州市','宿州市','池州市','六安市','宣城市'];
			cityList['浙江']=['请选择城市','宁波市','杭州市','温州市','嘉兴市','湖州市','绍兴市','金华市','衢州市','丽水市','台州市','舟山市'];
			cityList['福建']=['请选择城市','福州市','厦门市','三明市','莆田市','泉州市','漳州市','南平市','龙岩市','宁德市'];
			cityList['湖北']=['请选择城市','武汉市','黄石市','襄阳市','十堰市','荆州市','宜昌市','孝感市','黄冈市','咸宁市','恩施州','鄂州市','荆门市','随州市','潜江市','天门市','仙桃市','神农架林区'];
			cityList['湖南']=['请选择城市','长沙市','株洲市','湘潭市','韶山市','衡阳市','邵阳市','岳阳市','常德市','张家界市','郴州市','益阳市','永州市','怀化市','娄底市','湘西州'];
			cityList['广东']=['请选择城市','广州市','深圳市','珠海市','汕头市','韶关市','河源市','梅州市','惠州市','汕尾市','东莞市','中山市','江门市','佛山市','阳江市','湛江市','茂名市','肇庆市','云浮市','清远市','潮州市','揭阳市'];
			cityList['广西']=['请选择城市','南宁市','柳州市','桂林市','梧州市','北海市','防城港市','钦州市','贵港市','玉林市','贺州市','百色市','河池市','来宾市','崇左市'];
			cityList['江西']=['请选择城市','南昌市','景德镇市','萍乡市','新余市','九江市','鹰潭市','上饶市','宜春市','抚州市','吉安市','赣州市'];
			cityList['四川']=['请选择城市','成都市','自贡市','攀枝花市','泸州市','绵阳市','德阳市','广元市','遂宁市','内江市','乐山市','宜宾市','广安市','南充市','达州市','巴中市','雅安市','眉山市','资阳市','阿坝州','甘孜州','凉山州'];
			cityList['海南']=['请选择城市','海口市','儋州市','琼海市','万宁市','东方市','三亚市','文昌市','五指山市','临高县','澄迈县','定安县','屯昌县','昌江县','白沙县','琼中县','陵水县','保亭县','乐东县','三沙市'];
			cityList['贵州']=['请选择城市','贵阳市','六盘水市','遵义市','铜仁市','毕节市','安顺市','黔西南州','黔东南州','黔南州'];
			cityList['云南']=['请选择城市','昆明市','曲靖市','玉溪市','昭通市','普洱市','临沧市','保山市','丽江市','文山州','红河州','西双版纳州','楚雄州','大理州','德宏州','怒江州','迪庆州'];
			cityList['西藏']=['请选择城市','拉萨市','那曲地区','山南地区','昌都地区','日喀则地区','阿里地区','林芝地区'];
			cityList['陕西']=['请选择城市','西安市','铜川市','宝鸡市','咸阳市','渭南市','延安市','汉中市','榆林市','商洛市','安康市'];
			cityList['甘肃']=['请选择城市','兰州市','金昌市','白银市','天水市','嘉峪关市','平凉市','庆阳市','陇南市','武威市','张掖市','酒泉市','甘南州','临夏州','定西市'];
			cityList['青海']=['请选择城市','西宁市','海东地区','海北州','黄南州','海南州','果洛州','玉树州','海西州'];
			cityList['宁夏']=['请选择城市','银川市','石嘴山市','吴忠市','固原市','中卫市'];
			cityList['新疆']=['请选择城市','乌鲁木齐市','克拉玛依市','石河子市','吐鲁番地区','哈密地区','和田地区','阿克苏地区','喀什地区','克孜勒苏州','巴音郭楞州','昌吉州','博尔塔拉州','伊犁州','塔城地区','阿勒泰地区','五家渠市','博尔塔拉蒙古自治州','阿拉尔市','图木舒克市'];
			cityList['台湾']=['请选择城市','台湾'];
			cityList['香港']=['请选择城市','香港特别行政区'];
			cityList['澳门']=['请选择城市','澳门特别行政区'];
			var city=document.forms[0].comCity;//文档中的第一个市区；
			city.options.length=0;//把city下拉列表的选项清0
			var index=document.forms[0].comProvince.value;
			city.options.length=0;
			for(var j in cityList[index]){
				newOption=new Option(cityList[index][j],cityList[index][j]);
	            city.options.add(newOption);
			}
		});
		//邀请码验证
//	    $("#inviteCode-id-g").blur(function(){
//	    	var flag = true;
//	    	var inviteCode = $("#inviteCode-id-g").val();
//	    	if(inviteCode==""){
//	    		$("#inviteCode-id-i-g span").html("");
//	    		$("#inviteCode-id-i-g i").removeClass("on")
//	    		flag = false;
//	    		return false;
//	    	}else{
//	    		$.ajax({
//	    			url:rootPath+'/admin/account/check/inviteRecCode?inviteCode='+inviteCode,
//	    			type:"post",
//	    			dataType:'json',
//	    			success:function(json){
//	    				if(json.result == 0){
//	    					$("#inviteCode-id-i-g span").html("");
//	    					$("#inviteCode-id-i-g i:eq(0)").addClass("on");
//	    					flag = true;
//	    				}else{
//	    					$("#inviteCode-id-i-g span").html(json.mes);
//	    					$("#inviteCode-id-i-g i:eq(1)").addClass("on");
//	    					flag = false;
//	    				}
//	    			}
//	    		});
//	    	}
//	    });
//	},
//	regemailAjax : function(){
//		if(!reg.submitCheck()){
//			return false;
//		}
//		var data={
//				"title":$("#company-id").val(),
//				"organizationCode" :$("#org-id").val(),
//				"email" :$("#email-id").val(),
//				"lpw" : $("#lpw-id").val()
//		};
//		var url=rootPath+'/ajax/user/reg/email';
//		$.ajax({
//			type :"post",
//			async: false,
//			url: url,
//			dataType:'json',
//			cache: false,
//			data:data,
//			success: function(json){
//				if(json.result ==1){
//					//注册成功
//					alert("注册成功")
//					window.location.href=rootPath+"/user/reg/email/act?email="+$("#email-id").val();
//				}else{
//					alert(json.mes)
//					window.location.href=rootPath+"/user/reg/email/fail";
//				}
//			},
//			error :function(json){
//				alert("系统错误")
//			}
//		});
	},
	
	pwStrongCheck : function(v){
		var v;
		var lpws =  $("#lpw-id-strong");
		var spaceRegex=new RegExp("^\S{7,}$");
		var simpleRegex=new RegExp("[0-9]{1,20}")
		var simpleRegex1=new RegExp("[a-zA-Z]{1,20}")
	    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
	    if(!v){v = 0;$(lpws).children().removeClass("bg3");return v;}
			if (strongRegex.test(v)) {
		    	$(lpws).each(function(){
		    		$(this).find("span").attr("class","bg0 bg3");
		    	});
		        v=3;
		   }else if (mediumRegex.test(v)) {
			   $(lpws).each(function(){
				   $(this).find("span:lt(2)").attr("class","bg0 bg3");
				   $(this).find("span:gt(1)").attr("class","bg0");
			   });
			   v=2;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
		   } else if (enoughRegex.test(v)) {
			   v=1;
			   $(lpws).each(function(){
				   $(this).find("span:lt(1)").attr("class","bg0 bg3");
				   $(this).find("span:gt(0)").attr("class","bg0");
			   });
		   } else {
			   $(lpws).each(function(){
				   $(this).find("span:lt(1)").attr("class","bg0 bg3");
				   $(this).find("span:gt(0)").attr("class","bg0");
			   });
			   v=1;
		   }
			return v;
		},
		
	submitCheck:function(){
		var b=true;
		b=b&&reg.nameCheck();
		b=b&&reg.orgCheck();
		b=b&&reg.emailCheck();
		b=b&&reg.pwd1Check();
		b=b&&reg.pwd2Check();
		b=b&&reg.captchaCheck();
		b=b&&reg.tongCheck();
		return b;
	},
	pwd2Check : function(){
		var v1=$.trim($("#lpw-id").val());
		var v2=$.trim($("#lpw2-id").val());
		var flag = true;
		if($.isEmpty(v2)){
			$("#lpw2-id-i span").html("重复密码不能为空")
			flag = false;
		}else if(v1 != v2){
			$("#lpw2-id-i span").html("两次输入密码不一致")
			flag = false;
		}
		if(flag){
			$("#lpw2-id-i span").html("")
			$("#lpw2-id-i i").removeClass("on")
			$("#lpw2-id-i i:eq(0)").addClass("on")
		}else{
			$("#lpw2-id-i i").removeClass("on")
			$("#lpw2-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},
	pwd1Check : function(){
		var v1=$.trim($("#lpw-id").val());
		reg.strongFlag=reg.pwStrongCheck(v1);	
		var flag = true;
		if(/^\s+$/gi.test($("#lpw-id").val())){
			$("#lpw-id-i span").html("密码不能包含空格")
			flag = false;
		}else if($.isEmpty(v1)){
			$("#lpw-id-i span").html("密码不能为空")
			flag = false;
		} else if(($("#lpw-id").val().length<8||$("#lpw-id").val().length>16)){
			$("#lpw-id-i span").html("密码长度在8~16位之间")
			flag = false;
		}else if(/\s/.test($("#lpw-id").val())){
			$("#lpw-id-i span").html("密码不能包含空格");
			flag = false;
		}else if(reg.strongFlag==1){
			$("#lpw-id-i span").html("密码强度过低");
			flag = false;
		}
		if(flag){
			$("#lpw-id-p").html("");
			$("#lpw-id-i i").removeClass("on")
			$("#lpw-id-i i:eq(0)").addClass("on")
		}else{
			$("#lpw-id-i i").removeClass("on")
			$("#lpw-id-i i:eq(1)").addClass("on")
		}
		
		return flag;
	},
	nameCheck:function(){
		var v=$.trim($("#company-id").val());
		var flag=true;
		if($.isEmpty(v)){
			$("#company-id-i span").html("请填写企业名称");
			
			flag=false;
		} else if (v.length>60){
			$("#company-id-i span").html("企业名称最多60个字符（含中文）");
			flag=false;
		} else if($.isSpecialChar(v)){
			$("#company-id-i span").html("请勿使用特殊字符和空格");
			flag=false;
		} else{
			var data={
					"userName":v
			}
			$.ajax({
				type:"post",
				url : rootPath+'/admin/account/check/comName',
				dataType:'json',
				async:false,
				data:data,
				success : function(json){
					if(json.result == 0){
						if(json.model){
							$("#company-id-i span").html("可以使用");
							flag = true;
						}else{
							$("#company-id-i span").html("企业名称已经被使用");
							flag = false;
						}
					}else{
						$("#company-id-i span").html("企业名称不可以使用");
						flag = false;
					}
				},
				error:function(json){
					flag=false;
					alert("系统异常")
				}
			});
		}
		if(flag){
			$("#company-id-i span").html("");
			$("#company-id-i i").removeClass("on")
			$("#company-id-i i:eq(0)").addClass("on")
		}else{
			$("#company-id-i i").removeClass("on")
			$("#company-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},
	
	emailCheck :function(){
		var v=$.trim($("#email-id").val());
		var flag=true;
		if($.isEmpty(v)){
			//邮箱不能为空
			$("#email-id-i span").html("请填写邮箱");
			flag=false;
		}else if(!$.isEmail(v)){
			//
			$("#email-id-i span").html("邮箱格式不正确");
			flag=false;
		}else{
			var data={
				email:v
			}
			$.ajax({
				type:"post",
				url:rootPath+"/admin/account/check/email",
				dataType:'json',
				data:data,
				async: false,
				cache : false,
				success: function(json){
					if(json.result == 0){
						if(json.model){
							$("#email-id-i span").html("可以使用");
							flag = true;
						}else{
							$("#email-id-i span").html("邮箱已被使用");
							flag = false;
						}
					}else{
						$("#email-id-i span").html(json.mes);
						flag = false;
					}
				},
				error:function(json){
					flag = false;
				}
			});
		}
		if(flag){
			$("#email-id-i span").html("");
			$("#email-id-i i").removeClass("on")
			$("#email-id-i i:eq(0)").addClass("on")
		}else{
			$("#email-id-i i").removeClass("on")
			$("#email-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},
	
	orgCheck : function(){
		var v=$.trim($("#org-id").val());
		var flag=true;
		if($.isEmpty(v)){
			//统一社会信用代码不可为空；
			flag=false;
			$("#org-id-i span").html("请填写企业统一社会信用代码")
		} else if (!(v.length == 18 || v.length == 15) ){
			$("#org-id-i span").html("企业统一社会信用代码为15或18位字符")
			flag=false;
		} else if(!$.isLetterNumber(v)){
			$("#org-id-i span").html("必须由数字和英文字母组成");
			flag=false;
		} else{
			var data={
					"orgId":v
			}
			$.ajax({
				type:"post",
				url : rootPath+"/admin/account/check/orgId",
				dataType: 'json',
				async:false,
				data :data,
				success:function(json){
					if(json.result == 0){
						if(json.model){
							$("#org-id-i span").html("该代码可以使用")
							flag = true;
						}else{
							$("#org-id-i span").html("统一社会信用代码已经被使用")
							flag = false;
						}
					}else{
						$("#org-id-i span").html("该代码不可用")
						flag = false;
					}
				},
				error:function(json){
					flag = false;
				}
			});
		}
		if(flag){
			$("#org-id-i span").html("")
			$("#org-id-i i").removeClass("on")
			$("#org-id-i i:eq(0)").addClass("on")
		}else{
			$("#org-id-i i").removeClass("on")
			$("#org-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},
	
	captchaCheck :function(){
		var v=$.trim($("#checkCode-id").val());
		var flag=true;
		if($.isEmpty(v)){
			flag=false;
			$("#checkCode-id-i span").html("图片验证码不能为空")
		}else{
			var data={"captcha":$.trim($("#checkCode-id").val())};				
			$.ajax({
				type : "post",
				url : rootPath+'/admin/account/check/image',
				dataType : 'json',
				data : data,
				async: false,
				cache : false,
				success : function(json) {
					if(json.result == 0){
						if(json.model){
							$("#checkCode-id-i span").html("");
							flag = true;
						}else{
							$("#checkCode-id-i span").html("图片验证码有误");
							flag = false;
						}
					}
					else{
						$("#checkCode-id-i span").html("图片验证码填写错误")
						flag = false;
					}				
				},
				error:function(json){
					flag = false;
				}
			});
		}
		if(flag){
			$("#checkCode-id-i span").html("")
			$("#checkCode-id-i i").removeClass("on")
			$("#checkCode-id-i i:eq(0)").addClass("on")
		}else{
			$("#checkCode-id-i i").removeClass("on")
			$("#checkCode-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},
	tongCheck:function(){
		 if($("#tong-reg i").hasClass("on")){
			 $("#tong-reg-p").html("");
    		 return true;
    	 }else{
    		 var psrc=$("#rand-img-id").attr("psrc");
			 $("#rand-img-id").attr("src",psrc+"?time="+new Date().getTime());
    		 $("#tong-reg-p").html("请阅读注册协议");
    		 return false;
    	 }
	}
};

var reg2={
	jspinint:function(){
		var key=true;
		$('.tab-title span').on('click',function(){
			var index = $(this).index();
			$(this).addClass('on').siblings('span').removeClass('on');
			$('.tab-list li').eq(index).addClass('on').siblings('li').removeClass('on');
			$(".wrong,.corret").removeClass("on");
			$(".gryh panduan").show();
		});

		$(".gxqdhy").on("click","span",function(){
			var ss=$(this).index();
			
			if(!$(this).hasClass("on")){
				$(".gxqdhy span:eq("+ss+") img").attr("src","/images/register/gxqhy_0"+(ss+1)+"a.png");
				$(this).addClass("on");
			}else{
				$(".gxqdhy span:eq("+ss+") img").attr("src","/images/register/gxqhy_0"+(ss+1)+".png");
				$(this).removeClass("on");
			}
		})
		
		$(".grydxy").click(function() {
			if(key){
				$(this).addClass("on");
			}else{
				$(this).removeClass("on");
			}
			key=!key;
		})
		
		$(".qyydxy").click(function() {
			if(key){
				$(this).addClass("on");
			}else{
				$(this).removeClass("on");
			}
			key=!key;
		})
		
		/*判断输入是否输入正确*/
		$(".qyyh").on("focus","input",function(){
			$(".panduan").css("display","block");
		})
	},
	strongFlag:1,
	area : {},// 地市数据缓存
	//industryType:[],
	init:function(){
		/**
		 * 注册协议
		 */
		 $("#tong-reg2 i").attr("class","");
		 $("#tong-reg2").click(function(){
	    	 if($("#tong-reg2 i").hasClass("on")){
	    		 $("#tong-reg2 i").attr("class","");
	    	 }else{
	    		 $("#tong-reg2 i").attr("class","on");
	    	 }
	     })
	     $("#lpw-id-i-g i").removeClass("on")
		/**
		 * 验证码初始化
		 */
		//reg2.sendCode()
		/**
		 * 图片验证码点击事件
		 */
		$("#rand-img-id-a-g").click(function(){
			$("#rand-img-id-g").trigger("click");
		})
		$("#rand-img-id-g").click(function(){
			var psrc=$(this).attr("psrc");
			$(this).attr("src",psrc+"?time="+new Date().getTime());
		})
		
		$("#lpw-id-strong-g a:eq(0)").attr("class","");
		$("#lpw-id-strong-g a:eq(1)").attr("class","");
	     $("#lpw-id-strong-g a:eq(2)").attr("class","");
		
		$("#smb-id").click(function(){
			reg2.regPhoneAjax();
		})
//		$("#send-id").click(function(){
//			reg2.sendCode();
//		})
		/**
		 * 选取兴趣行业
		 */
		/*
		$(".gxqdhy").click(function(){
			//$(".zlzz").removeClass("on");
			if($(this).hasClass("on")){
				$(this).removeClass("on")
			}else{
				$(this).addClass("on");
			}
			//reg2.industryType=$(this).attr("data-id");			
		})
		*/
		/**
		 * 省市下拉选择 - 暂用js维护数据，后期使用redis+mysql
		 */
		$("#person-area-country-select-id").on("change",function(){
			var provinceList=new Array();
			provinceList['请选择国家']=['请选择省份'];
			provinceList['中国']=['请选择省份','北京','上海','天津','重庆','河北','山西','河南','辽宁','吉林','黑龙江','内蒙古','江苏','山东','安徽','浙江',
					'福建','湖北','湖南','广东','广西','江西','四川','海南','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'];
			var province=document.forms[0].perProvince;//文档中的第一个省份；
			province.options.length=0;//把province下拉列表的选项清0
		    var index=document.forms[0].perCountry.value; //文档中的第一个国家；
		    province.options.length=0;
		    for(var j in provinceList[index]){
		    	newOption=new Option(provinceList[index][j],provinceList[index][j]);
		    	province.options.add(newOption);		
		    	var city=document.forms[0].perCity;//文档中的第一个市区；
		    	city.options.length=1;//把city下拉列表的选项清0
		    }
		})
		$("#person-area-province-select-id").on("change",function(){
			var cityList=new Array();
			cityList['请选择省份']=['请选择城市'];
			cityList['北京']=['请选择城市','朝阳区','海淀区','西城区','东城区','崇文区','宣武区','丰台区','石景山区','门头沟','房山区','通州区','大兴区','顺义区','怀柔区','密云区','昌平区','平谷区','延庆县'];
			cityList['上海']=['请选择城市','黄浦区','徐汇区','长宁区','静安区','闸北区','虹口区','杨浦区','宝山区','闵行区','嘉定区','浦东新区','青浦区','松江区','金山区','奉贤区','普陀区','崇明县'];
			cityList['天津']=['请选择城市','东丽区','和平区','河北区','河东区','河西区','红桥区','蓟县','静海县','南开区','塘沽区','西青区','武清区','津南区','汉沽区','大港区','北辰区','宝坻区','宁河县'];
			cityList['重庆']=['请选择城市','万州区','涪陵区','梁平县','南川区','潼南县','大足区','黔江区','武隆县','丰都县','奉节县','开县','云阳县','忠县','巫溪县','巫山县','石柱县','彭水县','垫江县','酉阳县','秀山县','城口县','璧山县','荣昌县','铜梁县','合川区','巴南区','北碚区','江津区','渝北区','长寿区','永川区','江北区','南岸区','九龙坡区','沙坪坝区','大渡口区','綦江区','渝中区','高新区','北部新区'];
			cityList['河北']=['请选择城市','石家庄市','邯郸市','邢台市','保定市','张家口市','承德市','秦皇岛市','唐山市','沧州市','廊坊市','衡水市'];
			cityList['山西']=['请选择城市','太原市','大同市','阳泉市','晋城市','朔州市','晋中市','忻州市','吕梁市','临汾市','运城市','长治市'];
			cityList['河南']=['请选择城市','郑州市','开封市','洛阳市','平顶山市','焦作市','鹤壁市','新乡市','安阳市','濮阳市','许昌市','漯河市','三门峡市','南阳市','商丘市','周口市','驻马店市','信阳市','济源市'];
			cityList['辽宁']=['请选择城市','沈阳市','大连市','鞍山市','抚顺市','本溪市','丹东市','锦州市','葫芦岛市','营口市','盘锦市','阜新市','辽阳市','朝阳市','铁岭市'];
			cityList['吉林']=['请选择城市','长春市','吉林市','四平市','通化市','白山市','松原市','白城市','延边州','辽源市'];
			cityList['黑龙江']=['请选择城市','哈尔滨市','齐齐哈尔市','鹤岗市','双鸭山市','鸡西市','大庆市','伊春市','牡丹江市','佳木斯市','七台河市','黑河市','绥化市','大兴安岭地区'];
			cityList['内蒙古']=['请选择城市','呼和浩特市','包头市','乌海市','赤峰市','乌兰察布市','锡林郭勒盟','呼伦贝尔市','鄂尔多斯市','巴彦淖尔市','阿拉善盟','兴安盟','通辽市'];
			cityList['江苏']=['请选择城市','南京市','徐州市','连云港市','淮安市','宿迁市','盐城市','扬州市','泰州市','南通市','镇江市','常州市','无锡市','苏州市'];
			cityList['山东']=['请选择城市','济南市','青岛市','淄博市','枣庄市','东营市','潍坊市','烟台市','威海市','莱芜市','德州市','临沂市','聊城市','滨州市','菏泽市','日照市','泰安市','济宁市'];
			cityList['安徽']=['请选择城市','铜陵市','合肥市','淮南市','淮北市','芜湖市','蚌埠市','马鞍山市','安庆市','黄山市','滁州市','阜阳市','亳州市','宿州市','池州市','六安市','宣城市'];
			cityList['浙江']=['请选择城市','宁波市','杭州市','温州市','嘉兴市','湖州市','绍兴市','金华市','衢州市','丽水市','台州市','舟山市'];
			cityList['福建']=['请选择城市','福州市','厦门市','三明市','莆田市','泉州市','漳州市','南平市','龙岩市','宁德市'];
			cityList['湖北']=['请选择城市','武汉市','黄石市','襄阳市','十堰市','荆州市','宜昌市','孝感市','黄冈市','咸宁市','恩施州','鄂州市','荆门市','随州市','潜江市','天门市','仙桃市','神农架林区'];
			cityList['湖南']=['请选择城市','长沙市','株洲市','湘潭市','韶山市','衡阳市','邵阳市','岳阳市','常德市','张家界市','郴州市','益阳市','永州市','怀化市','娄底市','湘西州'];
			cityList['广东']=['请选择城市','广州市','深圳市','珠海市','汕头市','韶关市','河源市','梅州市','惠州市','汕尾市','东莞市','中山市','江门市','佛山市','阳江市','湛江市','茂名市','肇庆市','云浮市','清远市','潮州市','揭阳市'];
			cityList['广西']=['请选择城市','南宁市','柳州市','桂林市','梧州市','北海市','防城港市','钦州市','贵港市','玉林市','贺州市','百色市','河池市','来宾市','崇左市'];
			cityList['江西']=['请选择城市','南昌市','景德镇市','萍乡市','新余市','九江市','鹰潭市','上饶市','宜春市','抚州市','吉安市','赣州市'];
			cityList['四川']=['请选择城市','成都市','自贡市','攀枝花市','泸州市','绵阳市','德阳市','广元市','遂宁市','内江市','乐山市','宜宾市','广安市','南充市','达州市','巴中市','雅安市','眉山市','资阳市','阿坝州','甘孜州','凉山州'];
			cityList['海南']=['请选择城市','海口市','儋州市','琼海市','万宁市','东方市','三亚市','文昌市','五指山市','临高县','澄迈县','定安县','屯昌县','昌江县','白沙县','琼中县','陵水县','保亭县','乐东县','三沙市'];
			cityList['贵州']=['请选择城市','贵阳市','六盘水市','遵义市','铜仁市','毕节市','安顺市','黔西南州','黔东南州','黔南州'];
			cityList['云南']=['请选择城市','昆明市','曲靖市','玉溪市','昭通市','普洱市','临沧市','保山市','丽江市','文山州','红河州','西双版纳州','楚雄州','大理州','德宏州','怒江州','迪庆州'];
			cityList['西藏']=['请选择城市','拉萨市','那曲地区','山南地区','昌都地区','日喀则地区','阿里地区','林芝地区'];
			cityList['陕西']=['请选择城市','西安市','铜川市','宝鸡市','咸阳市','渭南市','延安市','汉中市','榆林市','商洛市','安康市'];
			cityList['甘肃']=['请选择城市','兰州市','金昌市','白银市','天水市','嘉峪关市','平凉市','庆阳市','陇南市','武威市','张掖市','酒泉市','甘南州','临夏州','定西市'];
			cityList['青海']=['请选择城市','西宁市','海东地区','海北州','黄南州','海南州','果洛州','玉树州','海西州'];
			cityList['宁夏']=['请选择城市','银川市','石嘴山市','吴忠市','固原市','中卫市'];
			cityList['新疆']=['请选择城市','乌鲁木齐市','克拉玛依市','石河子市','吐鲁番地区','哈密地区','和田地区','阿克苏地区','喀什地区','克孜勒苏州','巴音郭楞州','昌吉州','博尔塔拉州','伊犁州','塔城地区','阿勒泰地区','五家渠市','博尔塔拉蒙古自治州','阿拉尔市','图木舒克市'];
			cityList['台湾']=['请选择城市','台湾'];
			cityList['香港']=['请选择城市','香港特别行政区'];
			cityList['澳门']=['请选择城市','澳门特别行政区'];
			var city=document.forms[0].perCity;//文档中的第一个市区；
			city.options.length=0;//把city下拉列表的选项清0
			var index=document.forms[0].perProvince.value;
			city.options.length=0;
			for(var j in cityList[index]){
				newOption=new Option(cityList[index][j],cityList[index][j]);
	            city.options.add(newOption);
			}
		})
		/*
		//省市下拉选择
		$("#user-provinceNo-select-id").bind({
			getList : function(e, v) {
				var type = "province";
				if (!$.isEmpty(v) && v != -1) {
					var list = reg2.area[type + "_"+ v];
					if (list) {
						$(this).trigger("initOption", [ list ]);
					} else {
						reg2.getCityList(v, type,this);
					}
				}
			},
			initOption : function(e, list) {
				if (list && list.length > 0) {
					for (var i = 0, len = list.length, m; i < len; i++) {
						m = list[i];
						var $op = $('<option value="'+m.areaId+'" pid="'+ m.pid+'" >'+m.title+'</option>');
						$($op).data("model", m);
						$(this).append($op);
					}
				}
				var val = $(this).attr('data-no');
				$(this).find('option[value="'+val+'"]').prop('selected',true);
				$(this).prop('data-no',-1);
				$(this).change();
			},

			change : function() {
				var v = $(this).val();
				$("#user-cityNo-select-id").trigger("getList",[ v ]);
			}
		});
		//市下拉
		$("#user-cityNo-select-id").bind({
			getList : function(e, v) {
				var type = "city";
				if (!$.isEmpty(v) && v != -1) {
					var list = reg2.area[type + "_"+ v];
					if (list) {
						$(this).trigger("initOption", [ list ]);
					} else {
						reg2.getCityList(v, type,this);
					}
				}
			},
			initOption : function(e, list) {
				$(this).find("option:not([value=-1])").remove();
				if (list && list.length > 0) {
					for (var i = 0, len = list.length, m; i < len; i++) {
						m = list[i];
						var $op = $('<option value="'+m.areaId+'" pid="'+ m.pid+'" >'+m.title+'</option>');
						$($op).data("model", m);
						$(this).append($op);
					}
				}
				var val = $(this).attr('data-no');
				$(this).find('option[value="'+val+'"]').prop('selected',true);
				$(this).prop('data-no',-1);
			}
			
		});
		reg2.getCityList(86, "province", $("#user-provinceNo-select-id"));
		*/
		$("#nickName-id").blur(function(){
			var b=reg2.nickNameCheck();		
			$("#nickName-id-i i").removeClass("on")
			if(b){
				$("#nickName-id-i i:eq(0)").addClass("on")
			}else{				
				$("#nickName-id-i i:eq(1)").addClass("on")
			}
		});
		$("#phone-id").blur(function(){
			var b=reg2.phoneCheck();
			$("#phone-id-i i").removeClass("on")
			if(b){
				$("#phone-id-i i:eq(0)").addClass("on")
			}else{
				$("#phone-id-i i:eq(1)").addClass("on")
			}
		});
		$("#personEmail-id").blur(function(){
			var b=reg2.personEmailCheck();
			$("#personEmail-id-i i").removeClass("on")
			if(b){
				$("#personEmail-id-i i:eq(0)").addClass("on")
			}else{
				$("#personEmail-id-i i:eq(1)").addClass("on")
			}
		});
		$("#lpw-id-g").blur(function(){
			var b=reg2.pwd1Check();
			$("#lpw-id-i-g i").removeClass("on")
			if(b){
				$("#lpw-id-i-g i:eq(0)").addClass("on")
				//alert("1")
			}else{
				$("#lpw-id-i-g i:eq(1)").addClass("on")
				//alert("2")
			}
		});
		$("#lpw2-id-g").blur(function(){
			var b=reg2.pwd2Check();
			$("#lpw2-id-i-g i").removeClass("on");
			if(b){
				//alert(b)
				$("#lpw2-id-i-g i:eq(0)").addClass("on");
			}else{
				$("#lpw2-id-i-g i:eq(1)").addClass("on");
			}
		});
		
		$("#checkCode-id-g").blur(function(){
			var b=reg2.captchaCheck();
			$("#checkCode-id-i-g i").removeClass("on")
			if(b){
				$("#checkCode-id-i-g i:eq(0)").addClass("on")
			}else{
				$("#checkCode-id-i-g i:eq(1)").addClass("on")
			}
		});

	    $("#inviteCode-id-g").blur(function(){
			var b=reg2.inviteCodeCheck();
			$("#inviteCode-id-i-g i").removeClass("on")
			if(b){
				$("#inviteCode-id-i-g i:eq(0)").addClass("on")
			}else{
				$("#inviteCode-id-i-g i:eq(1)").addClass("on")
			}
		});
	},
	
	/**
	 * 省市区获取成功
	 * @param json
	 * @param type
	 * @param $select
	 */
	/*
	getCityListSuc : function(json, type, $select) {
		var list = json.model;
		if ($select && $($select).length > 0) {
			$($select).trigger("initOption", [ list ]);
		}

		this.area[type + "_" + json.pid] = list;
	},
	*/
	/**
	 * 省市区
	 * @param pid	地区编号
	 * @param type	地区类型 province city area
	 * @param	$select
	 */
	/*
	getCityList : function(pid, type, $select) {
		var url = rootPath+'area/ajaxList';
		var data = {
			pid : pid,
			ccode : 0
		};
		$.ajax({
			type : "post",
			url : url,
			dataType : 'json',
			data : data,
			cache : false,
			success : function(json) {
				if (json.result == 0) {
					json.pid = pid;
					reg2.getCityListSuc(json, type, $select);
				} else {
					alert(json.mes);
				}
			}
		});
	},
	*/
	/**
	 * 发送手机验证码
	 */
	/*
	sendCode:function(){
		$('#send-id').bind({
			showTime : function(){
				var n=$(this).attr('showtime');
				n--;
				if(n<0){
					$(this).attr('showtime',n).removeClass('no').html('发送验证码');
					var id=$(this).attr('intid');
					clearInterval(id);
				}else{
					$(this).attr('showtime',n).addClass('no').html('重新获取('+n+')');
					var id=$(this).attr('intid');
				}
			},
			intTimeShow : function() {
				var id = $(this).attr("intid");
				clearInterval(id);
				$(this).addClass('no');
				$(this).attr('showtime',60).addClass('no').html('重新获取('+60+')');
				var $this = this;
				id=setInterval(function() {
					$($this).trigger("showTime");
				}, 1000);
				$(this).attr("intid",id);
			},
			getPhoneRandCode : function(e){
				if($(this).hasClass('no')){
					return false;
				}
				var vs=$.trim($("#phone-id").val());
				if($.isEmpty(vs)){
					alert("请输入手机号再发送")
					return false;
				}else if(!$.isPhone(vs)){
					alert("请输入正确手机号再点击发送")
					return false;
				}
				var phoneCheckIsOk=reg2.phoneCheck();
				if(!phoneCheckIsOk){
					alert("手机号已被使用/手机号无法使用")
					return false;
				}
				$.get(rootPath+'/ajax/user/sms/send?type=1&phone='+vs,function(data){ 
					data = $.parseJSON(data);
					//alert(data)
					if(data.result==1){
						alert("发送成功")
						$('#send-id').trigger("intTimeShow");
					}else{
						alert(data.mes);
						}
					})
			}
		}).click(function(){
			$(this).trigger("getPhoneRandCode");
		});
	},
	*/
	regPhoneAjax :function(){
		if(!reg2.submitCheck()){
			return false;
		}
		
		var data={
				nickName:$("#nickName-id").val(),
				phone:$("#phone-id").val(),
				//randCode:$("#randCode-id").val(),
				lpw:$("#lpw-id-g").val(),
				province:$("#user-provinceNo-select-id").val(),
				city:$("#user-cityNo-select-id").val(),
				//industryType:reg2.industryType==0?null:reg2.industryType,
				inviteCode:$("#inviteCode-id-g").val()
		}
		/**
		 * 给兴趣行业赋值
		 */
		/*
		var $data1=$(".zlzz");
		if($data1.length>1){
			for(var i=0,len=$data1.length;i<len;i++){
				if($data1.eq(i).hasClass("on")){
					reg2.industryType.push('"'+$data1.eq(i).attr("data-id")+'":"'+$data1.eq(i).text()+'"');
				}
			}
		}
		if(reg2.industryType.length > 0){
			data.industryType = "{"+reg2.industryType.join(",")+"}";
		}else {
			data.industryType = "";
		}
		*/
//		console.log('industryType--->'+data.industryType);
//		var url=rootPath+'/ajax/user/reg/phone';
//		$.ajax({
//			type:"post",
//			async:false,
//			url:url,
//			dataType:'json',
//			cache:false,
//			data:data,
//			success:function(json){
//				if(json.result ==1){
//					alert("注册成功");
//					window.location.href=rootPath+'/user/login';
//				}else{
//					alert("注册失败:"+json.mes);
//				}
//			},
//		error:function(){
//			//alert(3);
//			return false;
//		}
//		});
	},
	pwStrongCheck : function(v){
		 var v;
		 var lpws =  $("#lpw-id-strong-g");
		 var spaceRegex=new RegExp("^\S{7,}$");
		 var simpleRegex=new RegExp("[0-9]{1,20}")
		 var simpleRegex1=new RegExp("[a-zA-Z]{1,20}")
	     var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	     var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	     var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    if(!v){v = 0;$(lpws).children().removeClass("bg3");return v;}
	     if (strongRegex.test(v)) {
	    	 $(lpws).each(function(){
	    		 $(this).find("span").attr("class","bg0 bg3");
	    	 });
	         v=3;
	     }else if (mediumRegex.test(v)) {
	    	 $(lpws).each(function(){
	    		 $(this).find("span:lt(2)").attr("class","bg0 bg3");
	    		 $(this).find("span:gt(1)").attr("class","bg0");
	    	 });
	         v=2;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
	     } else if (enoughRegex.test(v)) {
	    	 v=1;
	    	 $(lpws).each(function(){
	    		 $(this).find("span:lt(1)").attr("class","bg0 bg3");
	    		 $(this).find("span:gt(0)").attr("class","bg0");
	    	 });
	     } else {
	    	 $(lpws).each(function(){
	    		 $(this).find("span:lt(1)").attr("class","bg0 bg3");
	    		 $(this).find("span:gt(0)").attr("class","bg0");
	    	 });
	         v=1;
	     }
	     return v;
	},
	
	submitCheck:function(){
		var b=true;
		b=b&&reg2.nickNameCheck();
		b=b&&reg2.phoneCheck();
		b=b&&reg2.personEmailCheck();
		b=b&&reg2.pwd1Check();
		b=b&&reg2.pwd2Check();
		/*b=b&&reg2.provinceCheck();*/
		b=b&&reg2.codeCheck();
		/*b=b&&reg2.industryCheck();*/
		b=b&&reg2.inviteCodeCheck();
		b=b&&reg2.tongCheck();
		return b;
	},
	tongCheck:function(){
		 if($("#tong-reg2 i").hasClass("on")){
			 $("#tong-reg2-p").html("");
   		 return true;
   	 }else{
   		 var psrc=$("#rand-img-id").attr("psrc");
			 $("#rand-img-id").attr("src",psrc+"?time="+new Date().getTime());
   		 $("#tong-reg2-p").html("请阅读注册协议");
   		 return false;
   	 }
	},
	codeCheck:function(){
		var v=$.trim($("#randCode-id").val());
		if($.isEmpty(v)){
			$("#randCode-id-s").html("验证码不能为空");
			return false;
		}
		$("#randCode-id-s").html("");
		return true;
	},
	nickNameCheck:function(){
		var v=$.trim($("#nickName-id").val());
		var re=new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]+$");
		if($.isEmpty(v)){
			$("#nickName-id-i span").html("请填写姓名/昵称");
			return false;
		}else if(v.length>20){
			$("#nickName-id-i span").html("最多20个字符");
			return false;
		}else if(!re.test(v)){
			$("#nickName-id-i span").html("只能输入字母、阿拉伯数字、汉字");
			return false;
		}
		
		if(v.length>20){
			$("#nickName-id-i span").html("最多20个字符");
			return false;
		}
		$("#nickName-id-i span").html("");
		return true;
	},
	phoneCheck:function(){
		var v=$.trim($("#phone-id").val());
		var flag = true;
		if($.isEmpty(v)){
			$("#phone-id-i span").html("请填写手机号");
			return false;
		}else if(!$.isPhone(v)){
			$("#phone-id-i span").html("手机号为11位固定长度数字");
			return false;
		}else{
			var data={
					"phone":v
			}
			$.ajax({
				type:"post",
				url:rootPath+'/admin/account/check/phone',
				dataType:'json',
				async:false,
				data:data,
				cache : false,
				success:function(json){
					if(json.result == 0){
						if(json.model){
							$("#phone-id-i span").html("")
							flag = true;
						}else{
							$("#phone-id-i span").html("该号码已注册");
							flag = false;
						}
					}else{
						$("#phone-id-i span").html("该电话号不能使用");
						flag = false;
					}
				},
				error:function(json){
					flag = false;
					alert("系统错误")
				}
			});
		}
		return flag;
	},
	
	pwd1Check : function(){
		var v1=$.trim($("#lpw-id-g").val());
		reg2.strongFlag=reg2.pwStrongCheck(v1);
		if(/^\s+$/gi.test($("#lpw-id-g").val())){
			$("#lpw-id-i-g span").html("密码不能包含空格")
			return false;
		}else if($.isEmpty(v1)){
			$("#lpw-id-i-g span").html("请填写密码")
			return false;
		} else if(($("#lpw-id-g").val().length<8||$("#lpw-id-g").val().length>16)){
			$("#lpw-id-i-g span").html("密码长度在8~16位之间")
			return false;
		}else if(/\s/.test($("#lpw-id-g").val())){
			$("#lpw-id-i-g span").html("密码不能包含空格")
			return false;
		}else if(reg2.strongFlag==1){
			$("#lpw-id-i-g span").html("密码强度过低");
			return false;
		}
		$("#lpw-id-i-g span").html("");
		return true;
	},
	
	captchaCheck :function(){
		var v=$.trim($("#checkCode-id-g").val());
		var flag=true;
		if($.isEmpty(v)){
			$("#checkCode-id-i-g span").html("请输入验证码")
			return false;
		}else{
			var data={"captcha":$.trim($("#checkCode-id-g").val())};
			$.ajax({
				type : "post",
				url : rootPath+'/admin/account/check/image',
				dataType : 'json',
				data : data,
				async: false,
				cache : false,
				success : function(json) {
					if(json.result == 0){
						if(json.model){
							$("#checkCode-id-i span").html("");
							flag = true;
						}else{
							$("#checkCode-id-i span").html("图片验证码有误");
							flag = false;
						}
					}
					else{
						$("#checkCode-id-i span").html("图片验证码填写错误")
						flag = false;
					}				
				},
				error:function(json){
					flag = false;
				}
			});
		}
		return flag;
	},
	
	pwd2Check : function(){
		var v1=$.trim($("#lpw-id-g").val());
		var v2=$.trim($("#lpw2-id-g").val());
		if($.isEmpty(v2)){
			$("#lpw2-id-i-g span").html("请填写重复密码")
			return false;
		}else if(v1 != v2){
			$("#lpw2-id-i-g span").html("两次输入密码不一致")
			return false;
		}
		$("#lpw2-id-i-g span").html("")
		return true;
	},
	
	personEmailCheck :function(){
		var v=$.trim($("#personEmail-id").val());
		var flag=true;
		if($.isEmpty(v)){
			//邮箱不能为空
			$("#personEmail-id-i span").html("请填写邮箱");
			flag=false;
		}else if(!$.isEmail(v)){
			//
			$("#personEmail-id-i span").html("邮箱格式不正确");
			flag=false;
		}else{
			var data={
				email:v
			}
			$.ajax({
				type:"post",
				url:rootPath+"/admin/account/check/email",
				dataType:'json',
				data:data,
				async: false,
				cache : false,
				success: function(json){
					if(json.result == 0){
						if(json.model){
							$("#personEmail-id-i span").html("可以使用");
							flag = true;
						}else{
							$("#personEmail-id-i span").html("邮箱已被使用");
							flag = false;
						}
					}else{
						$("#personEmail-id-i span").html(json.mes);
						flag = false;
					}
				},
				error:function(json){
					flag = false;
				}
			});
		}
		if(flag){
			$("#personEmail-id-i span").html("");
			$("#personEmail-id-i i").removeClass("on")
			$("#personEmail-id-i i:eq(0)").addClass("on")
		}else{
			$("#personEmail-id-i i").removeClass("on")
			$("#personEmail-id-i i:eq(1)").addClass("on")
		}
		return flag;
	},

	inviteCodeCheck:function(){
		var v=$.trim($("#inviteCode-id-g").val());
		var p=$.trim($("#phone-id").val());
		var flag = true;
		if($.isEmpty(v)){
			$("#inviteCode-id-i-g span").html("请填写邀请码");
			return false;
		}else if($.isEmpty(p)){
			$("#inviteCode-id-i-g span").html("请填写手机号");
			return false;
		}else{
			var data={
					"inviteCode":v,
					"phone":p
			}
			$.ajax({
				type:"post",
				url:rootPath+'/admin/account/check/inviteCode',
				dataType:'json',
				async:false,
				data:data,
				cache : false,
				success:function(json){
					if(json.result == 0){
						if(json.model){
							$("#inviteCode-id-i-g span").html("");
							flag = true;
						}else{
							$("#inviteCode-id-i-g span").html("邀请码异常");
							flag = false;
						}
					}else{
						$("#inviteCode-id-i-g span").html(json.mes)
						flag = false;
					}
				},
				error:function(json){
					flag = false;
					alert("系统错误")
				}
			});
		}
		return flag;
	}
	/*
	provinceCheck:function(){
		var v=$.trim($("#user-provinceNo-select-id").val());
		if(v<0){
			$("#user-provinceNo-select-id-s").html("请选择省");
			return false;
		}
		$("#user-provinceNo-select-id-s").html("");
		return true;
	},
	industryCheck:function(){
		var sdata=$(".zlzz")
		for(var i=0,len=sdata.length;i<len;i++){
			if(sdata.eq(i).hasClass("on")){
				return true;
			}
		}
		return false;
	}
	*/
	
}