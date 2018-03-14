/*
 * 饼形图
 */
var myChart = echarts.init(document.getElementById('content-show'));
myChart.showLoading();				
$.post(rootPath + "/admin/user/machine/showPie",function(data){
	myChart.hideLoading();
	myChart.setOption({
    title : {
        text: '智住状态监测',
        subtext: 'T1使用状态',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正常运行','未开机']
    },
    series : [
        {
            name: '智住状态',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:data.model,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
	});
});
/**
 * 柱形图
 */
var myChart2 = echarts.init(document.getElementById('content-zhuti'));
myChart2.showLoading();
$.post(rootPath + "/admin/user/machine/showCategory",function(data){
	myChart2.hideLoading();
	myChart2.setOption({
	title  : {
	text   : '智住分布图',
	subtext: 'T1使用状态'
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
            }
	    },
	    legend: {
	        data:['正常运行','未开机'],
	        bottom:'bottom'
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : data.model[0]
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'正常运行',
	            type:'bar',
	            data:data.model[1]
	        },
	        {
	            name:'未开机',
	            type:'bar',
	        	data:data.model[2]
	        }
	    ]
	});
});

/**
 *地图 
 */

var myChart3 = echarts.init(document.getElementById('ditu'));
myChart3.showLoading();
//$.get('http://echarts.baidu.com/gallery/data/asset/data/weibo.json', function (weiboData) {
$.getJSON(rootPath+'/js/admin/user/weibo.json', function (weiboData) {
    myChart3.hideLoading();

    weiboData = weiboData.map(function (serieData, idx) {
        var px = serieData[0] / 1000;
        var py = serieData[1] / 1000;
        var res = [[px, py]];

        for (var i = 2; i < serieData.length; i += 2) {
            var dx = serieData[i] / 1000;
            var dy = serieData[i + 1] / 1000;
            var x = px + dx;
            var y = py + dy;
            res.push([x.toFixed(2), y.toFixed(2), 1]);

            px = x;
            py = y;
        }
        return res;
    });
    myChart3.setOption(option = {
        backgroundColor: '#404a59',
        title : {
            text: '全国分布图（智住）',
            subtext: 'CEITC-点亮中国',
            sublink: 'http://www.thinkgis.cn/public/sina',
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {},
        legend: {
            left: 'left',
            data: ['数量多', '数量适中', '数量少'],
            textStyle: {
                color: '#ccc'
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [{
            name: '数量少',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 1,
            
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 2,
                    shadowColor: 'rgba(37, 140, 249, 0.8)',
                    color: 'rgba(37, 140, 249, 0.8)'
                }
            },
            data: weiboData[0]
        }, {
            name: '数量适中',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 1,
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 2,
                    shadowColor: 'rgba(14, 241, 242, 0.8)',
                    color: 'rgba(14, 241, 242, 0.8)'
                }
            },
            data: weiboData[1]
        }, {
            name: '数量多',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 1,
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 2,
                    shadowColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            data: weiboData[2]
        }]
    });
});