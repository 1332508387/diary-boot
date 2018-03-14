/**
 * 定位。调用 getLocation();
 * IE，Edge 可用，Chrome，Firefox 会访问 Google
 */
function setLocation(){   
    if (navigator.geolocation){   
        navigator.geolocation.getCurrentPosition(showPosition,showError);   
    }else{   
        alert("浏览器不支持地理定位。");   
    }   
} 
function showError(error){   
    switch(error.code) {
        case error.PERMISSION_DENIED:   
            //alert("定位失败,用户拒绝请求地理定位");   
            break;   
        case error.POSITION_UNAVAILABLE:   
            //alert("定位失败,位置信息是不可用");   
            break;   
        case error.TIMEOUT:   
            //alert("定位失败,请求获取用户位置超时");   
            break;   
        case error.UNKNOWN_ERROR:   
            //alert("定位失败,定位系统失效");   
            break;   
    }
}  
function showPosition(position){   
    var latlon = position.coords.latitude+','+position.coords.longitude;   
    //baidu   
    var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location="+latlon+"&output=json&pois=0";   
    $.ajax({    
        type: "GET",    
        dataType: "jsonp",    
        url: url,  
        beforeSend: function(){   
            //$("#baidu_geo").html('正在定位...');   
        },   
        success: function (json) {    
            if(json.status==0){   
                //$("#baidu_geo").html(json.result.formatted_address); 
            	$("#editForm input[name=site]").val(json.result.formatted_address);
            }   
        },   
        error: function (XMLHttpRequest, textStatus, errorThrown) {    
            //$("#baidu_geo").html(latlon+"地址位置获取失败"); 
        }   
    });   
}