package com.lh.diary.mapper;

import com.lh.diary.common.MyMapper;
import com.lh.diary.pojo.DiaryContent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DiaryContentMapper extends MyMapper<DiaryContent> {
    /**
     * 保存日记内容
     *
     * @param diaryContent
     */
    void saveContent(DiaryContent diaryContent);

    /**
     * 根据 ID 获取日记内容
     *
     * @param diaryId
     * @return
     */
    @Select("SELECT * FROM tb_diary_content WHERE diary_id = #{diaryId}")
    DiaryContent getDiaryContentById(Long diaryId);

    void updateContent(DiaryContent dc);
}
