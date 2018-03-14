$(function () {
	//加载国际化信息配置
//	loadProperties();
	
	//页面消息处理
	var result = "${result}";
	var msg= "${msg}";
	if(result == 1){
		alert(msg);
	}
	
	var tables = $("#dataTable").dataTable({
    	serverSide: true,//分页，取数据等等的都放到服务端去
        processing: true,//载入数据的时候是否显示“载入中”
        pageLength: 10,  //首次加载的数据条数
        ordering: false,//排序操作在服务端进行，所以可以关了。
        pagingType: "full_numbers",
        autoWidth: false,
        stateSave: true,//保持翻页状态，和tables.fnDraw(false);结合使用
        searching: false,
        ajax: {   //类似jquery的ajax参数，基本都可以用。
        	type: "post",//后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
            url: "getData",
            dataSrc: "data",//默认data，也可以写其他的，格式化table的时候取里面的数据
            data: function (d) {//d是原始的发送给服务器的数据，默认很长。
                var param = {}; //因为服务端排序，可以新建一个参数对象
                param.start = d.start;
                param.length = d.length;
                var formData = $("#queryForm").serializeArray();//把form里面的数据序列化成数组
                formData.forEach(function (e) {
                    param[e.name] = e.value;
                });
            	return param;//自定义需要传递的参数。
       		},
    	},
        columns: [//对应上面thead里面的序列
            //{"data": null,"width":"10px"},
            {"data": null},
       		{"data": 'areaNo'}, //mData 表示发请求时候本列的列明，返回的数据中相同下标名字的数据会填充到这一列
            {"data": 'title', defaultContent: ""},
            {"data": 'code', defaultContent: ""},
            {"data": 'pid', defaultContent: ""},
       		{"data": 'countryCode'}, 
          	{"data": null,"width":"60px"}
        ],
        //操作按钮
        columnDefs: [
            /*{
                targets: 0,//编辑
                data: null,//下面这行，添加了编辑按钮和删除按钮
                defaultContent: "<input type='checkbox' name='checkList'>"
            },*/
            {
                targets: -1,//编辑
                data: null,//下面这行，添加了编辑按钮和删除按钮
                defaultContent: " <div class='btn-group'>"+
            					//"<button id='infoRow' class='btn btn-primary btn-sm' type='button'><i class='fa fa-search'></i> </button>"+
                				"<button id='editRow' class='btn btn-primary btn-sm' type='button'><i class='fa fa-edit'></i></button>"+
                				"<button id='delRow' class='btn btn-primary btn-sm' type='button'><i class='fa fa-trash-o'></i></button></div>"
            }
        ],
      	//每加载完一行的回调函数
        createdRow: function( row, data, index ) {
        	//修改单元格样式
　　　　　　　　	//$('td', row).eq(5).css('font-weight',"bold").css("color","red");//获取到具体行具体格的元素
        },
        initComplete: function (setting, json) {
        	//初始化完成之后替换原先的搜索框。
        },
      	//在每次table被draw完后调用
        fnDrawCallback: function(){
    		var api = this.api();
    		//获取到本页开始的条数
    	　　	var startIndex= api.context[0]._iDisplayStart;
    	　　	api.column(0).nodes().each(function(cell, i) {
    	　　　　	cell.innerHTML = startIndex + i + 1;
    	　　}); 
    	},
        language: {
        	lengthMenu: "",//不显示记录条数选择
          	//lengthMenu: '<select class="form-control input-xsmall">' + '<option value="5">5</option>' + '<option value="10">10</option>' + '<option value="20">20</option>' + '<option value="30">30</option>' + '<option value="40">40</option>' + '<option value="50">50</option>' + '</select>条记录',//左上角的分页大小显示。
          	processing: "<sp:message code='sys.load'/>",//处理页面数据的时候的显示
            paginate: {//分页的样式文本内容。
           		previous: "<",
             	next: ">",
             	first: "<<",
             	last: ">>"
            },
            zeroRecords: "<sp:message code='sys.nodata'/>",// table tbody 内容为空时，tbody的内容。
            // 下面三者构成了总体的左下角的内容。
            // info: "共 _PAGES_ 页，显示第 _START_ 到第 _END_ 条 ",//筛选之后得到 _TOTAL_ 条，初始 _MAX_ 条   左下角的信息显示，大写的词为关键字。
            info: "<sp:message code='sys.pages'/>",
            infoEmpty: "<sp:message code='sys.nodata'/>",// 筛选为空时左下角的显示。0条记录
            infoFiltered: "",	// 筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
           	sSearch: "<sp:message code='sys.keyword'/>：",
        }
    });
	
	//用户类型选择触发
	$("#area").on("change", function () {
		tables.fnDraw();
	});
	
	//查询按钮
	$("#btn-query").on("click", function () {
		tables.fnDraw();
	});
	
	//添加
    $("#btn-add").on("click", function () {
    	url = "add";
    	$("input[name=id]").val("");
    	$("input[name=areaNo]").val("");
		$("input[name=title]").val("");
		$("input[name=code]").val("");
		$("input[name=pid]").val("");
		$("input[name=countryCode]").val("");
    	$("#editModal").modal("show");
    });
	
  	//批量删除
    $("#btn-delAll").on("click", function () {
    	tables.draw( false );
    });
  	
 	//导出
    $("#btn-export").on("click", function () {
    	tables.fnDraw();
    });
	
	//刷新
    $("#btn-re").on("click", function () {
    	tables.fnDraw(false);
    });
	
  	//checkbox全选
    $("#checkAll").on("click", function () {
        if ($(this).prop("checked") === true) {
            $("input[name='checkList']").prop("checked", $(this).prop("checked"));
            $('#dataTable tbody tr').addClass('selected');
        } else {
            $("input[name='checkList']").prop("checked", false);
            $('#dataTable tbody tr').removeClass('selected');
        }
    });
  	
  	//修改 Model
	$('#dataTable tbody').on( 'click', '#editRow', function () {
		url = "update";
		
		var data = tables.api().row($(this).parents('tr')).data();
		
		$("input[name=id]").val(data.id);
		$("input[name=areaNo]").val(data.areaNo);
		$("input[name=title]").val(data.title);
		$("input[name=code]").val(data.code);
		$("input[name=pid]").val(data.pid);
		$("input[name=countryCode]").val(data.countryCode);
		$("textarea[name=remark]").val(data.remark);
//		$("#licenseImg").attr("src","<%=path%>"+data.companyLicenseImg);
		
		$("#editModal").modal("show");
		
    });
  	
	$("#btn-submit").on("click", function(){
//		var url = "update";
  		$.ajax({
            cache: false,
            type: "POST",
            url: url,
            data:$("#editForm").serialize(),
            async: false,
            error: function(request) {
            	toastr.error("Server Connection Error...");
            },
            success: function(data) {
            	if(data.status == 1){
            		$("#editModal").modal("hide");
            		toastr.success("<sp:message code='sys.oper.success'/>");
            		tables.fnDraw(false);
            	}else{
            		toastr.error("<sp:message code='sys.oper.fail'/>");
            	}
            }
        });
  	});
  	
	//删除
	$('#dataTable tbody').on( 'click', '#delRow', function () {
		var data = tables.api().row($(this).parents('tr')).data();
        if(confirm("是否确认删除这条信息?")){
            $.ajax({
                url:'del/'+data.id,
                type:'delete',
                dataType: "json",
                //timeout:"3000",
                cache:"false",
                success:function(data){
                    if(data.status == 1){
                    	//var $toast = toastr['info']('<sp:message code='sys.oper.success'/>');
                    	toastr.success("<sp:message code='sys.oper.success'/>");
                    	tables.api().row().remove().draw(false);//删除这行的数据
                    	//tables.fnDraw();
                        //window.location.reload();//重新刷新页面，还有一种方式：tables.draw(false);(这是不刷新，重新初始化插件，但是做删除时候，老有问题)
                    }else{
                    	toastr.error("<sp:message code='sys.oper.success'/>");
                    }
                },
                error:function(err){
                	toastr.error("Server Connection Error...");
                }
            });
        }
    });
});

function loadProperties(){  
    JQuery.i18n.properties({//加载properties文件  
        name:'syscfg',//properties文件的名称  
        path:'config/',//properties文件的路径  
        mode:'map',//用map的方式使用资源文件中的值  
        callback:function(){  
            console.log($.i18n.prop("landUrl"));//根据key值取得需要的资源  
        }  
    });  
}
