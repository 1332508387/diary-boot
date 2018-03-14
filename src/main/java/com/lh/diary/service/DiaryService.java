package com.lh.diary.service;

import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryContent;
import com.lh.diary.pojo.DiaryPage;
import com.lh.diary.pojo.User;

import java.util.List;

public interface DiaryService {
    /**
     * 分页获取日记列表
     *
     * @param diaryPage
     * @return
     */
    List<Diary> listDiary(DiaryPage diaryPage, User currUser);

    /**
     * 保存日记信息
     */
    SysResult saveDiary(Diary diary, DiaryContent content);

    /**
     * 统计符合条件的列表记录数
     *
     * @param diaryPage
     * @return
     */
    int count(DiaryPage diaryPage, User currUser);

    /**
     * 根据 ID 获取日记信息
     *
     * @param id
     * @return
     */
    List<Diary> getDiaryById(Long id);

    /**
     * 删除指定 ID 的日记记录
     *
     * @param diaryId
     */
    void removeDiary(Long diaryId);

    void updateDiary(Diary diary, DiaryContent content);

    Diary getDiary(Diary diary);

    List<Diary> getDiaryByScore(Long uId);
}
