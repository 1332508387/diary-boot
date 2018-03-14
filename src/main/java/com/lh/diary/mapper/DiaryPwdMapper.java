package com.lh.diary.mapper;

import com.lh.diary.common.MyMapper;
import com.lh.diary.pojo.DiaryPwd;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DiaryPwdMapper extends MyMapper<DiaryPwd>{
    @Select("SELECT * FROM tb_diary_pwd WHERE user_id = #{uid}")
    DiaryPwd getDiaryPwdByUId(Long uid);
}
