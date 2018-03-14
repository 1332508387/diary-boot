
function go_to_href(href){
	//href = basePath + '/' + href;
	window.location.href=href;
}

function go_to_href2(bPath,href){
	href = bPath + '/' + href;
	window.location.href=href;
}


function btn_copy_fun(obj){
    var val = $(obj).prev().html();

    var clipboard = new Clipboard('.btn-copy', {
        text: function(trigger) {
            return val;
        }
    });
    
     clipboard.on('success', function(e) {
            layer.tips('复制成功', $(obj));
         });
     
         clipboard.on('error', function(e) {
             layer.tips('复制失败。', $(obj));
         });
}
/**
 * 交易类型翻译器
 */
function trans_type_translator(trans_type,business_type){
	if(business_type == 1){
		if(trans_type == 0 || trans_type == 1 || trans_type == 2){
	        return "发行";
	    }else if(trans_type == 3){
	        return"声明";
	    }else if(trans_type == 4 || trans_type == 5 || trans_type == 11 || trans_type == 13){
	        return "转让";
	    }else if(trans_type == 6 || trans_type == 7 || trans_type == 12 || trans_type == 14){
	        return "贴现";
	    }else if(trans_type == 8 || trans_type == 9 || trans_type == 10){
	        return "兑付";
	    }else if(trans_type == 15){
	        return "拆分";
	    }else if(trans_type == 16){
	        return "合并";
	    }else{
	        return "其他";
	    }
	}else if(business_type == 180){
		if(trans_type == 0){
	        return "资产申购";
	    }else if(trans_type == 1){
	        return "发起转让";
	    }else if(trans_type == 2){
	        return "接收确认";
	    }else if(trans_type == 3){
	        return "资产赎回";
	    }else{
	        return "其他";
	    }
	}else{
		return "其他"; 
	}
	
}
/**
 * 业务类型翻译器
 * @param business_type
 * @returns {String}
 */
function business_type_translator(business_type){
	if(business_type == 1){
        return "数字资产";
    }else if(business_type == 180){
       return "微黄金";
    }else{
        return "其他";
    }
}

/**
 * 添加千分号
 * @param v_num
 */
function add_qfh(v_num){
	var s_num = '' + v_num;
	var regexStr = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
	var resultStr = s_num.replace(regexStr , "$1,");
	return resultStr;
}

/**
 * 去除千分号
 * @param v_num
 * @returns
 */
function del_qfh(v_num){
	var s_num = '' + v_num
	var reStr = s_num.replace(/,/g, "");
	return reStr;
}
/**
 * 安全起见,隐藏	IP详情
 * 输入10.10.10.10 ---> ***.***.10.10
 */
function hide_ip(v_ip){
    /*var f_idx = v_ip.indexOf('\.');
    var s_idx = v_ip.indexOf('\.',f_idx + 1);
    
    v_ip = v_ip.substring(s_idx);
    v_ip = '***.***' + v_ip;
    return v_ip;*/
	//后台已经做了隐藏,前台直接返回.
	return v_ip;
}

