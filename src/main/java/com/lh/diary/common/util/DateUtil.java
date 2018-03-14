package com.lh.diary.common.util;

import com.lh.diary.common.DateFormatContant;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

	public static String getDate(String pattern){
		return new SimpleDateFormat(pattern).format(new Date());
	} 
	
	public static String getDate(Date date, String pattern){
		return new SimpleDateFormat(pattern).format(date);
	}

	public static Date parseDate(String dateStr, String pattern) throws ParseException {
		return new SimpleDateFormat(DateFormatContant.FORMAT2).parse(dateStr);
	}
	
}
