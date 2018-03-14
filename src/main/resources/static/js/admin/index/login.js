function doLogin() {
	$('#sign').bootstrapValidator({
		message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			userName : {
				validators : {
					notEmpty : {}
				}
			},
			userPwd : {
				validators : {
					notEmpty : {}
				}
			}
		}
	});

	$.ajax({
		type : "POST",
		url : rootPath + "/admin/account/sign",
		data : $("#sign").serialize(),
		dataType : "json",
		async : true,
		success : function(data) {
			if (data.result == 1) {
				window.location.href = rootPath + "/admin/user/toCenter";
			} else {
				$("#loginMessage").html(data.mes);
			}
		},
		error : function(err) {
			toastr.error("Server Connection Error...");
		}
	});
	return false;
}