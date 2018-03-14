/**
 * 登录表单验证
 */
$(function() {
	$('#loginForm1').bootstrapValidator({
		message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			username : {
				message : '用户名验证失败',
				validators : {
					notEmpty : {
						message : '请输入用户名'
					}
				}
			},
			password : {
				message : '密码验证失败',
				validators : {
					notEmpty : {
						message : '请输入密码'
					}
				}
			}/*,
            verifyCode : {
				message : '验证码验证失败',
				validators : {
					notEmpty : {
						message : '请输入验证码'
					},
                    remote: {
                        message: '验证码错误',
                        url: '/code/check',//后台返回格式：{"valid":false} false表示不合法，验证不通过;表示通过
                        data : '',//自定义提交数据，默认值提交当前input value
                        delay:1000, //这里特别要说明，必须要加此属性，否则用户输入一个字就会访问后台一次，会消耗大量的系统资源，
						type: 'post'
                    },stringLength : {
                        min : 4,
                        max : 4,
                        message : '请输入四位'
                    }
				}
			}*/
		}
	});
	$("#login1").click(function() {
		/*var username = $("input[name=username]").val();
		var password = $("input[name=password]").val();
		if (username == "") {
			setMsg("请输入用户名！");
			return;
		}
		if (password == "") {
			setMsg("请输入密码！");
			return;
		}*/
		var bootstrapValidator = $("#loginForm1").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) return;// 验证失败
		// 销毁验证事件，否则无法提交表单
		/*$("#loginForm1").data('bootstrapValidator').destroy();
        $('#loginForm1').data('bootstrapValidator', null);*/
		// $("#loginForm1").submit();
		$.ajax({
			url : path + "/user/doLogin",
			type : "POST",
			data : $("#loginForm1").serialize(),
			async: false,
			success : function(result) {
				if (result.status == 200) {
                    location.href = path + "/home";
                } else {
                    setMsg(result.msg);
				}
			},
			error : function() {
                // location.href = path + "/";
				alert('出错了')
				// setMsg("服务器错误，请稍后重试！");
			}
		});
	});
})
var setMsg = function(msg) {
	$("#loginMessage").text(msg);
}