package com.lh.diary.controller;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateController {
	/**
	 * 格式化时间，将前端传来的日期字符串转化为 Java Date 对象
	 */
	protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		// 注册一个自定义格式转换器
		binder.registerCustomEditor(Date.class, new CustomDateEditor(df,true));
	}

	@org.springframework.web.bind.annotation.InitBinder
	public void InitBinder (ServletRequestDataBinder binder){
		binder.registerCustomEditor(
			Date.class,
			new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
	}
}
