package com.lh.diary.service.impl;

import com.lh.diary.mapper.CalendarMapper;
import com.lh.diary.service.CalendarService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class CalendarServiceImpl implements CalendarService {
    @Resource
    private CalendarMapper calendarMapper;
}
