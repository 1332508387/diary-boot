$(function () {
	// 气泡提示
	$("[data-toggle='tooltip']").tooltip();
	// 加载 KindEditor 组件
	var editor;
	KindEditor.ready(function(K) {
		editor =  window.editor = K.create('#content', {
            langType : 'zh_CN',
            // 提交的参数名称，后台接收此参数
            filePostName  : "uploadPicture",
            imageSizeLimit: '5MB',
            mageUploadLimit: 5,
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
    // 初始化双日历插件
    $('#dateTimeRange').daterangepicker({
        language:  'zh-CN',
        applyClass : 'btn-sm btn-success',
        cancelClass : 'btn-sm btn-default',
        locale: {
            applyLabel: '确认',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            daysOfWeek : ["日", "一", "二", "三", "四", "五", "六"],
            monthNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月 "],
            firstDay : 1
        },
        ranges : {
            //'最近1小时': [moment().subtract('hours',1), moment()],
            //'今日': [moment().startOf('day'), moment()],
            //'昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
            '最近7日': [moment().subtract('days', 6), moment()],
            '最近30日': [moment().subtract('days', 29), moment()],
            '本月': [moment().startOf("month"),moment().endOf("month")],
            '上个月': [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]
        },
        opens : 'right',    // 日期选择框的弹出位置
        separator : ' 至 ',
        showWeekNumbers : true,     // 是否显示第几周
        //timePicker: true,
        //timePickerIncrement : 10, // 时间的增量，单位为分钟
        //timePicker12Hour : false, // 是否使用12小时制来显示时间
        //maxDate : moment(),           // 最大时间
        format: 'YYYY-MM-DD'

    }, function(start, end, label) { // 格式化日期显示框
        $('#startTime').val(start.format('YYYY-MM-DD'));
        $('#endTime').val(end.format('YYYY-MM-DD'));
    })
        .next().on('click', function(){
        $(this).prev().focus();
    });
    $('#dateTimeRange').val("");
    $('#dateTimeRange').change(function(){
        var date = $('#dateTimeRange').val();
        $('#clearDate').remove();
        if(date != ''){
            var a = "<a id='clearDate' style='cursor:pointer;'>清除</a>";
            $('#dateDiv').after(a);
            $('#clearDate').click(function(){
                $('#dateTimeRange').val("");
                $('#startTime').val('');
                $('#endTime').val('');
                $(this).remove();
            });
        }
    });
	// 为 modal 添加拖拽功能
	$(".modal").draggable({
		cursor: "move",
		handle: '.modal-header'
	});
	
	// modal 隐藏后触发
	$('#lockModal').on('hide.bs.modal', function () {
		$('#lockModal input[name=pwd]').val('');
		$('#lockModal button[name=lockSubmit]').unbind();
	});
	
	$('#contentModal').on('hide.bs.modal', function () {
		$("#showContent").empty();
		$("#showContentTab").empty();
	});
	
	/*$('#editModal').on('hide.bs.modal', function () {
		$("#lock .checkbox-inline").empty();
		$("#lock #pwd").empty();
	});*/
				
	// 设置下拉列表值
	var moodMap = getMoodMap();
	setSelValue($("#sel1"), moodMap);
	setSelValue($("#sel2"), moodMap);
	var format1 = "yyyy年M月d日";
	var format2 = "yyyy-MM-dd";
	var format3 = "yyyy-MM-dd hh:mm:ss";
	var tables = $("#dataTable").dataTable({
    	serverSide: true,// 分页，取数据等等的都放到服务端去
        processing: true,// 载入数据的时候是否显示“载入中”
        pageLength: 10,  // 首次加载的数据条数
        ordering: false,// 排序操作在服务端进行，所以可以关了。
        pagingType: "full_numbers",
        autoWidth: false,
        stateSave: true,// 保持翻页状态，和tables.fnDraw(false);结合使用
        searching: false,
        scrollX: true,			// 横向滚动条
        //scrollY: "350px",			// 纵向滚动条
        ajax: {   // 类似jquery的ajax参数，基本都可以用。
        	type: "GET",// 后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
            url: path + "/diary/list",
            dataSrc: "data",// 默认data，也可以写其他的，格式化table的时候取里面的数据
            data: function (d) {// d是原始的发送给服务器的数据，默认很长。
                var param = {}; // 因为服务端排序，可以新建一个参数对象
                param.pageIndex = d.start;
                param.pageSize = d.length;
                var formData = $("#queryForm").serializeArray();// 把form里面的数据序列化成数组
                formData.forEach(function (e) {
                    param[e.name] = e.value;
                });
            	return param;// 自定义需要传递的参数。
       		},
    	},
        columns: [// 对应上面thead里面的序列
            // {"data": null,"width":"10px"},
            // {"data": null},
            {
                "class":'details-control',
                "orderable":false,
                "data":null,
                "defaultContent": ''
            },
       		{"data": 'userId'},
            {"data": 'writeDate',
       			"render":function(data){
       				return data == null ? '-' : millisecondToDate(data, format1);
       			}	
            },
            {"data": 'site',
				"render":function(data){
					return data == null ? '-' : base64Decoder(data);
				}
            },
            {"data": 'moodId', 
            	"render":function(data){
            		return data == null ? '-' : moodMap[data] == undefined ? '-' : moodMap[data];
            	}
            },
            {"data": 'keyword',
				"render":function(data){
					return data == null ? '-' : base64Decoder(data);
				}
            },
       		{"data": 'remark',
				"render":function(data){
					return data == null ? '-' : base64Decoder(data);
				}
       		},
       		{"data": 'status',
       			"render":function(data){
       				if(data == 0) return '正常';
       				if(data == 1) return '补写';
       				if(data == 2) return '锁定';
       				return '';
       			}
       		},
       		{"data": 'created',
       			"render":function(data){
       				return data == null ? '-' : millisecondToDate(data, format3);
       			}
       		}, 
       		{"data": 'updated',
       			"render":function(data){
       				return data == null ? '-' : millisecondToDate(data, format3);
       			}
       		},
          	{"data": null,"width":"100px"}
       		/*{"data": 'status',
       			"render":function(data){
       				return data == 2 ? 
       						" <div class='btn-group'>"+
            				"<p><button id='unlock' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='点击解锁'><i class='glyphicon glyphicon-lock'></i></button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</p></div>"
            				: 
       						"<div class='btn-group'>"+
            				"<p><button id='contentRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='查看'><i class='fa fa-camera-retro'></i></button>"+
            				"<button id='editRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='编辑'><i class='fa fa-edit'></i></button>"+
            				"<button id='delRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='删除'><i class='fa fa-trash-o'></i></button>&nbsp&nbsp</p></div>";
   				}
       		}*/
        ],
        // 操作按钮
        columnDefs: [
            {
                targets: -1,// 编辑
                data: null,// 下面这行，添加了编辑按钮和删除按钮
                defaultContent: 
                				" <div class='btn-group'>"+
                				"<p><button id='contentRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='查看'><i class='fa fa-camera-retro'></i></button>"+
                				"<button id='editRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='编辑'><i class='fa fa-edit'></i></button>"+
                				"<button id='delRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='删除'><i class='fa fa-trash-o'></i></button></p></div>"
            }
        ],
      	// 在每次table被draw完后调用
        fnDrawCallback: function(){
    		var api = this.api();
    		// 获取到本页开始的条数
    	　　	var startIndex= api.context[0]._iDisplayStart;
    	　　	api.column(0).nodes().each(function(cell, i) {
    	　　　　	cell.innerHTML = startIndex + i + 1;
    	　　}); 
    	},
        language: {
        	lengthMenu: "",// 不显示记录条数选择
          	processing: "加载中...",// 处理页面数据的时候的显示
            paginate: {// 分页的样式文本内容。
           		previous: "<",
             	next: ">",
             	first: "<<",
             	last: ">>"
            },
            zeroRecords: "无数据",// table tbody 内容为空时，tbody的内容。
            info: "第_START_-_END_条,共 _TOTAL_ 条,共_PAGES_ 页",
            infoEmpty: "无数据",// 筛选为空时左下角的显示。0条记录
            infoFiltered: "",	// 筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
           	sSearch: "关键字：",
        }
    });
		
	// 初始化时间插件
	$("#writeDate").datepicker({
        format: 'yyyy-mm-dd',
        minView:'hour',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(), // 显示从本月往后
        endDate: new Date(),
        todayHighlight: true,	// 高亮显示今天
        todayBtn: "linked", //如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "Today" 按钮用以选择当前日期。如果是true的话，"Today" 按钮仅仅将视图转到当天的日期，如果是"linked"，当天日期将会被选中。
        clearBtn: true
    });
	
	// 点击查看按钮，组织日记内容，并显示
  	$('#dataTable tbody').on( 'click', '#contentRow', function () {
  		var data = tables.api().row($(this).parents('tr')).data();
  		
  		// 检测日记是否锁定
		var lock = isLock(data.id);
		if(lock == 1){	// 锁定
			//$('#lockModal').modal('show');
			//$('#lockModal button[name=lockSubmit]').on('click', {id:data.id, map:moodMap}, contentCheck);
			contentCheck(data.id, moodMap);
			return;
		} 
  		
  		$("#showContent").empty();
  		var title = "日期：" + millisecondToDate(data.writeDate, format1) 
  					+ " 地点：" + base64Decoder(data.site) + " 心情：" + moodMap[data.moodId];
  		$("#contentModal h4[id=myModalLabel]").text(title);
 		var content = getContent(data.id);
 		$("#showContentTab").append("<tr><td><p>"+content+"</p></td></tr>");
  		$("#contentModal").modal("show");
  	});
				
	// 点击 <a>，获取位置，设置到 <input>
	$("#setSite").click(function(){
		setLocation();// 设置位置，IE可用，Chrome，Firefox需翻墙
	});
	
 	// 点击添加按钮，显示 editModal 窗口
    $("#btn-add").on("click", function () {
    	url = path + "/diary/save";
    	$("#editForm input[name=id]").val("");
    	$("#editForm input[name=writeDate]").val("");
		$("#editForm select[name=moodId]").val("0");
		$("#editForm input[name=keyword]").val("");
		$("#editForm input[name=site]").val("");
		$("#editForm input[name=remark]").val("");

        // 设置星星
        setStar(1);

		$("#lock .checkbox-inline").empty();
		$("#lock #pwd").empty();
		// 设置日记状态单选按钮
		var radioTarget = $("#lock .checkbox-inline")
		var radio1 = "<input type='radio' name='isLock' id='isLock' value='0' onclick='empty()' checked> 普通";
		var radio2 = "<input type='radio' name='isLock' id='isLock2' value='1' onclick='checkResultShow()'> 锁定";
		radioTarget.eq(0).append(radio1);
		radioTarget.eq(1).append(radio2);
		
		editor.html("");// 清空 kindeditor
    	$("#editModal").modal("show");
    });
 	
  	// 点击修改按钮，显示 editModal 窗口，并回显数据
	$('#dataTable tbody').on( 'click', '#editRow', function () {
		var data = tables.api().row($(this).parents('tr')).data();

		// 设置星星
		setStar(data.score);

		// 设置日记状态单选按钮
		var radioTarget = $("#lock .checkbox-inline")
		radioTarget.empty();
		var radio1; 
		var radio2;
		
		$("#lock .checkbox-inline").empty();
		$("#lock #pwd").empty();
		// 检测日记是否锁定
		var lock = isLock(data.id);
		if(lock == 1){	// 锁定
			radio1 = "<input type='radio' name='isLock' id='isLock' value='0' onclick='empty()'> 普通";
			radio2 = "<input type='radio' name='isLock' id='isLock2' value='1' onclick='checkResultShow()' checked> 锁定";
			radioTarget.eq(0).append(radio1);
			radioTarget.eq(1).append(radio2);
			
			//$('#lockModal').modal('show');
			//$('#lockModal button[name=lockSubmit]').on('click', {table:data}, updateCheck)
			updateCheck(data.id);
			return;
		} 
		
		if(lock == 0){	// 未锁定
			radio1 = "<input type='radio' name='isLock' id='isLock' value='0' onclick='empty()' checked> 普通";
			radio2 = "<input type='radio' name='isLock' id='isLock2' value='1' onclick='checkResultShow()'> 锁定";
			radioTarget.eq(0).append(radio1);
			radioTarget.eq(1).append(radio2);
			
			var content = getContent(data.id); // ajax 从后台获取日记内容
			editor.html(content);	// 将日记内容设置到 KindEditor
			
			url = path + "/diary/update";
			$("#editForm input[name=id]").val(data.id);
	    	$("#editForm input[name=writeDate]").val(millisecondToDate(data.writeDate, format2));
			$("#editForm select[name=moodId]").val(data.moodId);
			$("#editForm input[name=keyword]").val(base64Decoder(data.keyword));
			$("#editForm input[name=site]").val(base64Decoder(data.site));
			$("#editForm input[name=remark]").val(base64Decoder(data.remark));
            $("#hiddenForm input[name=score]").val(data.score);
			$("#editModal").modal("show");
		}
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
            		toastr.success(result.msg);
            		tables.fnDraw(false);
            	}else{
            		toastr.error(result.msg);
            	}
            }
  		});
  	});

  	// 点击删除按钮
	$('#dataTable tbody').on( 'click', '#delRow', function () {
		var data = tables.api().row($(this).parents('tr')).data();
		// 检测日记是否锁定
		var lock = isLock(data.id);
		if(lock == 1){	// 锁定
			//$('#lockModal').modal('show');
			//$('#lockModal button[name=lockSubmit]').on('click', {table:tables,thisx:$(this)}, deleteCheck);
			deleteCheck(tables, $(this));
			return;
		} 
		
		delDiary(tables, $(this), "");
        /*if(confirm("是否确认删除这条信息?")){
            $.ajax({
                url:path + '/diary/del/'+data.id,
                type:'delete',
                dataType: "json",
                cache:"false",
                success:function(result){
                    if(result.status == 200){
                    	toastr.success(result.msg);
                    	tables.api().row().remove().draw(false);// 删除这行的数据
                    }else{
                    	toastr.error(result.msg);
                    }
                },
                error:function(err){
                	toastr.error("Server Connection Error...");
                }
            });
        }*/
    });	
		
	// 点击解锁
	$('#dataTable tbody').on( 'click', '#unlock', function () {
		$("#lockModal h4").text("解锁")
		$("#lockModal").modal("show");
  	});
	
	// 查询按钮
	$("#btn-query").on("click", function () {
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		if(startTime != "" && endTime != "" && startTime >= endTime){
			toastr.error("时间不合法");
			return;
		}
		tables.fnDraw();
	});
				
  	// 批量删除
    $("#btn-delAll").on("click", function () {
    	tables.draw( false );
    });
  	
 	// 导出
    $("#btn-export").on("click", function () {
    	tables.fnDraw();
    });
	
	// 刷新
    $("#btn-re").on("click", function () {
    	tables.fnDraw(false);
    });
				
  	// checkbox全选
    $("#checkAll").on("click", function () {
        if ($(this).prop("checked") === true) {
            $("input[name='checkList']").prop("checked", $(this).prop("checked"));
            $('#dataTable tbody tr').addClass('selected');
        } else {
            $("input[name='checkList']").prop("checked", false);
            $('#dataTable tbody tr').removeClass('selected');
        }
    });

    // 为展开按钮绑定点击事件
    $('#dataTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tables.api().row($(this).parents('tr'));
        // 检测日记是否锁定
        var lock = isLock(row.data().id);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            if (lock == 1) {
                showContentCheck(row);
                return;
            }
            row.child(showContent(row.data().id)).show();
            tr.addClass('shown');
        }
    } );
});

// 设置星星 s:星星数量
function setStar (starNum) {
    $('#star').empty();
    $('#star').raty({
        //cancel   : true,
        cancelOff: '/res/plugins/raty-2.5.2/img/cancel-off.png',
        cancelOn : '/res/plugins/raty-2.5.2/img/cancel-on.png',
        size     : 24,
        starOff  : '/res/plugins/raty-2.5.2/img/star-off.png',
        starOn   : '/res/plugins/raty-2.5.2/img/star-on.png',
        score	 : starNum,
        mouseout: function(s, evt) {
            var starId = $(this).attr('id');
            var score = $('input[name=score]').val();
            if (score == s) return;
            $('input[name=score]').val(s);
        }
    });
}

// 同步ajax获取心情信息，用于下拉列表数据显示
var getMoodMap = function(){
	var res = {};
	$.ajax({
		url: path + "/mood/getMoodMap",
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

// Base64 解码
function base64Decoder(base){
	var unicode= BASE64.decoder(base); // 返回会解码后的unicode码数组
	// 将 Unicode 编码转化为字符串
	var content = '';
	for(var i = 0 , len =  unicode.length ; i < len ;++i){
		content += String.fromCharCode(unicode[i]);
	}
	return content;
}

// 从后台获取指定 ID 的日记内容
var getContent = function(id){
    var content = "";
    $.ajax({
        url: path + "/diary/content/" + id,
        type: "GET",
        async: false,
        success: function(result){
            if(result.status == 200) content = base64Decoder(result.data.content);
        }
    });
    return content;
}

function showContentCheck(row) {
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
                row.child(showContent(row.data().id)).show();
            } else {
                // $("#lockModal").modal("hide");
                //toastr.error('口令有误，如果不是本人，请不要窥探他人隐私');
                swal("口令有误，如果不是本人，请不要窥探他人隐私", "", "error");
            }
        });
}

function showContent(id) {
    return "<table style='background: #e8e8e8;'" +
        "><tr>" +
        "<td style='width: 100px;'>内容</td>" +
        "<td>"+getContent(id)+"</td>" +
        "</tr>" +
        "</table>";
}

// 从后台获取指定 ID 的日记信息
function getDiary(id){
	var diary;
	$.ajax({
		url: path + '/diary/getDiary/' + id,
		type: "GET",
		async: false,
		success: function(data){
			if(data.status == 200) diary = data.data;
		}
	});
	return diary;
}

// 删除指定 ID 的日记信息
function delDiary(tables, thisx, msg){
	var data = tables.api().row(thisx.parents('tr')).data();
	
	swal({
		  title: msg + "确定删除?",
		  text: "删除后将无法恢复!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "删除",
		  cancelButtonText: "放弃",
		  closeOnConfirm: false,
		},
		function(){
		  $.ajax({
	            url:path + '/diary/del/' + data.id,
	            type:'delete',
	            dataType: "json",
	            cache:"false",
	            success:function(result){
	                if(result.status == 200){
	                	swal(result.msg, "", "success");
	                	//toastr.success(result.msg);
	                	tables.api().row().remove().draw(false);// 删除这行的数据
	                }else{
	                	swal(result.msg, "", "error");
	                	//toastr.error(result.msg);
	                }
	            },
	            error:function(err){
	            	swal("Server Connection Error...", "", "error");
	            	//toastr.error("Server Connection Error...");
	            }
	       });
	});
	/*if(confirm("是否确认删除这条信息?")){
        $.ajax({
            url:path + '/diary/del/' + data.id,
            type:'delete',
            dataType: "json",
            cache:"false",
            success:function(result){
                if(result.status == 200){
                	toastr.success(result.msg);
                	tables.api().row().remove().draw(false);// 删除这行的数据
                }else{
                	toastr.error(result.msg);
                }
            },
            error:function(err){
            	toastr.error("Server Connection Error...");
            }
        });
    }*/
}

//将毫毫秒转化为日期
function millisecondToDate(ms, format){
	if(ms == null){
		return '';
	}
	var date = new Date(parseInt(ms));
	return date.format(format);
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