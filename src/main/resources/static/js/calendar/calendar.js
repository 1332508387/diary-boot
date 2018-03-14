/**
 * 日历页面
 */
$(function(){
	// 气泡提示
	$("[data-toggle='tooltip']").tooltip()
	// 加载 KindEditor 组件
	var editor;
	KindEditor.ready(function(K) {
		editor =  window.editor = K.create('#content', {
            langType : 'zh_CN',
            // 提交的参数名称，后台接收此参数
            filePostName  : "uploadPicture",
            // 文件上传路径
            uploadJson : path + '/pic/upload',
            afterBlur: function () { 
            	this.sync(); 
            }, // 不加此属性，表单提交时无法获取文本域中的内容
            afterFocus: function() {
            	// 失去焦点后激活按钮
            	$('#editForm').bootstrapValidator('disableSubmitButtons', false);
            }
        });
    });
	
	// 设置下拉列表值
	var moodMap = getMoodMap();
	setSelValue($("#sel2"), moodMap);
	// 点击 <a>，获取位置，设置到 <input>
	$("#setSite").click(function(){
		setLocation();// 设置位置，IE可用，Chrome，Firefox需翻墙
	});
	
 	// 点击 editModal 弹出窗口的提交按钮
  	$("#btn-submit").on("click", function(){
  		// 表单验证
  		if(!startValid()) return;
  		
  		var id = $("#editForm input[name=id]").val();
  		var writeDate = $("#editForm input[name=writeDate]").val();
  		var moodId = $("#editForm select[name=moodId]").val();
		var keyword = $("#editForm [name=keyword]").val();
  		var site = $("#editForm input[name=site]").val();
		var remark = $("#editForm input[name=remark]").val();
		var isLock = $("#editForm input[name=isLock]:checked").val();
		var content = editor.html();
		
		$("#hiddenForm input[name=id]").val(id);
		$("#hiddenForm input[name=writeDate]").val(writeDate);
		$("#hiddenForm input[name=moodId]").val(moodId);
		$("#hiddenForm input[name=keyword]").val(BASE64.encoder(keyword));
		$("#hiddenForm input[name=site]").val(BASE64.encoder(site));
		$("#hiddenForm input[name=remark]").val(BASE64.encoder(remark));
		$("#hiddenForm input[name=content]").val(BASE64.encoder(content));
		$("#hiddenForm input[name=isLock]").val(isLock);

		$.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: $("#hiddenForm ").serialize(),
            async: false,
            error: function(request) {
            	toastr.error("Server Connection Error...");
            },
            success: function(result) {
            	if(result.status == 200){
            		$("#editModal").modal("hide");
            		// currObj.css('background', 'blue');
            		// currObj.unbind();
            		toastr.success(result.msg);
            	}else{
            		toastr.error(result.msg);
            	}
            }
  		});
  	});
	
	 var writeDateList = getWriteDate();
	$("#dateFlag").datepicker({
        format: 'yyyy-mm-dd',
        minView:'hour',
        language: 'zh-CN',
        // autoclose:true,
        // startDate:new Date(), // 显示从本月往后
        endDate:new Date(), // 显示从本月往后
        todayHighlight: true,	// 高亮显示今天
        // todayBtn: "linked", //如果此值为true 或
		// "linked"，则在日期时间选择器组件的底部显示一个 "Today"
		// 按钮用以选择当前日期。如果是true的话，"Today"
		// 按钮仅仅将视图转到当天的日期，如果是"linked"，当天日期将会被选中。
        pickerPosition: "bottom-left",
        // clearBtn: true
    });
	var prev = $("#dateFlag .datepicker th.prev");
	var next = $("#dateFlag .datepicker th.next");
	prev.text('')
 	prev.attr('class', '');
	next.text('');
	next.attr('class', '');
	setFlag(writeDateList);
	// changeMonth/changeYear/changeDate
	$('#dateFlag').datepicker().on('changeDate', function(ev){ 　// 日期改变事件
		setFlag(writeDateList);
        // var dmonth=ev.date //当前选中日期
        // alert(dmonth)
	});
  	
})

function setFlag(writeDateList){
	// var writeDateList = getWriteDate();
	// var datepickerDate = getDatepickerDate();
	
	var ym = $("#dateFlag .datepicker th.datepicker-switch:first").text();
	var d = $("#dateFlag .datepicker .datepicker-days table tr td:not(.old):not(.new)");
	var yms = ym.split(' ')
	var month = transfromMonth(yms[0].substring(0, 1));
	var year = yms[1];
	d.each(function(index){
		var day = $(this).text();
		if(day.split('').length == 1) day = '0' + day;
		var date = year + '-' + month + '-' + day;
		if($.inArray(date, writeDateList) != -1){
			// 设置开始写的日期的颜色
			if(date == writeDateList[0]){
				$(this).css('background', '#98FB98');
			}else{// 设置已写日期的颜色
				$(this).css('background', '#5CACEE');
			}		
		}
		// 设置漏写日期的颜色
		if($.inArray(date, writeDateList) == -1){
			if(date >= writeDateList[0] && date <= new Date().format('yyyy-MM-dd')){
				var curr = $(this);
				if(date < new Date().format('yyyy-MM-dd')){
					curr.css('background', '#FF6347');
				}
				/*
				 * curr.attr('data-toggle', 'tooltip');
				 * curr.attr('data-placement', 'top');
				 */
				curr.attr('title', '点击补写');
				var thisDate = getDatepickerDate($(this).text())
				curr.click(function(){
					$("#editForm")[0].reset();
					editor.html("");
					$("#write").val(thisDate);
					
					$("#lock .checkbox-inline").empty();
					$("#lock #pwd").empty();
					// 设置日记状态单选按钮
					var radioTarget = $("#lock .checkbox-inline")
					var radio1 = "<input type='radio' name='isLock' id='isLock' value='0' onclick='empty()' checked> 普通";
					var radio2 = "<input type='radio' name='isLock' id='isLock2' value='1' onclick='checkResultShow()'> 锁定";
					radioTarget.eq(0).append(radio1);
					radioTarget.eq(1).append(radio2);
					
					// currObj = $(this);
					// currObj.css('background', 'blue')
					url = path + "/diary/save";
					$("#editModal").modal("show");
				});
			}
		}
	});
}

// 同步ajax获取心情信息，用于下拉列表数据显示
var getMoodMap = function(){
	var res;
	$.ajax({
		url: path + "/mood/getMoodIdAndName",
		type: "GET",
		async: false,
		success: function(data){
			res = data;
		}
	});
	return res;
}

// 设置 <select></select> 选项
var setSelValue = function(sel, map){
	sel.empty();
	sel.append("<option disabled selected value='0'>选择心情</option>");
	sel.append("<option value='0'>全部</option>");
	$.each(map, function(id, name){
		sel.append("<option value=" + id + ">" + name + "</option>");
	});
}
	
// 获取当前用户所有的写作日期
function getWriteDate(){
	var writeDateList;
	$.ajax({
		url: '/statistics/diary/writeDate/list',
		async: false,
		success: function(data){
			writeDateList = data;
		}
	});		
	return writeDateList;
}
	
// 获取当前日历所有日期组成的数组：yyyy-mm-dd
function getDatepickerDate(day){
	var ym = $("#dateFlag .datepicker th.datepicker-switch:first").text();
	var d = $("#dateFlag .datepicker .datepicker-days table tr td:not(.old):not(.new)");
	
	var yms = ym.split(' ')
	var month = transfromMonth(yms[0].substring(0, 1));
	var year = yms[1];
	
	if(day.split('').length == 1) day = '0' + day;
	
	return year + '-' + month + '-' + day;
}

function transfromMonth(m){
	switch(m){
		case '一': return '01';
		case '二': return '02';
		case '三': return '03';
		case '四': return '04';
		case '五': return '05';
		case '六': return '06';
		case '七': return '07';
		case '八': return '08';
		case '九': return '09';
		case '十': return '10';
		case '十一': return '11';
		case '十二': return '12';
	}
}

// 格式化时间
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 // 月份
        "d+" : this.getDate(),                    // 日
        "h+" : this.getHours(),                   // 小时
        "m+" : this.getMinutes(),                 // 分
        "s+" : this.getSeconds(),                 // 秒
        "q+" : Math.floor((this.getMonth()+3)/3), // 季度
        "S"  : this.getMilliseconds()             // 毫秒
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}