$(function(){
    //$('#exceptionTypeIds').select2();
    //setTypeSel($('#keyword'));
    $('#keyword').select2({
        ajax: {
            url: path +  '/exception/type/getTypeNameForSelect2',
            processResults: function (data) {
                return data;
            }
        },
        placeholder: '请选择分类',
        language: {
            noResults: function(){
                return "还未添加任何分类";
            }
        }
    })
    // 加载 KindEditor 组件
    var editor;
    KindEditor.ready(function(K) {
        editor =  window.editor = K.create('#solution', {
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
    tables = $("#dataTable").dataTable({
        serverSide: true,
        processing: true,
        pageLength: 10,
        ordering: false,
        pagingType: "full_numbers",
        autoWidth: false,
        stateSave: true,
        searching: false,
        scrollX: true,
        scrollY: "350px",
        ajax: {
            type: "post",
            url: path + "/exception/record/getData",
            dataSrc: "data",
            data: function (d) {
                var param = {};
                param.pageIndex = d.start;
                param.pageSize = d.length;
                var formData = $("#queryForm").serializeArray();
                formData.forEach(function (e) {
                    param[e.name] = e.value;
                });
                return param;
            },
        },
        columns: [
            {
                "class":'details-control',
                "orderable":false,
                "data":null,
                "defaultContent": ''
            },
            {"data": 'exceptionInfo',
                "render":function (data) {
                    return data == null? '-' : base64Decoder(data);
                }
            },
            {"data": 'exceptionTypes',
                "render":function (data) {
                    if(data == null || data.length == 0) {
                        return '';
                    }else{
                        var names = new Array();
                        data.forEach(function(obj, index){
                            names.push('<a href="javascript:void(0)" onclick="searchForType(\''+obj.id+'\')">' + obj.name + '</a>');
                        });
                        return '<p style="white-space: nowrap;">' + names.join(',') + '</p>';
                    }
                }
            },
            {"data": 'remark',
                "render":function(data){
                    return data == null ? '' : data;
                }
            },
            {"data": 'created',
                "render":function(data){
                    return data == null ? '' : '<p style="white-space: nowrap;">' + millisecondToDate(data, format3) + '</p>';
                }
            },
            {"data": 'updated',
                "render":function(data){
                    return data == null ? '-' : '<p style="white-space: nowrap;">' + millisecondToDate(data, format3) + '</p>';
                }
            },
            {"data": null,"width":"100px"}
        ],
        columnDefs: [
            {
                targets: -1,
                data: null,
                defaultContent:
                " <div class='btn-group'>"+
                "<p style='white-space: nowrap;'><button id='contentRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='查看'><i class='fa fa-camera-retro'></i></button>"+
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
    // model 隐藏式调用
    $('#editModal').on('hide.bs.modal', function () {
//                    $('#lockModal input[name=pwd]').val('');
//                    $('#lockModal button[name=lockSubmit]').unbind();
        $('#customForType').empty();
        $("#editForm select[name=exceptionTypeIds]").empty();
        $("#editForm")[0].reset();
        $("#hiddenForm")[0].reset();
        editor.html("");// 清空 kindeditor
    });
    // 查询按钮
    $("#btn-query").on("click", function () {
        var keys = $('#keyword').val();
        $('#queryForm input[name=keywords]').val(keys);
        tables.fnDraw();
    });
    // 刷新
    $("#btn-re").on("click", function () {
        tables.fnDraw(false);
    });
    // 为分类 select 绑定改变事件
    $('#exceptionTypeIds').change(function () {
        $('#customForType').empty();
        var opv = $(this).val();
        if(opv != null){	// 用户选择添加分类选项
            setTypeCustom();
        }
    });
    // 点击添加按钮，显示 editModal 窗口
    $("#btn-add").on("click", function () {
        url = path + "/exception/record/save";
        // setTypeSel($('#exceptionTypeIds'), -1);
        $('#exceptionTypeIds').select2({
            ajax: {
                url: path +  '/exception/type/getTypeNameForSelect2',
                processResults: function (data) {
                    return data;
                }
            },
            placeholder: '请选择分类',
            tags: true,
            language: {
                noResults: function(){
                    return "还未添加任何分类，可直接输入分类进行添加";
                }
            }
        })
        $("#editModal").modal("show");
    });
    // 点击修改按钮时调用
    $('#dataTable tbody').on( 'click', '#editRow', function () {
        url = path + "/exception/record/update";
        var data = tables.api().row($(this).parents('tr')).data();
        setTypeSel($('#exceptionTypeIds'), data.exceptionTypes);
        var etObjs = data.exceptionTypes;
        var typeIds = new Array();
        $('#exceptionTypeIds').select2({
            ajax: {
                url: path +  '/exception/type/getTypeNameForSelect2',
                processResults: function (data) {
                    return data;
                }
            },
            placeholder: '请选择分类',
            tags: true,
            language: {
                noResults: function(){
                    return "还未添加任何分类，可直接输入分类进行添加";
                }
            }
        });
        $('#editForm input[name=id]').val(data.id);
        $('#editForm input[name=exceptionInfo]').val(base64Decoder(data.exceptionInfo));
        $('#editForm input[name=remark]').val(data.remark);
        editor.html(getSolution(data.id));
        $("#editModal").modal("show");
    });
    // 点击 editModal 弹出窗口的提交按钮
    $("#btn-submit").on("click", function(){
        // 表单验证
        //if(!startValid()) return;

        var id = $('#editForm input[name=id]').val();
        var exceptionTypeIds = $("#editForm select[name=exceptionTypeIds]").val();
        var exceptionInfo = $("#editForm input[name=exceptionInfo]").val();
        var remark = $("#editForm input[name=remark]").val();
        var solution = editor.html();

        $('#hiddenForm input[name=id]').val(id);
        $("#hiddenForm input[name=exceptionTypeIds]").val(exceptionTypeIds);
        $("#hiddenForm input[name=exceptionInfo]").val(BASE64.encoder(exceptionInfo));
        $("#hiddenForm input[name=remark]").val(remark);
        $("#hiddenForm input[name=solution]").val(BASE64.encoder(solution));

        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: $("#hiddenForm ").serialize(),
            async: false,
            success: function(result) {
                if(result.status == 200){
                    $("#editModal").modal("hide");
                    toastr.success(result.msg);
                    tables.fnDraw(false);
                }else{
                    toastr.error(result.msg);
                }
            },
            error: function(request) {
                toastr.error("Server Connection Error...");
            }
        });
    });
    // 点击删除按钮
    $('#dataTable tbody').on( 'click', '#delRow', function () {
        var data = tables.api().row($(this).parents('tr')).data();
        swal({
                title: "确定删除?",
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
                    url:path + '/exception/record/del/' + data.id,
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
    });
    // 点击查看按钮，组织日记内容，并显示
    $('#dataTable tbody').on( 'click', '#contentRow', function () {
        var data = tables.api().row($(this).parents('tr')).data();
        $("#showContentTab").empty();
        var title = "解决方案";
        $("#contentModal h4[id=myModalLabel]").text(title);
        var content = getSolution(data.id);
        $("#showContentTab").append("<tr><td style='width: 100px; height: 40px;'><strong>异常信息:</strong></td><td style='color: #FF3030;''>"+base64Decoder(data.exceptionInfo)+"</td></tr>");
        $("#showContentTab").append("<tr><td style='width: 100px; height: 40px;'><strong>解决方案:</strong></td><td>"+content+"</td></tr>");
        $("#contentModal").modal("show");
    });
    // 为展开按钮绑定点击事件
    $('#dataTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tables.api().row($(this).parents('tr'));
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(showSolution(row.data().id)).show();
            tr.addClass('shown');
        }
    } );
});
function showSolution(erId) {
    return "<table style='background: #e8e8e8;'" +
        "><tr>" +
        "<td style='width: 100px;'>解决方案</td>" +
        "<td>"+getSolution(erId)+"</td>" +
        "</tr>" +
        "</table>";
}
function setTypeSel(selObj, types){
    types.forEach(function(type){
        selObj.append("<option value='"+type.id+"' selected>"+type.name+"</option>");
    });
    /*var reqUrl = '/exception/type/getTypeNameMap';
    $.ajax({
         type: 'GET',
         url: path + reqUrl,
         success: function (typeName) {
             selObj.append("<option value='0' disabled>请选择分类</option>");
             if(typeId != undefined){
                 selObj.append("<option value='-1'>添加分类</option>");
             }
             $.each(typeName, function (id, name) {
                 var op = "<option value='"+id+"'>"+name+"</option>";
                 selObj.append(op);
             });
             if(typeId == undefined || typeId == ''){
                 selObj.val(0);
             } else if(typeId != -1){
                 selObj.val(typeId)
             }
         }
     })*/
}
// 进行验证，成功返回 true
function startValid(){
    // 表单验证
    var bootstrapValidator = $("#editForm").data('bootstrapValidator');
    bootstrapValidator.validate();
    if(bootstrapValidator.isValid() && contentValid()) return true;// 验证失败
    return false;
}
// 获取异常解决方案信息
function getSolution(id) {
    var  solution = '';
    $.ajax({
        type: 'POST',
        async: false,
        url: path + '/exception/record/getSolution/' + id,
        success: function(data) {
            solution = data;
        }
    });
    if(solution != ''){
        solution = base64Decoder(solution);
    }
    return solution;
}
function saveType(aObj) {
    var $name = $('input[name=exceptionTypeName]').val();
    var $remark = $('input[name=exceptionTypeRemark]').val();
    if($name == null || $name == ''){
        alert('分类名不能为空');
        return;
    }
    $.ajax({
        type: 'POST',
        url: path + '/exception/type/save',
        data: {
            name: $name,
            remark: $remark
        },
        success: function (data) {
            var message;
            $('#customForType').empty();
            if(data.status == 200){
                $('#customForType').append('<span class="text-success">分类添加成功</span>');
                $('#exceptionTypeIds').empty();
                setTypeSel($('#exceptionTypeIds'), data.data);
            }else{
                $('#customForType').append('<span class="text-danger">分类添加失败，</span><a onclick="setTypeCustom()">点此</a><span class="text-danger">重试</span>');
            }
        },
        error: function () {
            $('#customForType').empty();
            $('#customForType').append('<span class="text-danger">分类添加失败，</span><a onclick="setTypeCustom()">点此</a><span class="text-danger">重试</span>');
        }
    });
}
function setTypeCustom() {
    $('#customForType').empty();
    /* var nameInp1 = '<div class="col-xs-2" class="custom"><input class="form-control" name="exceptionTypeName" placeholder="分类名"></div>'
     var nameInp2 = '<div class="col-xs-2" class="custom"><input class="form-control" name="exceptionTypeRemark" placeholder="备注信息"></div>'
     var button = '<div class="col-xs-2" class="custom"><a class="btn btn-primary" name="saveType" id="saveType" onclick="saveType(this)">添加</a></div>'
     $('#customForType').append(nameInp1);
     $('#customForType').append(nameInp2);
     $('#customForType').append(button);*/
    var delA = '<div class="col-xs-2" class="custom"><a onclick="removeExceptiontTypeSelected()">删除所选分类</a></div>'
    $('#customForType').append(delA);
}
function removeExceptiontTypeSelected() {
    var etIds = $('#exceptionTypeIds').val();
    var opTextArr = new Array();
    var flag = true;
    etIds.forEach(function (etId) {
        if(!$.isNumeric(etId)) {
            //toastr.error('操作失败，选择了不存在的分类');
            swal("操作失败，选择了不存在的分类", "", "error");
            flag = false;
            return;
        }
        var op = $('#exceptionTypeIds option' + '[value='+etId+']').text();
        opTextArr.push(op);
    });
    if(!flag) return;
    swal({
            title: "确定删除分类"+opTextArr.join(',')+"?",
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
                url: path + '/exception/type/remove/' + etIds.join(','),
                type:'delete',
                cache:"false",
                success:function(result){
                    if(result.status == 200){
                        swal(result.msg, "", "success");
                        //toastr.success(result.msg);
                        $('#exceptionTypeIds').empty();
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
}
function searchForType(key) {
    $('#queryForm input[name=keywords]').val(key);
    tables.fnDraw();
    $('#queryForm input[name=keywords]').val('');
}