package com.lh.diary.mapper;

import com.lh.diary.common.MyMapper;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryPage;
import com.lh.diary.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface DiaryMapper extends MyMapper<Diary> {
    /**
     * 保存日记信息
     */
    int saveDiary(Diary diary);

    /**
     * 分页获取日记列表
     *
     * @param diaryPage
     */
    List<Diary> listDiary(@Param("diaryPage") DiaryPage diaryPage, @Param("user") User currUser);

    /**
     * 统计符合查询条件的日记记录数
     *
     * @param diaryPage
     * @return
     */
    int count(@Param("diaryPage") DiaryPage diaryPage, @Param("user") User currUser);

    /**
     * 根据 ID 获取日记信息
     *
     * @param id
     */
    @Select("SELECT * FROM tb_diary WHERE id = #{id}")
    Diary getDiaryById(Long id);

    /**
     * 修改日记状态
     *
     * @param diaryId
     * @param status
     */
    @Update("UPDATE tb_diary SET status = #{status} WHERE id = #{id}")
    void updateDiaryStatus(@Param("id") Long diaryId, @Param("status") int status);

    void updateDiary(Diary diary);

    @Select("SELECT * FROM tb_diary WHERE write_date = #{writeDate} AND user_id = #{userId} AND status >= 0;")
    List<Diary> queryDiaryByWrite(Diary diary);

    // @Select("SELECT * FROM tb_diary WHERE user_id = #{uId} AND status <> -1 AND score >= 3 ORDER BY write_date DESC")
    List<Diary> getDiaryByScore(Long uId);
}
