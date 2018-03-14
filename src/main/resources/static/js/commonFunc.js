var format1 = "yyyy年M月d日";
var format2 = "yyyy-MM-dd";
var format3 = "yyyy-MM-dd hh:mm:ss";
var format4 = "MM月dd日";
var format5 = "hh时mm分";
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

// Base64 解码，编码时调用 BASE64.encoder()
function base64Decoder(base){
    var unicode= BASE64.decoder(base); // 返回会解码后的unicode码数组
    // 将 Unicode 编码转化为字符串
    var content = '';
    for(var i = 0 , len =  unicode.length ; i < len ;++i){
        content += String.fromCharCode(unicode[i]);
    }
    return content;
}