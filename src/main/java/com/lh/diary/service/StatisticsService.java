package com.lh.diary.service;

import com.lh.diary.pojo.Diary;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    /**
     * 获取当前用户开始写日记的日期
     *
     * @param uid
     * @return
     */
    Date getStartDate(Long uid);

    Map<Object,Object> amount(Long uid);

    List<String> getWriteDateList2(Long uid, Date startDate, Date endDate);

    /**
     * 统计用户所写日记心情和其数量
     *
     * @param uid
     * @return
     */
    List<Map<Object,Object>> getMoodAndAmountMap(Long uid);

    Map<String, List<Diary>> statisticsForTimeline(Long id);
}
