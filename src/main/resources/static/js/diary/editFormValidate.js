/**
 * 对 diary.jsp 的 editForm 表单进行验证
 */
$(function(){
	// 初始化表单验证
	editFormValidate();
	// Modal 验证销毁重构，作用是清除上次验证的痕迹（hidden.bs.modal 指定在窗口隐藏式调用）
    $('#editModal').on('hidden.bs.modal', function() {
        $("#editForm").data('bootstrapValidator').destroy();
        $('#editForm').data('bootstrapValidator', null);
        editFormValidate();
    });
})
// 定义表单验证规则
var editFormValidate = function() {
	$('#editForm').bootstrapValidator({
		message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			writeDate : {
				message : '日期验证失败',
				validators : {
					notEmpty : {
						message : '日期不能为空'
					}
				}
			},
			moodId : {
				message : '心情验证失败',
				validators : {
					notEmpty : {
						message : '心情不能为空'
					}
				}
			},
			keyword : {
				message : '关键字验证失败',
				validators : {
					notEmpty : {
						message : '关键字不能为空'
					}
				}
			},
			site : {
				message : '地点验证失败',
				validators : {
					notEmpty : {
						message : '地点不能为空'
					}
				}
			},
			content : {
				message : '内容证失败',
				validators : {
					notEmpty : {
						message : '内容不能为空'
					}
				}
			}
		}
	});
}
// 进行验证，成功返回 true
var startValid = function(){
	// 表单验证
	var bootstrapValidator = $("#editForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if(bootstrapValidator.isValid() && contentValid()) return true;// 验证失败
	return false;
}
// 对 KindEditor 单独验证
var contentValid = function(){
	var content = editor.html();
	if(content == null || content == ''){
		alert("内容不能为空")
		return false;
	}
	return true;
}