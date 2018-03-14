/**
 * 日记锁定
 */
$(function() {

})

function empty() {
	$("#lock #pwd").empty();
}

// 检测用户是否设置了日记密码 0：未设置 1：已设置
function checkDiaryPwd() {
	var flag;
	$.ajax({
		url : path + '/diary/check/pwd',
		type : 'GET',
		async : false,
		success : function(data) {
			flag = data.status;
		}
	});
	return flag;
}

// 当选择 '锁定' 日记时调用
function checkResultShow() {
	var flag = checkDiaryPwd();
	var pwdDiv = $("#lock #pwd");
	pwdDiv.empty();
	if (flag == 0) {
		var span = "<span>您还未设置日记口令，点<a href='javascript:void(0)' id='setPwd'><strong>这里</strong></a>进行设置</span>"
		pwdDiv.append(span);
		showPwdInp();
	}
	if (flag == 1) {
		var span = "<span>日记口令已设置，点<a href='javascript:void(0)' id='updatePwd'><strong>这里</strong></a>进行修改</span>"
		pwdDiv.append(span);
		showUpdateInput();
	}
}

function setPwd(ele) {
	var pwd = $("input[name=password]").val().trim();
	var pwd2 = $("input[name=password2]").val().trim();
	if (pwd == '' || pwd2 == '') {
		alert("不能为空")
		return;
	}
	if (pwd != pwd2) {
		alert("两次输入不一致")
		return;
	}
	var pwdDiv = $("#lock #pwd");
	$.ajax({
			url : path + '/diary/pwd/save',
			type : 'POST',
			data : {'password' : pwd},
			success : function(data) {
				pwdDiv.empty();
				if (data.status == 201) {
					var span = "<span>日记口令设置失败，点<a href='javascript:void(0)' id='setPwd'><strong>这里</strong></a>重新进行设置</span>"
					pwdDiv.append(span);
					showPwdInp();
				}
				if (data.status == 200) {
					var span = "<span>日记口令已设置，点<a href='javascript:void(0)' id='updatePwd'><strong>这里</strong></a>进行修改</span>"
					pwdDiv.append(span);
					showUpdateInput();
				}
			}
		});
}
function updatePwd(ele) {
	var newPwd = $("input[name=newPwd]").val().trim();
	var oldPwd = $("input[name=oldPwd]").val().trim();
	if (newPwd == '' || oldPwd == '') {
		alert("不能为空");
		return;
	}
	var pwdDiv = $("#lock #pwd");
	$.ajax({
			url : path + '/diary/pwd/update',
			type : 'POST',
			data : {
				'password' : newPwd,
				'oldPwd' : oldPwd
			},
			success : function(data) {
				pwdDiv.empty();
				if (data.status == 201) {
					var span = "<span>日记口令修改失败，点<a href='javascript:void(0)' id='updatePwd'><strong>这里</strong></a>重新进行修改</span>"
					pwdDiv.append(span);
					showUpdateInput();
				}
				if (data.status == 200) {
					var span = "<span>日记口令已修改</span>"
					pwdDiv.append(span);
					showUpdateInput();
				}
			}
		});
}
function showPwdInp() {
	var pwdDiv = $("#lock #pwd");
	$("#setPwd").click(function() {
		pwdDiv.empty();
		var input = "<div class='col-xs-3'><input type='text' class='form-control' placeholder='输入口令' name='password'></div>"
				+ "<div class='col-xs-3'><input type='text' class='form-control' placeholder='确认口令' name='password2'></div>"
				+ "<div class='col-xs-2'><button class='btn btn-primary' onclick='setPwd(this)'>设置</button></div>"
		pwdDiv.append(input);
	})
}
function showUpdateInput() {
	var pwdDiv = $("#lock #pwd");
	$("#updatePwd").click(function() {
		pwdDiv.empty();
		var input = "<div class='col-xs-3'><input type='text' class='form-control' placeholder='新口令' name='newPwd'></div>"
				+ "<div class='col-xs-3'><input type='text' class='form-control' placeholder='旧口令' name='oldPwd'></div>"
				+ "<div class='col-xs-2'><button class='btn btn-primary' onclick='updatePwd(this)'>修改</button></div>"
		pwdDiv.append(input);
	})
}

// 检测指定日记是否为锁定状态 0：未锁定 1：锁定
function isLock(diaryId) {
	var status;
	$.ajax({
		url : path + '/diary/pwd/isLock/' + diaryId,
		type : 'GET',
		async : false,
		/*data : {
			'diaryId' : diaryId
		},*/
		success : function(data) {
			status = data;
		}
	});
	return status;
}

// 验证日记口令正确性
function unLock(pwd) {
	var flag = false;
	$.ajax({
		url : path + '/diary/unLock',
		type : 'POST',
		async : false,
		data : {
			password : pwd
		},
		success : function(data) {
			if (data.status == 200) {
				flag = true;
			}
		}
	});
	return flag;
}

// 当点击修改按钮时调用
//function updateCheck(even) {
function updateCheck(id) {
	/*var pwd = $('#lockModal input[name=pwd]').val();
	if (pwd == null || pwd == '') {
		toastr.error('输入不合法');
		// $("#lockModal").modal("hide");
	} else {
		if (unLock(pwd)) { // 口令验证成功
			toastr.success('日记解锁成功');
			$("#lockModal").modal("hide");
			$('#lockModal button[name=lockSubmit]').unbind();
			var data = even.data.table;
			// 从后台查询日记内容
			var diary = getDiary(data.id);

			var content = getContent(data.id); // ajax 从后台获取日记内容
			editor.html(content); // 将日记内容设置到 KindEditor

			url = path + "/diary/update";
			$("#editForm input[name=id]").val(diary.id);
			$("#editForm input[name=writeDate]").val(
					millisecondToDate(diary.writeDate, 'yyyy-MM-dd'));
			$("#editForm select[name=moodId]").val(diary.moodId);
			$("#editForm input[name=keyword]")
					.val(base64Decoder(diary.keyword));
			$("#editForm input[name=site]").val(base64Decoder(diary.site));
			$("#editForm input[name=remark]").val(base64Decoder(diary.remark));
			$("#editModal").modal("show");
		} else {
			// $("#lockModal").modal("hide");
			toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
		}
	}*/
	swal({
		  title: "需要口令!",
		  text: "此日记已锁定，请输入口令再进行操作:",
		  type: "input",
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top",
		  inputPlaceholder: "口令",
		  confirmButtonText: "验证",
		  cancelButtonText: "放弃"
		},
		function(inputValue){
		  if (inputValue === false) return false;
		  
		  if (inputValue === "") {
		    swal.showInputError("请输入口令!");
		    return false
		  }
		  
		  if (unLock(inputValue)) { // 口令验证成功
			  	swal("日记解锁成功", "", "success");
				//toastr.success('日记解锁成功');
				//$("#lockModal").modal("hide");
				//$('#lockModal button[name=lockSubmit]').unbind();
				// 从后台查询日记内容
				var diary = getDiary(id);
	
				var content = getContent(id); // ajax 从后台获取日记内容
				editor.html(content); // 将日记内容设置到 KindEditor
	
				url = path + "/diary/update";
				$("#editForm input[name=id]").val(diary.id);
				$("#editForm input[name=writeDate]").val(
						millisecondToDate(diary.writeDate, 'yyyy-MM-dd'));
				$("#editForm select[name=moodId]").val(diary.moodId);
				$("#editForm input[name=keyword]")
						.val(base64Decoder(diary.keyword));
				$("#editForm input[name=site]").val(base64Decoder(diary.site));
				$("#editForm input[name=remark]").val(base64Decoder(diary.remark));
              	$("#hiddenForm input[name=score]").val(diary.score);
				$("#editModal").modal("show");
			} else {
				// $("#lockModal").modal("hide");
				//toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
				swal("口令有误，如果不是本人，请不要窥探他人隐私", "", "error");
			}
	});
}

// 当点击删除按钮时调用
//function deleteCheck(even) {
function deleteCheck(tables, thisx) {
	/*var pwd = $('#lockModal input[name=pwd]').val();
	if (pwd == null || pwd == '') {
		toastr.error('输入不合法');
		// $("#lockModal").modal("hide");
	} else {
		if (unLock(pwd)) { // 口令验证成功
			toastr.success('日记解锁成功');
			$("#lockModal").modal("hide");
			$('#lockModal button[name=lockSubmit]').unbind();
			delDiary(even.data.table, even.data.thisx);
		} else {
			// $("#lockModal").modal("hide");
			toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
		}
	}*/
	swal({
		  title: "需要口令!",
		  text: "此日记已锁定，请输入口令再进行操作:",
		  type: "input",
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top",
		  inputPlaceholder: "口令",
		  confirmButtonText: "验证",
		  cancelButtonText: "放弃"
		},
		function(inputValue){
		  if (inputValue === false) return false;
		  
		  if (inputValue === "") {
		    swal.showInputError("请输入口令!");
		    return false
		  }
		  
		  if (unLock(inputValue)) { // 口令验证成功
				//toastr.success('日记解锁成功');
			  	//swal("日记解锁成功", "", "success");
				delDiary(tables, thisx, "口令验证成功，");
		  } else {
				// $("#lockModal").modal("hide");
				//toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
			  	swal("口令有误，如果不是本人，请不要窥探他人隐私", "", "error");
		  }
	});
}

// 当点击查看按钮时调用
//function contentCheck(even) {
function contentCheck(id, map) {
	/*var pwd = $('#lockModal input[name=pwd]').val();
	if (pwd == null || pwd == '') {
		toastr.error('输入不合法');
		// $("#lockModal").modal("hide");
	} else {
		if (unLock(pwd)) { // 口令验证成功
			toastr.success('日记解锁成功');
			$("#lockModal").modal("hide");

			var id = even.data.id;
			// 从后台查询日记内容
			var diary = getDiary(id);

			var title = "日期：" + millisecondToDate(diary.writeDate, "yyyy年M月d日")
					+ " 地点：" + base64Decoder(diary.site) + " 心情："
					+ even.data.map[diary.moodId];

			$("#contentModal h4[id=myModalLabel]").text(title);

			var content = getContent(id);
			var tr0 = "<tr><td><h4 class='text-info'>关键字："
					+ base64Decoder(diary.keyword) + " 备注："
					+ base64Decoder(diary.remark) + "</h4></td></tr>";
			// var tr1 = "<tr><td><h4
			// class='text-info'>备注："+base64Decoder(diary.remark)+"</h4></td></tr>";
			var tr2 = "<tr><td><h4 class='text-info'>创建日期："
					+ millisecondToDate(diary.created, "yyyy-MM-dd hh:mm:ss")
					+ " 修改日期："
					+ millisecondToDate(diary.updated, "yyyy-MM-dd hh:mm:ss")
					+ "</h4></td></tr>";
			var tr3 = "<tr><td><p>" + content + "</p></td></tr>";
			$("#showContentTab").append(tr0);
			// $("#showContentTab").append(tr1);
			$("#showContentTab").append(tr2);
			$("#showContentTab").append(tr3);

			$("#contentModal").modal("show");
		} else {
			// $("#lockModal").modal("hide");
			toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
		}
	}*/
	swal({
		  title: "需要口令!",
		  text: "此日记已锁定，请输入口令再进行操作:",
		  type: "input",
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top",
		  inputPlaceholder: "口令",
		  confirmButtonText: "验证",
		  cancelButtonText: "放弃"
		},
		function(inputValue){
		  if (inputValue === false) return false;
		  
		  if (inputValue === "") {
		    swal.showInputError("请输入口令!");
		    return false
		  }
		  
		  if (unLock(inputValue)) { // 口令验证成功
				//toastr.success('日记解锁成功');
			  	swal("日记解锁成功", "", "success");

			  	$("#lockModal").modal("hide");

				// 从后台查询日记内容
				var diary = getDiary(id);

				var title = "日期：" + millisecondToDate(diary.writeDate, "yyyy年M月d日")
						+ " 地点：" + base64Decoder(diary.site) + " 心情："
						+ map[diary.moodId];

				$("#contentModal h4[id=myModalLabel]").text(title);

				var content = getContent(id);
				var tr0 = "<tr><td><h4 class='text-info'>关键字："
						+ base64Decoder(diary.keyword) + " 备注："
						+ base64Decoder(diary.remark) + "</h4></td></tr>";
				// var tr1 = "<tr><td><h4
				// class='text-info'>备注："+base64Decoder(diary.remark)+"</h4></td></tr>";
				var tr2 = "<tr><td><h4 class='text-info'>创建日期："
						+ millisecondToDate(diary.created, "yyyy-MM-dd hh:mm:ss")
						+ " 修改日期："
						+ millisecondToDate(diary.updated, "yyyy-MM-dd hh:mm:ss")
						+ "</h4></td></tr>";
				var tr3 = "<tr><td><p>" + content + "</p></td></tr>";
				$("#showContentTab").append(tr0);
				// $("#showContentTab").append(tr1);
				$("#showContentTab").append(tr2);
				$("#showContentTab").append(tr3);

				$("#contentModal").modal("show");
		  } else {
				// $("#lockModal").modal("hide");
				//toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
			  	swal("口令有误，如果不是本人，请不要窥探他人隐私", "", "error");
		  }
	});
}