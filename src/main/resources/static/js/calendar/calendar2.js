$(function(){
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
            		e.id = 1;
            		e.backgroundColor = '#5CACEE';
            		e.textColor = '#000000';
            		e.borderColor = '#5CACEE';
            		// 刷新事件状态
            		$('#dateFlag').fullCalendar('renderEvent', e);
            		toastr.success(result.msg);
            	}else{
            		toastr.error(result.msg);
            	}
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
	
	//var dates = getAllDate('2017-02-01','2017-03-1')
	var format2 = "yyyy-MM-dd";
	 $('#dateFlag').fullCalendar({
	        weekMode: {fixed: 5},
	        header: {left: '', center: 'title', right: 'prev,today,next'},
	        titleFormat: "YYYY年MM月",
	        handleWindowResize: false,
	        eventLimit: true, // allow "more" link when too many events  monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
	        firstDay: 1,
	        aspectRatio: 2,
	        buttonText: {
	            today: '今天',
	            prev: '上一月',
	            next: '下一月'  },
	        firstDay: 1,
	        editable: false,
	        events: function (start, end, timezone, callback) {
	            $.ajax({
	                type: "GET",
	                url: '/statistics/diary/writeDate/list2',
	                dataType: 'json',
	                data: {startDate: new Date(start).formatDate(format2), endDate: new Date().formatDate(format2), filter: $("#hid").val()},
	                success: function (dates) { 
	                	var events = []; 
	                	if(dates == []){
	                		return;
	                	}
	                	/* $.each(dates, function(index, date){
	                		events.push({
								title: date,
	                        	start: date,
	                            backgroundColor: '#E0FFFF',
	                            textColor: '#000000',
	                            borderColor: '#E0FFFF',
	                        });
	                	}) */
	                	var currDay = new Date().formatDate(format2);
	                	var startDay = new Date(start).formatDate(format2);
	                	var currMonthDays = getAllDate(startDay, currDay);
	                	//alert(currDay)
	                	//alert(currMonthDays)
	                	// 遍历 start 和 end 之间所有的日期，并判断这段时间内所写的日记日期是否包含该日期
	                	$.each(currMonthDays, function(index, date){
	                		var thisDay = $.inArray(date, dates);
	                		if(thisDay != -1){	// 包含该日期，日记已写
	                			if(date == dates[0]){
	                				events.push({	// 开写日期
										id: '2',			                				
										title: date,
			                        	start: date,
			                            backgroundColor: '#98FB98',
			                            textColor: '#000000',
			                            borderColor: '#98FB98'
			                        });
	                				return;
	                			}
	                			events.push({
									id: '1',			                				
									title: date,
		                        	start: date,
		                            backgroundColor: '#5CACEE',
		                            textColor: '#000000',
		                            borderColor: '#5CACEE'
		                        });
	                		} 
	                		if(thisDay == -1 && date > dates[0]){	// 不包含该日期
	                			events.push({
	                				id: '-1',
									title: date,
		                        	start: date,
		                            backgroundColor: '#FF6347',
		                            textColor: '#000000',
		                            borderColor: '#FF6347'
		                        });
	                		}
	                	});
	                    callback(events);
	                }
	            });
	        },
	        eventClick: function(event, jsEvent, view) {	// 点击事件时触发
	        	if(event.id == -1){
	        		preSave(new Date(event.start).formatDate(format2));
	        		e = event;
	        	}else{
	        		look(new Date(event.start).formatDate(format2), moodMap);
				}
	        },
	        eventMouseover: function(event, jsEvent, view){
	        	if(event.id == -1){
		        	$(this).children('div').attr('title', '点击补写日记');
	        	}else{
                    $(this).children('div').attr('title', '点击查看日记');
				}
	        },
	        loading: function (isLoading, view) { if (isLoading == false) {
	                $(".fc-more").parent("div").css("text-align", "center");
	            }
	        },
	       /*  dayClick:function(){
	        	alert('click')
	        }, */
	        eventRender: function (calEvent, element, view) {
	            element.attr("id", calEvent.id);
	            element.attr("tabindex", "0");
	            element.attr("role", "button");
	            element.attr("data-toggle", "popover");
	            element.attr("data-trigger", "focus");
	            element.attr("data-content", calEvent.content); if (calEvent.key == "meeting") {
	                element.attr("data-original-title", calEvent.title);
	                element.find("div").prepend('<i class="fa fa-stop font-red-haze"></i>');
	            } if (calEvent.key == "outgoing") {
	                element.attr("data-original-title", calEvent.title); if (calEvent.typeId == 10) {//请假  element.find("div").prepend('<i class="fa fa-stop font-yellow-crusta"></i>');
	                } else {
	                    element.find("div").prepend('<i class="fa fa-stop font-blue-steel"></i>');
	                }
	            }
	        },
	        selectable: true  });
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

// 查看日记
function look(writeDate, moodMap) {
    $.ajax({
		type: 'GET',
		url: path +  '/diary/pwd/isLock2',
		data: {'writeDate' : writeDate},
		success: function (data) {
			if(data == 1) {
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
                            swal("已成功解锁", "", "success");
                            showDiary(writeDate, moodMap);
                            $('#contentModal').modal('show');
                        } else {
                            swal("口令有误，如果不是本人，请不要窥探他人隐私", "", "error");
                        }
                    });
			} else {
                showDiary(writeDate, moodMap);
                $('#contentModal').modal('show');
			}

        }
	});
}

function showDiary(writeDate, moodMap){
    var diary = getDiaryByWriteDate(writeDate);
    var title = "日期：" + millisecondToDate(diary.writeDate, "yyyy年M月d日")
        + " 地点：" + base64Decoder(diary.site) + " 心情："
        + moodMap[diary.moodId];

    $("#contentModal h4[id=myModalLabel]").empty();
    $("#contentModal h4[id=myModalLabel]").text(title);

    var content = getContent(diary.id);
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
    $("#showContentTab").empty();
    $("#showContentTab").append(tr0);
    // $("#showContentTab").append(tr1);
    $("#showContentTab").append(tr2);
    $("#showContentTab").append(tr3);
}

function getContent(id){
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

// 当点击补写时触发
function preSave(thisDate){
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
	setStar(1);
	$("#editModal").modal("show");
}

function getDiaryByWriteDate(writeDate) {
	var diary = {};
	$.ajax({
		type: 'GET',
		url: path + '/calendar/getDiaryByWD/' + writeDate,
		async: false,
		success: function (data) {
			if(data.status == 200) {
                diary = data.data;
            }
        }
	});
	return diary;
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

// 将毫毫秒转化为日期
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

Date.prototype.formatDate=function (fmt){
   /*  var s='';
    s+=this.getFullYear()+'-';          // 获取年份。
    s+=(this.getMonth()+1)+"-";         // 获取月份。
    s+= this.getDate();                 // 获取日。
    return(s);   */                        // 返回日期。
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
};
		
// 获取两个日期间的所有日期
function getAllDate(begin,end){
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1]-1, ab[2] - 1);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1]-1, ae[2] - 1);
    var unixDb=db.getTime();
    var unixDe=de.getTime();
    var dates = new Array();
    for(var k=unixDb;k<=unixDe;){
	    //console.log((new Date(parseInt(k))).formatDate());
	    k=k+24*60*60*1000;
	    dates.push((new Date(parseInt(k))).formatDate("yyyy-MM-dd"));
    }
    return dates;
}