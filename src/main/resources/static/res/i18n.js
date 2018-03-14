function loadProperties(){
	jQuery.i18n.properties({//加载properties文件
		name:'message',//properties文件名称
		path:'classpath:messages/',//properties文件路径
		mode:'map',//用 Map 的方式使用资源文件中的值
		callback: function() {//加载成功后设置显示内容
//			alert($.i18n.prop('sys.name'));//其中sys.name为properties文件中需要查找到的数据的key值
		}
    });
}