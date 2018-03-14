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
			name : {
				message : '名称验证失败',
				validators : {
					notEmpty : {
						message : '名称不能为空'
					}
				}
			},
			type : {
				message : '类型验证失败',
				validators : {
					notEmpty : {
						message : '类型不能为空'
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
	if(bootstrapValidator.isValid()) return true;// 验证失败
	return false;
}
