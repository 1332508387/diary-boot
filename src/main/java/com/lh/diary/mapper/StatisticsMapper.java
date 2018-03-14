package com.lh.diary.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Mapper
public interface StatisticsMapper {
    /**
     * 获取当前用户开写日记日期
     *
     * @param uid
     * @return
     */
    @Select("SELECT write_date " +
            "FROM tb_diary " +
            "WHERE user_id = #{uid} AND status <> -1 " +
            "ORDER BY write_date " +
            "LIMIT 0, 1")
    Date getStartDate(Long uid);

    Map<Object,Object> amount(Long uid);

    @Select("(SELECT DATE_FORMAT(write_date,'%Y-%m-%d') wd "
            + "FROM tb_diary "
            + "WHERE user_id = #{userId} AND status >= 0 AND write_date BETWEEN #{startDate} AND #{endDate}) "
            + "UNION ALL "
            + "(SELECT DATE_FORMAT(MIN(write_date),'%Y-%m-%d') wd "
            + "FROM tb_diary "
            + "WHERE user_id = #{userId} AND status >= 0) ORDER BY wd")
    List<String> getWriteDateList2(Map<String, Object> params);

    @Select("SELECT tm.name, COUNT(*) AS value FROM tb_diary AS td INNER JOIN tb_mood AS tm ON td.mood_id = tm.id WHERE td.user_id = #{uid} AND td.status <> -1 GROUP BY td.mood_id\n")
    List<Map<Object,Object>> getMoodAndAmountMap(Long uid);
}
