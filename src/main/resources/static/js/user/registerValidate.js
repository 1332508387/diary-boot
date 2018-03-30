/**
 * 注册表单验证
 */
$(function() {
	$('#registerFrom').bootstrapValidator({
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
						message : '用户名不能为空'
					},
					stringLength : {
						min : 6,
						max : 20,
						message : '用户名长度必须在6到20之间'
					}
				}
			},
			password : {
				message : '密码验证失败',
				validators : {
					notEmpty : {
						message : '密码不能为空'
					},
					stringLength : {
						min : 6,
						max : 20,
						message : '密码长度必须在6到20之间'
					}
				}
			},
			password2 : {
				message : '确认密码验证失败',
				validators : {
					notEmpty : {
						message : '确认密码不能为空'
					},
					stringLength : {
						min : 6,
						max : 20,
						message : '密码长度必须在6到20之间'
					},
					identical : {// 相同
						field : 'password',
						message : '两次密码不一致'
					}
				}
			},
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
                    },
                    stringLength : {
                        min : 4,
                        max : 4,
                        message : '请输入四位'
                    }
                }
            }
		}
	});
	$("#reg").click(function() {
		/*
		 * var username = $("input[name=username]").val(); var password =
		 * $("input[name=password]").val(); var password2 =
		 * $("input[name=password2]").val(); if(username == ""){
		 * setMsg("用户名不能为空！"); return; } if(password != password2){
		 * setMsg("两次密码不一致！"); return; } if(password == "" && password2 == ""){
		 * setMsg("密码不能为空！") return; }
		 */
		var bootstrapValidator = $("#registerFrom").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid())
			return;// 验证失败

		$.ajax({
			url : path + "/user/doRegister",
			type : "POST",
			data : $("#registerFrom").serialize(),
			success : function(result) {
				if (result.status == 200) {
					setMsg(result.msg)
                    setTimeout(function () {
                        location.href = path + "/login";
                    }, 3000);
                }
                if (result.status != 200){
					$('#registerFrom')[0].reset();
                    setVerify();
                    setMsg(result.msg);
                }
			},
			error : function() {
				setMsg("服务器错误，请稍后重试！");
			}
		});
	});
})
var setMsg = function(msg) {
	$("#regMessage").text(msg);
}