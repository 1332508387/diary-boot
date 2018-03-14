function openHtjc() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	htjcObj.StartLiveDetection();
}

function getVersion() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	return htjcObj.GetVersion();
}

function startVedio() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	htjcObj.StartVedio();
	openHtjc();
}

function stopVedio() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	htjcObj.StopVedio();
}
function getErrInfo() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	alert(htjcObj.GetUnqualifiedInfo());
}
function getProduct() {
	var htjcObj = document.getElementById("CommonLiveDetectionOCX");
	return htjcObj.getProduct();
}

function checkHtjc(ULONG) {
	if (ULONG < 0) {
		alert("检测未通过,请重试");
		var imageTbody = document.getElementById("imageTbody");
		var imageTable = document.getElementById("imageTable");
		imageTable.removeChild(imageTbody);
		imageTbody = document.createElement("tbody");
		imageTbody.setAttribute("id", "imageTbody");
		imageTable.appendChild(imageTbody);
	} else if (ULONG == 0) {
		alert("未获得质量合格的图片");
		var imageTbody = document.getElementById("imageTbody");
		var imageTable = document.getElementById("imageTable");
		imageTable.removeChild(imageTbody);
		imageTbody = document.createElement("tbody");
		imageTbody.setAttribute("id", "imageTbody");
		imageTable.appendChild(imageTbody);
	} else {
		alert("检测通过，请点击'身份认证'按钮！");
		var imageTbody = document.getElementById("imageTbody");
		var imageTable = document.getElementById("imageTable");
		imageTable.removeChild(imageTbody);
		imageTbody = document.createElement("tbody");
		imageTbody.setAttribute("id", "imageTbody");
		var ua = navigator.userAgent;
		var s = "MSIE";
		var i = ua.indexOf(s)
		var ieValue = parseFloat(ua.substr(i + s.length));

		for (var t = 0; t < 1; t++) {
			//获取控件对象
			var htjcObj = document.getElementById("CommonLiveDetectionOCX");
			var row = document.createElement("tr");
			var row2 = document.createElement("tr");
			var srcHeader = "data:image/gif;base64,";
			var imageNormal = document.createElement("img");
			//创建正常照片td
			var srcNormal = htjcObj.GetQualifiedImageByIndex(t);

			var divNormal = document.createElement("div");
			divNormal.id = "imageNormal";
			divNormal.innerHTML = srcNormal;
			divNormal.setAttribute("ondblclick", "copyInner(this.innerHTML)");
			divNormal.setAttribute("style", "border-bottom: 1px; border-left: 1px; border-top: 1px; border-right: 1px;");

			var tdNormal = document.createElement("td");
			tdNormal.innerHTML = "正常图像" + (t + 1) + ":";
			tdNormal.appendChild(divNormal);
			row.appendChild(tdNormal);

			//创建缩略图
			var srcShrink = htjcObj.GetShrinkQualifiedImageByIndex(t);
			var divShrink = document.createElement("div");
			divShrink.innerHTML = srcShrink;
			divShrink.setAttribute("ondblclick", "copyInner(this.innerHTML)");
			divShrink.setAttribute("style", "border-bottom: 1px; border-left: 1px; border-top: 1px; border-right: 1px;");

			var tdShrink = document.createElement("td");
			tdShrink.innerHTML = "缩略图像" + (t + 1) + ":";
			tdShrink.appendChild(divShrink);
			row2.appendChild(tdShrink);

			//将row放到tbody中
			imageTbody.appendChild(row);
			imageTbody.appendChild(row2);
			//alert(srcNormal);//正常图像
			//alert(getVersion());//版本号
			//alert(getProduct());//厂商号
			stopVedio();
		}
		imageTable.appendChild(imageTbody);
	}
}

function copyInner(info) {
	window.clipboardData.setData("Text", info);
	alert("复制成功！");
}


function toDoThisWork(thisId) {
	document.getElementById(thisId).value = document.getElementById(thisId).value;
}

function submitCheck() {
	var nameValue = document.getElementById("name").value;
	if (nameValue == "") {
		alert("请输入验证者姓名");
		return;
	}
	var IDcardNumberValue = document.getElementById("IDcardNumber").value;
	if (IDcardNumberValue == "") {
		alert("请输入验证者身份证号码");
		return;
	}
	var pattern = "^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$";
	var checkID = IDcardNumberValue.match(pattern);
	if (checkID == null) {
		alert("身份证号码格式错误,请重新输入");
		return;
	}
	if (document.getElementById("imageNormal") == null) {
		alert("请先进行照片采集");
		return;
	}
	var imageMessage = document.getElementById("imageNormal").innerText;
	if (imageMessage == "") {
		alert("请先进行照片采集");
		return;
	}
	//var key = "aeaf219ca24947128dc8cbd3e80468be";
	var key = "cc90efeef8ee4905b11845adaa053018";
	var token = "";
	var dataRequest = {
		"name" : nameValue,
		"idNum" : IDcardNumberValue,
		"cardCtrlVer" : 1000,
		"picCtrlVer" : 1300,
		"authMode" : 66,
		"picIDcard" : "",
		"picCamera" : imageMessage
	};

	$.ajax({
		type : "GET",
		url : rootPath+"/front/ocx/demoToken?key=" + key,
		beforeSend : function(request1) {
			request1.setRequestHeader("If-Modified-Since","0");
			request1.setRequestHeader("Cache-Control","no-cache"); 
		},
		success : function(data) {
			if (data.code != 0) {
				alert(data.msg);
				return;
			}
			if (data.token == null || data.token == "") {
				alert("token不能为空");
				return;
			}
			token = data.token;
			$.ajax({
				type : "POST",
				url : rootPath+"/front/ocx/demoVerify",
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(dataRequest),
				dataType : "json",
				beforeSend : function(request2) {
					request2.setRequestHeader("token", token);
					request2.setRequestHeader("key", key);
				},
				success : function(result) {
					if (result.code == 0) {
						var firstRes = (result.result).substring(0,1),
							secondRes = (result.result).substring(1,2),
							firstStr = "",
							secondStr = "";
						switch(firstRes){
				    		case "0":
				    			firstStr = "身份证信息有效；";
				    			break;
				    		case "1":
				    			firstStr = "参数错误，";
				    			break;
				    		case "2":
				    			firstStr = "身份证信息无效，";
				    			break;
				    		case "3":
				    			firstStr = "身份证信息未查到，";
				    			break;
				    		case "4":
				    			firstStr = "身份证信息有效，但有效期无效，";
				    			break;
				    		case "5":
				    			firstStr = "身份证信息有效，但有效期未查到，";
				    			break;
				    		case "6":
				    			firstStr = "身份证信息有效，但有效期长度不正确，";
				    			break;
				    		case "7":
				    			firstStr = "身份证信息查询系统错误，";
				    			break;
				    		case "X":
				    			firstStr = "身份证信息查询未被执行，";
				    			break;
				    		default:
				    			firstStr = "系统异常，";
				    			break;
						}
						switch(secondRes){
				    		case "0":
				    			secondStr = "人像比对通过。";
				    			break;
				    		case "1":
				    			secondStr = "人像比对未通过！请重新拍照或传入合格照片。";
				    			break;
				    		case "2":
				    			secondStr = "人像比对未通过！请重新拍照或传入合格照片。";
				    			break;
				    		case "3":
				    			secondStr = "人像比对通过。";
				    			break;
				    		case "4":
				    			secondStr = "人像比对未通过！请重新拍照或传入合格照片。";
				    			break;
				    		case "5":
				    			secondStr = "人像比对未通过！请重新拍照或传入合格照片。";
				    			break;
				    		case "A":
				    			secondStr = "数据库操作错误！请联系服务商。";
				    			break;
				    		case "B":
				    			secondStr = "人像比对异常！请联系服务商。";
				    			break;
				    		case "C":
				    			secondStr = "输入参数错误！";
				    			break;
				    		case "D":
				    			secondStr = "身份证信息未查到！";
				    			break;
				    		case "E":
				    			secondStr = "图像格式不支持！";
				    			break;
				    		case "F":
				    			secondStr = "待比对图像建模失败！请重新拍照或传入合格照片。";
				    			break;
				    		case "G":
				    			secondStr = "身份证照片模板不存在！";
				    			break;
				    		case "H":
				    			secondStr = "活体检测控件版本过期！";
				    			break;
				    		case "I":
				    			secondStr = "活体检测数据校验失败！";
				    			break;
				    		case "J":
				    			secondStr = "现场照片小于5K字节！";
				    			break;
				    		case "K":
				    			secondStr = "公安制定照片或人口照片小于5K字节！";
				    			break;
				    		case "W":
				    			secondStr = "系统其他错误！";
				    			break;
				    		case "X":
				    			secondStr = "人像比对未执行。";
				    			break;
				    		default:
				    			secondStr = "系统异常。";
				    			break;
				    	}
						alert("校验结果：" + firstStr + secondStr);
					} else {
						if(result.msg == "token验证失败")
							alert("若想连续多次体验，请重启浏览器再尝试！");
						else
							alert(result.msg);
					}
				}
			});
		}
	});
}

function setImageFirst() {
	var imageFirst = document.getElementById("imageFirst");
	return imageFirst.click();
}

function setImageSecond() {
	var imageSecond = document.getElementById("imageSecond");
	return imageSecond.click();

}

function imagePreview(f) {
	var id = f.id;
	var preview = document.getElementById(id + "Base");
	var file = f.files[0];
	var reader = new FileReader();
	reader.onloadend = function() {
		preview.src = reader.result;
	}
	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}

function compareFace() {
	var imageFirst = document.getElementById("imageFirst");
	var imageFirstId = imageFirst.id;
	var imageSecond = document.getElementById("imageSecond");
	var imageSecondId = imageSecond.id;
	var imageIds = [imageFirstId,imageSecondId];
	$.ajaxFileUpload({
		url : "compareFace", 
		type : "post", 
		secureuri : false, 
		contentType : false,
		fileElementId : imageIds, 
		dataType : "json", 
		success : function(result) { 
			var res = JSON.parse(result);
			if(res.msg == "SUCCESS"){
				if(parseFloat(res.score) > 0.65)
					alert("两张照片是同一人！");
				else
					alert("两张照片不是同一人！");
			}else{
				alert("比对失败！");
			}
		}
	});
}