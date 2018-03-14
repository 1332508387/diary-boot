# diary-boot(个人日记管理系统)
>[简述](#简述)  
[开发环境](#开发环境)  
[主要技术](#主要技术)  
[功能介绍](#功能介绍)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[日记管理](#日记管理)  
&nbsp;&nbsp;&nbsp;&nbsp;[写作日历](#写作日历)  
&nbsp;&nbsp;&nbsp;&nbsp;[统计图](#统计图)  
&nbsp;&nbsp;&nbsp;&nbsp;[时间轴](#时间轴)  
&nbsp;&nbsp;&nbsp;&nbsp;[异常记录管理](#异常记录管理)  
[其他](#其他)
## 简述
>如果你有写日记的习惯，想要记录生活中的重要事件，那么diary-boot将是一个不错的选择。有了它，你将不需要日记本和笔，
只要有网络就能随时随地记录你的感受。
## 开发环境
* IntelliJ IDEA
* JDK 1.8
* MySQL 5.7
## 主要技术
* SpringBoot
* MyBatis
* Shiro
## 功能介绍
### 日记管理
>登录账号后，依次点击 “日记管理” -> “添加”。在弹出的模块中写日记操作。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_142046.png)

>日记“等级” >= 3 的日记将被标记为重要事件，在时间轴显示。
可以将日记“类型”设置为“锁定”，此时你将被要求输入一个日记密码，日记内容将不能在日记列表显示；查看和更改被“锁定”日记时将被
要求输入正确的密码，才能展示。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_142319.png)

### 写作日历
>点击“写作日历”，可查看每一天是否已写日记。蓝色标记为已写，点击可查看日记内容；红色为漏写，点击可添加日记。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_142734.png)

### 统计图
>主页柱形图统计从开始写日记到当前日期，漏写和已写的天数；饼状图统计所有已写日记的心情比例(添加日记时所选心情)，清楚的反映出自己的状态。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_143117.png)

### 时间轴
>时间轴将按时间顺序显示，"等级" >= 3(添加日记时所选的星星数量)的日记，可以清楚的看到那一天经历了那件重要的事。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_143700.png)

### 异常记录管理
>记录程序中遇到的刻骨铭心的Exception，以及解决方案。

![image](https://github.com/1332508387/diary-boot/blob/master/src/main/resources/upload/2018-03-14_144148.png)

## 其他
>日记信息使用DES加密后存入数据库
