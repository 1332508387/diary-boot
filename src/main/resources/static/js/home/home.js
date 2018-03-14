$(function(){
    $.ajax({
        url: path + "/statistics/diary/startDate",
        success: function(data){
            $("#startDate").text("开写日期：" + data.data);
        }
    });
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('diary_amount_statistics'));
    var myChart2 = echarts.init(document.getElementById('diary_mood_statistics'));
    $.ajax({
        url: path + "/statistics/diary/amount",
        success: function(data){
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '日记数量统计',
                    subtext: '数量',
                    x:'center'
                },
                tooltip: {},
                legend: {
                    data:['数量']
                },
                xAxis: {
                    data: ["应写","已写","漏写"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [data.data['all_days'], data.data['real_days'], data.data['miss_days']]
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        error: function(){
            alert('出错了')
        }
    });

    $.ajax({
        type: 'GET',
        url: '/statistics/diary/mood',
        success: function(data) {
            if (data.status != 200) return;
            var option2 = {
                "title" : {
                    text: '日记心情统计',
                    subtext: '心情',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.data['legendDataList']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:data.data['seriesDataList'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            //var option2 = moodStatistics();
            myChart2.setOption(option2);
        }
    });




});

// 获取日记心情统计信息
function moodStatistics() {
    var result = null;
    $.ajax({
        type: 'GET',
        async: false,
        url: '/statistics/diary/mood',
        success: function(data) {
            if (data.status == 200) {
                // 将返回的 json 串转化为 json 对象
                result = JSON.parse(data.data);
            }
        }
    });
    return result;
}